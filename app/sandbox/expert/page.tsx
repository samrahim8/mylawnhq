"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface ExpertFormData {
  zip: string;
  grassType: string;
  lawnSize: string;
  sunExposure: string;
  lawnAge: string;
  lawnGoal: string;
  mowerType: string;
  spreaderType: string;
  irrigationSystem: string;
  issues: string[];
  soilType: string;
  hasSoilTest: string;
}

function ExpertFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<ExpertFormData>({
    zip: searchParams.get("zip") || "",
    grassType: "",
    lawnSize: "",
    sunExposure: "",
    lawnAge: "",
    lawnGoal: "",
    mowerType: "",
    spreaderType: "",
    irrigationSystem: "",
    issues: [],
    soilType: "",
    hasSoilTest: "",
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    location: true,
    basics: true,
    equipment: false,
    issues: false,
    soil: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setField = (field: keyof ExpertFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleIssue = (issue: string) => {
    setForm((prev) => ({
      ...prev,
      issues: prev.issues.includes(issue)
        ? prev.issues.filter((i) => i !== issue)
        : [...prev.issues, issue],
    }));
  };

  const canSubmit = form.zip && form.grassType && form.lawnSize && form.sunExposure && form.lawnGoal;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const params = new URLSearchParams({
      zip: form.zip,
      grassType: form.grassType,
      lawnSize: form.lawnSize,
      sunExposure: form.sunExposure,
      lawnGoal: form.lawnGoal,
      path: "expert",
      ...(form.lawnAge && { lawnAge: form.lawnAge }),
      ...(form.mowerType && { mowerType: form.mowerType }),
      ...(form.spreaderType && { spreaderType: form.spreaderType }),
      ...(form.irrigationSystem && { irrigationSystem: form.irrigationSystem }),
      ...(form.issues.length > 0 && { issues: form.issues.join(",") }),
      ...(form.soilType && { soilType: form.soilType }),
      ...(form.hasSoilTest && { hasSoilTest: form.hasSoilTest }),
    });
    router.push(`/sandbox/plan?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <button
          onClick={() => router.push("/sandbox")}
          className="text-sm text-deep-brown/50 hover:text-deep-brown transition-colors flex items-center gap-1 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-deep-brown">
          Tell us about your lawn
        </h1>
        <p className="mt-2 text-deep-brown/60">
          The more detail, the better your plan.
        </p>

        <div className="mt-8 space-y-4">
          {/* Location */}
          <CollapsibleSection
            icon="&#128205;"
            title="LOCATION"
            expanded={expandedSections.location}
            onToggle={() => toggleSection("location")}
          >
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                Zip Code <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={form.zip}
                onChange={(e) => setField("zip", e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 78701"
                className="w-full max-w-[200px] px-4 py-2.5 rounded-lg border border-deep-brown/15 bg-cream/50 text-deep-brown placeholder:text-deep-brown/30 focus:outline-none focus:ring-2 focus:ring-lawn/30"
              />
            </div>
          </CollapsibleSection>

          {/* Lawn Basics */}
          <CollapsibleSection
            icon="&#127793;"
            title="LAWN BASICS"
            expanded={expandedSections.basics}
            onToggle={() => toggleSection("basics")}
          >
            <div className="space-y-6">
              {/* Grass Type */}
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Grass Type <span className="text-terracotta">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "bermuda", label: "Bermuda" },
                    { value: "zoysia", label: "Zoysia" },
                    { value: "fescue_kbg", label: "Fescue/KBG" },
                    { value: "st_augustine", label: "St. Augustine" },
                  ].map((opt) => (
                    <ChipButton
                      key={opt.value}
                      selected={form.grassType === opt.value}
                      onClick={() => setField("grassType", opt.value)}
                    >
                      {opt.label}
                    </ChipButton>
                  ))}
                </div>
              </div>

              {/* Lawn Size */}
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Lawn Size <span className="text-terracotta">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "small", label: "Small", sub: "< 2,500 sq ft" },
                    { value: "medium", label: "Medium", sub: "2.5k-10k sq ft" },
                    { value: "large", label: "Large", sub: "> 10,000 sq ft" },
                  ].map((opt) => (
                    <ChipButton
                      key={opt.value}
                      selected={form.lawnSize === opt.value}
                      onClick={() => setField("lawnSize", opt.value)}
                    >
                      <span>{opt.label}</span>
                      <span className="text-xs opacity-60 ml-1">{opt.sub}</span>
                    </ChipButton>
                  ))}
                </div>
              </div>

              {/* Sun Exposure */}
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Sun Exposure <span className="text-terracotta">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "full", label: "Full Sun" },
                    { value: "partial", label: "Partial" },
                    { value: "shade", label: "Shade" },
                  ].map((opt) => (
                    <ChipButton
                      key={opt.value}
                      selected={form.sunExposure === opt.value}
                      onClick={() => setField("sunExposure", opt.value)}
                    >
                      {opt.label}
                    </ChipButton>
                  ))}
                </div>
              </div>

              {/* Lawn Age */}
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Lawn Age
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "new", label: "New (< 1 year)" },
                    { value: "established", label: "Established (1+ years)" },
                  ].map((opt) => (
                    <ChipButton
                      key={opt.value}
                      selected={form.lawnAge === opt.value}
                      onClick={() => setField("lawnAge", opt.value)}
                    >
                      {opt.label}
                    </ChipButton>
                  ))}
                </div>
              </div>

              {/* Lawn Goal */}
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Lawn Goal <span className="text-terracotta">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "fix", label: "Fix It" },
                    { value: "maintain", label: "Maintain" },
                    { value: "perfect", label: "Perfect It" },
                  ].map((opt) => (
                    <ChipButton
                      key={opt.value}
                      selected={form.lawnGoal === opt.value}
                      onClick={() => setField("lawnGoal", opt.value)}
                    >
                      {opt.label}
                    </ChipButton>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Equipment */}
          <CollapsibleSection
            icon="&#128295;"
            title="EQUIPMENT"
            expanded={expandedSections.equipment}
            onToggle={() => toggleSection("equipment")}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Mower Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "rotary", label: "Rotary" },
                    { value: "reel", label: "Reel" },
                    { value: "riding", label: "Riding" },
                  ].map((opt) => (
                    <ChipButton
                      key={opt.value}
                      selected={form.mowerType === opt.value}
                      onClick={() => setField("mowerType", opt.value)}
                    >
                      {opt.label}
                    </ChipButton>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Spreader Type
                </label>
                <select
                  value={form.spreaderType}
                  onChange={(e) => setField("spreaderType", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-deep-brown/15 bg-white text-deep-brown focus:outline-none focus:ring-2 focus:ring-lawn/30"
                >
                  <option value="">Select spreader</option>
                  <option value="broadcast">Broadcast</option>
                  <option value="drop">Drop</option>
                  <option value="handheld">Handheld</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Irrigation System
                </label>
                <select
                  value={form.irrigationSystem}
                  onChange={(e) => setField("irrigationSystem", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-deep-brown/15 bg-white text-deep-brown focus:outline-none focus:ring-2 focus:ring-lawn/30"
                >
                  <option value="">Select irrigation</option>
                  <option value="in-ground">In-ground sprinklers</option>
                  <option value="manual">Manual / hose</option>
                  <option value="drip">Drip</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>

          {/* Current Issues */}
          <CollapsibleSection
            icon="&#9888;&#65039;"
            title="CURRENT ISSUES"
            expanded={expandedSections.issues}
            onToggle={() => toggleSection("issues")}
          >
            <div>
              <p className="text-sm text-deep-brown/60 mb-3">Select all that apply:</p>
              <div className="flex flex-wrap gap-2">
                {["Weeds", "Bare Spots", "Fungus", "Pests", "Shade Damage", "None"].map(
                  (issue) => (
                    <ChipButton
                      key={issue}
                      selected={form.issues.includes(issue.toLowerCase().replace(" ", "_"))}
                      onClick={() => toggleIssue(issue.toLowerCase().replace(" ", "_"))}
                    >
                      {issue}
                    </ChipButton>
                  )
                )}
              </div>
            </div>
          </CollapsibleSection>

          {/* Soil */}
          <CollapsibleSection
            icon="&#129514;"
            title="SOIL (Optional)"
            expanded={expandedSections.soil}
            onToggle={() => toggleSection("soil")}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Soil Type
                </label>
                <select
                  value={form.soilType}
                  onChange={(e) => setField("soilType", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-deep-brown/15 bg-white text-deep-brown focus:outline-none focus:ring-2 focus:ring-lawn/30"
                >
                  <option value="">Select soil type</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loam">Loam</option>
                  <option value="silt">Silt</option>
                  <option value="not_sure">Not sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-brown/70 mb-2">
                  Had a soil test?
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ].map((opt) => (
                    <ChipButton
                      key={opt.value}
                      selected={form.hasSoilTest === opt.value}
                      onClick={() => setField("hasSoilTest", opt.value)}
                    >
                      {opt.label}
                    </ChipButton>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Submit */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full sm:w-auto bg-terracotta text-white font-semibold py-3.5 px-10 rounded-lg hover:bg-terracotta/90 active:bg-terracotta/80 transition-colors text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            GENERATE MY 90-DAY PLAN &rarr;
          </button>
          <p className="mt-3 text-xs text-deep-brown/40">
            Takes about 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable components ─── */

function CollapsibleSection({
  icon,
  title,
  expanded,
  onToggle,
  children,
}: {
  icon: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-deep-brown/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <span dangerouslySetInnerHTML={{ __html: icon }} />
          <span className="font-display font-semibold text-deep-brown text-sm tracking-wide">
            {title}
          </span>
        </div>
        <span className="text-deep-brown/40 text-lg">
          {expanded ? "\u2212" : "+"}
        </span>
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-deep-brown/5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function ChipButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
        selected
          ? "border-lawn bg-lawn/10 text-lawn"
          : "border-deep-brown/15 bg-white text-deep-brown/70 hover:border-deep-brown/30"
      }`}
    >
      {children}
    </button>
  );
}

export default function ExpertPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-deep-brown/40">Loading...</div>
        </div>
      }
    >
      <ExpertFlow />
    </Suspense>
  );
}
