"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import jsPDF from "jspdf";
import { getSamplePlan, type PlanMonth } from "./samplePlan";

const loadingSteps = [
  "Analyzing your climate zone",
  "Checking soil temperature data",
  "Building fertilizer schedule",
  "Generating weekly tasks",
];

/* ─── Plan Flow Component ─── */

function PlanFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const zip = searchParams.get("zip") || "";
  const grassType = searchParams.get("grassType") || "";
  const lawnSize = searchParams.get("lawnSize") || "";
  const sunExposure = searchParams.get("sunExposure") || "";
  const lawnGoal = searchParams.get("lawnGoal") || "";
  const path = searchParams.get("path") || "novice";

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [plan, setPlan] = useState<PlanMonth[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 0: true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ "0-0": true });
  const [rawPlanText, setRawPlanText] = useState("");
  const hasFetched = useRef(false);

  // Conversion funnel state
  const [conversionStep, setConversionStep] = useState<"photos" | "analyzing" | "diagnosis" | "email">("photos");
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepIdx, setAnalysisStepIdx] = useState(0);

  const parsePlan = useCallback((text: string): PlanMonth[] => {
    const months: PlanMonth[] = [];
    let currentMonth: PlanMonth | null = null;
    let currentWeek: { label: string; tasks: string[] } | null = null;

    const lines = text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();

      const monthMatch = trimmed.match(
        /^(?:#{1,3}\s*)?(?:\*{1,2})?(?:Month\s*\d+:\s*)?([A-Z][A-Za-z]+)(?:\*{1,2})?$/
      );
      if (
        monthMatch &&
        [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ].some((m) => trimmed.toUpperCase().includes(m.toUpperCase()))
      ) {
        if (currentMonth) {
          if (currentWeek) currentMonth.weeks.push(currentWeek);
          months.push(currentMonth);
        }
        currentMonth = { name: monthMatch[1].toUpperCase(), weeks: [] };
        currentWeek = null;
        continue;
      }

      const weekMatch = trimmed.match(/^(?:#{1,4}\s*)?(?:\*{1,2})?\s*Week\s*(\d+)(?:\s*[\(:].+?)?(?:\*{1,2})?:?\s*$/i)
        || trimmed.match(/^(?:#{1,4}\s*)?(?:\*{1,2})?\s*Week\s*(\d+)\s*[\(:](.+?)[\):]?\s*(?:\*{1,2})?$/i);
      if (weekMatch) {
        if (currentWeek && currentMonth) {
          currentMonth.weeks.push(currentWeek);
        }
        const weekNum = weekMatch[1];
        const dateRange = weekMatch[2] ? weekMatch[2].trim().replace(/[()]/g, "") : "";
        currentWeek = {
          label: `Week ${weekNum}${dateRange ? ` (${dateRange})` : ""}`,
          tasks: [],
        };
        continue;
      }

      const taskMatch = trimmed.match(/^(?:[-*]|\[.\]|☐|•)\s+(.+)$/);
      if (taskMatch && currentWeek) {
        currentWeek.tasks.push(taskMatch[1]);
        continue;
      }

      const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch && currentWeek) {
        currentWeek.tasks.push(numberedMatch[1]);
      }
    }

    if (currentWeek && currentMonth) currentMonth.weeks.push(currentWeek);
    if (currentMonth) months.push(currentMonth);

    return months;
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const stepInterval = setInterval(() => {
      setLoadingStepIdx((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 800);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 600);

    const goalLabels: Record<string, string> = {
      fix: "Fix major issues (weeds, bare spots)",
      maintain: "Maintain a healthy lawn",
      perfect: "Achieve the best lawn possible",
      not_sure: "General lawn improvement",
    };

    const grassLabels: Record<string, string> = {
      bermuda: "Bermuda",
      zoysia: "Zoysia",
      fescue_kbg: "Fescue/KBG",
      st_augustine: "St. Augustine",
      not_sure: "Unknown (recommend based on climate zone)",
    };

    const sizeLabels: Record<string, string> = {
      small: "Small (under 2,500 sq ft)",
      medium: "Medium (2,500-10,000 sq ft)",
      large: "Large (over 10,000 sq ft)",
    };

    const userPrompt = `Generate a 90-day lawn care plan for this homeowner:

- Zip Code: ${zip}
- Grass Type: ${grassLabels[grassType] || grassType}
- Lawn Size: ${sizeLabels[lawnSize] || lawnSize}
- Sun Exposure: ${sunExposure}
- Goal: ${goalLabels[lawnGoal] || lawnGoal}
- Current Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Format the plan as:
## MONTH_NAME
### Week N (date range)
- Task description
- Task description

Cover 3 months. Include specific products when recommending fertilizers or treatments. Include mowing heights, watering guidance, and seasonal timing.`;

    const fetchPlan = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: userPrompt }],
            profile: {
              zipCode: zip,
              grassType,
              lawnSize,
              sunExposure,
            },
          }),
        });

        const data = await response.json();

        if (!data.error) {
          const parsed = parsePlan(data.content);
          if (parsed.length > 0 && parsed[0].weeks.length > 0) {
            // API returned a parseable plan — use it
            setRawPlanText(data.content);
            setPlan(parsed);
            return;
          }
        }
      } catch {
        // Fall through to sample plan
      }

      // Fallback: use sample plan
      setPlan(getSamplePlan(grassType, lawnSize, lawnGoal, path));
    };

    fetchPlan().finally(() => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoadingStepIdx(loadingSteps.length);
      setTimeout(() => setLoading(false), 500);
    });

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [zip, grassType, lawnSize, sunExposure, lawnGoal, path, parsePlan]);

  const toggleMonth = (idx: number) => {
    setExpandedMonths((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleWeek = (monthIdx: number, weekIdx: number) => {
    const key = `${monthIdx}-${weekIdx}`;
    setExpandedWeeks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-4xl mb-6">&#127793;</div>
          <h2 className="font-display text-xl font-bold text-deep-brown mb-6">
            Building your 90-day plan...
          </h2>

          <div className="w-full bg-deep-brown/10 rounded-full h-2 mb-8">
            <div
              className="h-2 bg-lawn rounded-full transition-all duration-500"
              style={{ width: `${Math.min(loadingProgress, 100)}%` }}
            />
          </div>

          <div className="text-left space-y-3">
            {loadingSteps.map((stepText, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {i < loadingStepIdx ? (
                  <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === loadingStepIdx ? (
                  <div className="w-4 h-4 rounded-full border-2 border-lawn border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-deep-brown/20 flex-shrink-0" />
                )}
                <span className={i <= loadingStepIdx ? "text-deep-brown" : "text-deep-brown/40"}>
                  {stepText}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const grassLabels: Record<string, string> = {
    bermuda: "Bermuda",
    zoysia: "Zoysia",
    fescue_kbg: "Fescue/KBG",
    st_augustine: "St. Augustine",
    not_sure: "Your lawn",
  };

  const goalLabels: Record<string, string> = {
    fix: "Fix It",
    maintain: "Maintain",
    perfect: "Perfect It",
    not_sure: "General Care",
  };

  const totalTasks = plan.reduce(
    (sum, m) => sum + m.weeks.reduce((ws, w) => ws + w.tasks.length, 0),
    0
  );

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 48;
    const contentW = pageW - margin * 2;
    let y = margin;

    const checkPage = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header bar
    doc.setFillColor(74, 103, 65); // lawn green
    doc.rect(0, 0, pageW, 72, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("LawnHQ", margin, 44);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Your 90-Day Lawn Care Plan", pageW - margin, 44, { align: "right" });

    y = 100;

    // Plan summary card
    doc.setFillColor(245, 242, 235); // cream
    doc.roundedRect(margin, y, contentW, 64, 6, 6, "F");
    doc.setFontSize(10);
    doc.setTextColor(45, 42, 38); // deep brown
    doc.setFont("helvetica", "normal");
    const summaryLine1 = `Grass: ${grassLabels[grassType] || grassType}  |  Size: ${lawnSize}  |  Goal: ${goalLabels[lawnGoal] || lawnGoal}`;
    const summaryLine2 = `Location: ${zip}  |  ${totalTasks} tasks over 12 weeks  |  Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
    doc.text(summaryLine1, margin + 16, y + 26);
    doc.setTextColor(100, 95, 90);
    doc.text(summaryLine2, margin + 16, y + 44);
    y += 84;

    // Months
    for (const month of plan) {
      checkPage(50);

      // Month header
      doc.setFillColor(74, 103, 65);
      doc.roundedRect(margin, y, contentW, 32, 4, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text(month.name, margin + 14, y + 21);
      y += 44;

      for (const week of month.weeks) {
        checkPage(30);

        // Week label
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(196, 120, 90); // terracotta
        doc.text(week.label.toUpperCase(), margin + 4, y);
        y += 6;

        // Divider line
        doc.setDrawColor(220, 215, 208);
        doc.setLineWidth(0.5);
        doc.line(margin + 4, y, margin + contentW - 4, y);
        y += 10;

        for (const task of week.tasks) {
          checkPage(28);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(60, 56, 50);

          // Checkbox
          doc.setDrawColor(180, 175, 168);
          doc.setLineWidth(0.8);
          doc.rect(margin + 8, y - 7, 8, 8);

          // Task text (wrap)
          const lines = doc.splitTextToSize(task, contentW - 32);
          doc.text(lines, margin + 22, y);
          y += lines.length * 13 + 4;
        }
        y += 8;
      }
      y += 6;
    }

    // Footer
    checkPage(40);
    doc.setDrawColor(220, 215, 208);
    doc.line(margin, y, margin + contentW, y);
    y += 16;
    doc.setFontSize(8);
    doc.setTextColor(150, 145, 138);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by LawnHQ — mylawnhq.com", margin, y);
    doc.text("Your plan adapts as you go. Upload a lawn photo for personalized diagnosis.", margin, y + 12);

    doc.save(`LawnHQ-90-Day-Plan.pdf`);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Warm header strip */}
      <div className="bg-lawn">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-lg">&#127793;</span>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              LawnHQ
            </span>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Hero header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-deep-brown leading-tight">
            Your 90-Day Plan
          </h1>
          <p className="mt-3 text-deep-brown/50 text-sm">
            Personalized for your lawn. Week by week.
          </p>

          {/* Summary pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 bg-lawn/8 text-lawn text-xs font-medium px-3 py-1.5 rounded-full border border-lawn/15">
              <span className="w-1.5 h-1.5 rounded-full bg-lawn" />
              {grassLabels[grassType] || grassType}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-terracotta/8 text-terracotta text-xs font-medium px-3 py-1.5 rounded-full border border-terracotta/15">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
              {goalLabels[lawnGoal] || lawnGoal}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-ochre/8 text-ochre text-xs font-medium px-3 py-1.5 rounded-full border border-ochre/15">
              <span className="w-1.5 h-1.5 rounded-full bg-ochre" />
              {zip}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-deep-brown/5 text-deep-brown/60 text-xs font-medium px-3 py-1.5 rounded-full border border-deep-brown/10">
              {totalTasks} tasks &middot; 12 weeks
            </span>
          </div>
        </div>

        {/* Plan months */}
        {plan.length > 0 ? (
          <div className="space-y-6">
            {plan.map((month, idx) => {
              const monthTaskCount = month.weeks.reduce((s, w) => s + w.tasks.length, 0);
              return (
                <div key={idx} className="overflow-hidden">
                  {/* Month header */}
                  <button
                    onClick={() => toggleMonth(idx)}
                    className="w-full group"
                  >
                    <div className={`flex items-center justify-between px-5 py-4 rounded-t-xl transition-colors ${
                      expandedMonths[idx]
                        ? "bg-lawn text-white"
                        : "bg-white border border-deep-brown/10 text-deep-brown rounded-b-xl hover:border-lawn/30"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-lg tracking-wide">
                          {month.name}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          expandedMonths[idx]
                            ? "bg-white/20 text-white"
                            : "bg-deep-brown/5 text-deep-brown/50"
                        }`}>
                          {monthTaskCount} tasks
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 transition-transform ${expandedMonths[idx] ? "rotate-180" : ""} ${
                          expandedMonths[idx] ? "text-white/70" : "text-deep-brown/30"
                        }`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Weeks */}
                  {expandedMonths[idx] && (
                    <div className="bg-white border border-t-0 border-deep-brown/10 rounded-b-xl divide-y divide-deep-brown/5">
                      {month.weeks.map((week, widx) => {
                        const weekKey = `${idx}-${widx}`;
                        const isWeekOpen = !!expandedWeeks[weekKey];
                        return (
                          <div key={widx}>
                            <button
                              onClick={() => toggleWeek(idx, widx)}
                              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-cream/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-terracotta uppercase tracking-widest">
                                  {week.label}
                                </span>
                                <span className="text-xs text-deep-brown/40">
                                  {week.tasks.length} tasks
                                </span>
                              </div>
                              <svg
                                className={`w-4 h-4 text-deep-brown/30 transition-transform ${isWeekOpen ? "rotate-180" : ""}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {isWeekOpen && (
                              <ul className="px-5 pb-4 space-y-3">
                                {week.tasks.map((task, tidx) => (
                                  <li
                                    key={tidx}
                                    className="flex items-start gap-3 text-sm text-deep-brown/80 leading-relaxed"
                                  >
                                    <div className="w-[18px] h-[18px] mt-0.5 rounded border-2 border-deep-brown/15 flex-shrink-0 hover:border-lawn/40 transition-colors cursor-pointer" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-deep-brown/10 p-6">
            <div className="prose prose-sm max-w-none text-deep-brown/80 whitespace-pre-wrap">
              {rawPlanText}
            </div>
          </div>
        )}

        {/* ─── Conversion Funnel ─── */}
        <div className="mt-12 bg-white rounded-xl border border-deep-brown/10 p-6 sm:p-8">

          {/* Stage 1: Photo Upload */}
          {conversionStep === "photos" && (
            <div>
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-deep-brown text-center mb-4">
                  We can&rsquo;t spot problems we can&rsquo;t see
                </h3>
                {/* Checklist instead of progress bar */}
                <div className="space-y-2 mb-4">
                  {[
                    { done: true, label: "Climate zone analyzed" },
                    { done: true, label: "Grass type matched" },
                    { done: true, label: "Schedule built" },
                    { done: false, label: "Weed scan", note: "needs photos" },
                    { done: false, label: "Damage & stress detection", note: "needs photos" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {item.done ? (
                        <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-deep-brown/20 flex-shrink-0" />
                      )}
                      <span className={item.done ? "text-deep-brown/70" : "text-deep-brown/50"}>
                        {item.label}
                        {item.note && <span className="text-deep-brown/30 ml-1">({item.note})</span>}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-deep-brown/70 leading-relaxed text-center">
                  Snap a few photos and we&rsquo;ll diagnose weeds, dead spots, and disease — then add targeted fixes to your plan.
                </p>
                <p className="mt-1 text-xs text-deep-brown/40 text-center">
                  30 seconds. Like having a lawn pro walk your yard.
                </p>
              </div>

              {/* 2x2 Photo Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                  { id: "front", label: "Front Yard" },
                  { id: "back", label: "Back Yard" },
                  { id: "left-side", label: "Left Side" },
                  { id: "right-side", label: "Right Side" },
                ] as const).map((area) => (
                  <div key={area.id} className="relative">
                    {photos[area.id] ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-lawn/30">
                        <img src={photos[area.id]} alt={area.label} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 w-6 h-6 bg-lawn rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <button
                          onClick={() => setPhotos((prev) => { const next = { ...prev }; delete next[area.id]; return next; })}
                          className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-medium px-2 py-1 rounded hover:bg-black/70 transition-colors"
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-lg border-2 border-dashed border-deep-brown/15 flex flex-col items-center justify-center gap-1.5 px-2">
                        <span className="text-xs text-deep-brown/50 font-semibold">{area.label}</span>
                        {/* Primary: opens camera on mobile */}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                setPhotos((prev) => ({ ...prev, [area.id]: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                              e.target.value = "";
                            }}
                          />
                          <div className="flex items-center gap-1.5 bg-terracotta text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-terracotta/90 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Take Photo
                          </div>
                        </label>
                        {/* Secondary: opens gallery/file picker */}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                setPhotos((prev) => ({ ...prev, [area.id]: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                              e.target.value = "";
                            }}
                          />
                          <span className="text-[10px] text-deep-brown/35 hover:text-deep-brown/55 transition-colors underline underline-offset-2">
                            or choose from gallery
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center text-xs text-deep-brown/40 mb-4">
                {Object.keys(photos).length}/4 photos added
              </div>

              <button
                onClick={() => {
                  setConversionStep("analyzing");
                  setAnalysisProgress(0);
                  setAnalysisStepIdx(0);
                  const analysisSteps = 4;
                  const stepTimer = setInterval(() => {
                    setAnalysisStepIdx((prev) => {
                      if (prev >= analysisSteps) { clearInterval(stepTimer); return prev; }
                      return prev + 1;
                    });
                  }, 700);
                  const progressTimer = setInterval(() => {
                    setAnalysisProgress((prev) => {
                      if (prev >= 100) { clearInterval(progressTimer); return 100; }
                      return prev + Math.random() * 15 + 10;
                    });
                  }, 400);
                  setTimeout(() => {
                    clearInterval(stepTimer);
                    clearInterval(progressTimer);
                    setAnalysisProgress(100);
                    setAnalysisStepIdx(analysisSteps);
                    setTimeout(() => setConversionStep("diagnosis"), 500);
                  }, 3000);
                }}
                disabled={Object.keys(photos).length === 0}
                className="w-full bg-terracotta text-white font-semibold py-3 px-6 rounded-lg text-sm hover:bg-terracotta/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Scan My Lawn
              </button>

              <button
                onClick={() => setConversionStep("email")}
                className="mt-3 w-full text-center text-xs text-deep-brown/40 hover:text-deep-brown/60 transition-colors"
              >
                Skip diagnosis &rarr;
              </button>
            </div>
          )}

          {/* Stage 2: Analyzing */}
          {conversionStep === "analyzing" && (
            <div className="text-center">
              <div className="text-4xl mb-4">&#128269;</div>
              <h3 className="font-display text-xl font-bold text-deep-brown mb-4">
                Analyzing your lawn...
              </h3>
              <div className="w-full bg-deep-brown/10 rounded-full h-2 mb-6">
                <div
                  className="h-2 bg-lawn rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(analysisProgress, 100)}%` }}
                />
              </div>
              <div className="text-left space-y-3">
                {["Scanning for crabgrass and dandelions...", "Checking for brown or dead patches...", "Looking for bare or thin areas...", "Detecting signs of disease or stress..."].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {i < analysisStepIdx ? (
                      <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i === analysisStepIdx ? (
                      <div className="w-4 h-4 rounded-full border-2 border-lawn border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-deep-brown/20 flex-shrink-0" />
                    )}
                    <span className={i <= analysisStepIdx ? "text-deep-brown" : "text-deep-brown/40"}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 3: Diagnosis */}
          {conversionStep === "diagnosis" && (
            <div>
              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-bold text-deep-brown">
                  We found 3 issues
                </h3>
              </div>

              {/* Uploaded photo thumbnails */}
              {Object.keys(photos).length > 0 && (
                <div className="flex gap-2 mb-6 justify-center">
                  {Object.entries(photos).map(([id, src]) => (
                    <div key={id} className="w-16 h-16 rounded-lg overflow-hidden border border-deep-brown/10">
                      <img src={src} alt={id} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Findings */}
              <div className="space-y-4 mb-6">
                <div className="border border-terracotta/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-sm text-deep-brown">Possible crabgrass detected</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">
                      High
                    </span>
                  </div>
                  <p className="text-xs text-deep-brown/60 leading-relaxed">
                    We spotted patches consistent with crabgrass in your front yard. Pre-emergent treatment has been added to your plan.
                  </p>
                </div>
                <div className="border border-ochre/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-sm text-deep-brown">Thin coverage in back yard</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-ochre/10 text-ochre px-2 py-0.5 rounded-full">
                      Medium
                    </span>
                  </div>
                  <p className="text-xs text-deep-brown/60 leading-relaxed">
                    The back yard shows signs of thin turf density. Overseeding and soil amendment recommendations have been added.
                  </p>
                </div>
                <div className="border border-ochre/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-sm text-deep-brown">Stressed grass near driveway</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-ochre/10 text-ochre px-2 py-0.5 rounded-full">
                      Medium
                    </span>
                  </div>
                  <p className="text-xs text-deep-brown/60 leading-relaxed">
                    We detected signs of heat stress or drought damage along hardscape edges. Deep watering recommendations have been added.
                  </p>
                </div>
              </div>

              <p className="text-sm text-deep-brown/60 text-center mb-6">
                We&rsquo;ve added <strong>3 targeted fixes</strong> to your plan based on these findings.
              </p>

              <button
                onClick={() => setConversionStep("email")}
                className="w-full bg-terracotta text-white font-semibold py-3 px-6 rounded-lg text-sm hover:bg-terracotta/90 transition-colors"
              >
                Get my plan + diagnosis
              </button>
            </div>
          )}

          {/* Stage 4: Email Gate */}
          {conversionStep === "email" && !emailSubmitted && (
            <div className="text-center">
              <h3 className="font-display text-xl font-bold text-deep-brown mb-2">
                {Object.keys(photos).length > 0 ? "Where should we send your diagnosis?" : "Where should we send your plan?"}
              </h3>
              <p className="text-sm text-deep-brown/50 mb-6">
                We&rsquo;ll email your plan and remind you when each task is due.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmailError("");
                  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setEmailError("Please enter a valid email address.");
                    return;
                  }
                  setEmailSubmitted(true);
                }}
                className="max-w-sm mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="you@email.com"
                  className="w-full border border-deep-brown/15 rounded-lg px-4 py-3 text-sm text-deep-brown placeholder:text-deep-brown/30 focus:outline-none focus:ring-2 focus:ring-lawn/40 focus:border-lawn/40 mb-2"
                />
                {emailError && (
                  <p className="text-xs text-red-500 mb-2 text-left">{emailError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-terracotta text-white font-bold py-3 px-6 rounded-lg text-sm uppercase tracking-wide hover:bg-terracotta/90 transition-colors"
                >
                  Send My Plan
                </button>
              </form>

              <ul className="mt-6 space-y-2 text-left max-w-sm mx-auto">
                {["Your full 90-day plan", "Reminders before each task is due", "Free forever — no credit card"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-deep-brown/60">
                    <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Email submitted confirmation + Pro upsell */}
          {conversionStep === "email" && emailSubmitted && (
            <div className="py-2">
              {/* Success message */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-lawn/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-deep-brown">
                  Plan saved!
                </h3>
                <p className="text-sm text-deep-brown/50">
                  We&rsquo;ll send it to <strong>{email}</strong>
                </p>
              </div>

              {/* Pro upsell card */}
              <div className="bg-gradient-to-br from-lawn/5 to-lawn/10 border border-lawn/20 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#127775;</span>
                  <span className="font-display font-bold text-deep-brown">Upgrade to Pro</span>
                  <span className="ml-auto text-xs font-bold text-lawn bg-lawn/10 px-2 py-0.5 rounded-full">$4/mo</span>
                </div>

                <ul className="space-y-2 mb-4">
                  {[
                    "SMS reminders before each task",
                    "AI chat for lawn questions anytime",
                    "Monthly progress photos & tracking",
                    "Priority support from lawn experts",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-deep-brown/70">
                      <svg className="w-4 h-4 text-lawn flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("email", email);
                    params.set("upgrade", "pro");
                    router.push(`/sandbox/save?${params.toString()}`);
                  }}
                  className="w-full bg-lawn text-white font-bold py-3 px-6 rounded-lg text-sm hover:bg-lawn/90 transition-colors"
                >
                  Start 7-day free trial
                </button>
                <p className="text-[10px] text-deep-brown/40 text-center mt-2">
                  Cancel anytime. No commitment.
                </p>
              </div>

              {/* Skip option */}
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("email", email);
                  router.push(`/sandbox/save?${params.toString()}`);
                }}
                className="w-full text-center text-xs text-deep-brown/40 hover:text-deep-brown/60 transition-colors"
              >
                Continue with free plan &rarr;
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <PlanFlow />
    </Suspense>
  );
}
