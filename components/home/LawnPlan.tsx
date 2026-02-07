"use client";

import { useState, useEffect } from "react";
import { getSamplePlan, type PlanMonth } from "@/app/sandbox/plan/samplePlan";

interface PlanParams {
  zip: string;
  grassType: string;
  lawnSize: string;
  sunExposure: string;
  lawnGoal: string;
  path: string;
}

const grassLabels: Record<string, string> = {
  bermuda: "Bermuda",
  zoysia: "Zoysia",
  fescue_kbg: "Fescue/KBG",
  st_augustine: "St. Augustine",
  not_sure: "Your Lawn",
};

const goalLabels: Record<string, string> = {
  fix: "Fix Issues",
  maintain: "Maintain",
  perfect: "Perfect It",
  not_sure: "General Care",
};

export function LawnPlan() {
  const [plan, setPlan] = useState<PlanMonth[]>([]);
  const [params, setParams] = useState<PlanParams | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 0: true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ "0-0": true });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load plan params from localStorage
    const stored = localStorage.getItem("lawnhq_plan_params");
    if (stored) {
      try {
        const data = JSON.parse(stored) as PlanParams;
        setParams(data);
        const generatedPlan = getSamplePlan(
          data.grassType,
          data.lawnSize,
          data.lawnGoal,
          data.path
        );
        setPlan(generatedPlan);
      } catch {
        // Ignore parse errors
      }
    }

    // Load completed tasks
    const savedTasks = localStorage.getItem("lawnhq_completed_tasks");
    if (savedTasks) {
      try {
        setCompletedTasks(JSON.parse(savedTasks));
      } catch {
        // Ignore
      }
    }
  }, []);

  const toggleMonth = (idx: number) => {
    setExpandedMonths((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleWeek = (monthIdx: number, weekIdx: number) => {
    const key = `${monthIdx}-${weekIdx}`;
    setExpandedWeeks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTask = (monthIdx: number, weekIdx: number, taskIdx: number) => {
    const key = `${monthIdx}-${weekIdx}-${taskIdx}`;
    setCompletedTasks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("lawnhq_completed_tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const totalTasks = plan.reduce((sum, month) =>
    sum + month.weeks.reduce((wSum, week) => wSum + week.tasks.length, 0), 0
  );

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  if (!params || plan.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-deep-brown/10 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-lawn/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-display text-lg font-semibold text-deep-brown mb-2">
            No plan yet
          </h3>
          <p className="text-sm text-deep-brown/60 mb-4">
            Complete onboarding to get your personalized 90-day plan
          </p>
          <a
            href="/sandbox"
            className="inline-flex items-center gap-2 bg-lawn text-white font-medium px-5 py-2.5 rounded-lg hover:bg-lawn/90 transition-colors text-sm"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-gradient-to-br from-lawn to-lawn/80 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold">Your 90-Day Plan</h2>
            <p className="text-white/70 text-sm mt-1">
              {grassLabels[params.grassType] || params.grassType} &middot; {params.zip}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progressPercent}%</div>
            <div className="text-xs text-white/60">{completedCount}/{totalTasks} tasks</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {goalLabels[params.lawnGoal] || params.lawnGoal}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {params.path === "expert" ? "Expert Plan" : "Guided Plan"}
          </span>
        </div>
      </div>

      {/* Plan months */}
      <div className="space-y-3">
        {plan.map((month, idx) => {
          const monthTaskCount = month.weeks.reduce((s, w) => s + w.tasks.length, 0);
          const monthCompletedCount = month.weeks.reduce((s, w, widx) =>
            s + w.tasks.filter((_, tidx) => completedTasks[`${idx}-${widx}-${tidx}`]).length, 0
          );

          return (
            <div key={idx} className="overflow-hidden rounded-xl border border-deep-brown/10">
              {/* Month header */}
              <button
                onClick={() => toggleMonth(idx)}
                className="w-full"
              >
                <div className={`flex items-center justify-between px-4 py-3 transition-colors ${
                  expandedMonths[idx]
                    ? "bg-lawn text-white"
                    : "bg-white text-deep-brown hover:bg-cream/50"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-base">
                      {month.name}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      expandedMonths[idx]
                        ? "bg-white/20 text-white"
                        : "bg-deep-brown/5 text-deep-brown/50"
                    }`}>
                      {monthCompletedCount}/{monthTaskCount}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedMonths[idx] ? "rotate-180" : ""} ${
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
                <div className="bg-white divide-y divide-deep-brown/5">
                  {month.weeks.map((week, widx) => {
                    const weekKey = `${idx}-${widx}`;
                    const isWeekOpen = !!expandedWeeks[weekKey];
                    const weekCompletedCount = week.tasks.filter((_, tidx) =>
                      completedTasks[`${idx}-${widx}-${tidx}`]
                    ).length;

                    return (
                      <div key={widx}>
                        <button
                          onClick={() => toggleWeek(idx, widx)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-terracotta uppercase tracking-wide">
                              {week.label}
                            </span>
                            <span className="text-xs text-deep-brown/40">
                              {weekCompletedCount}/{week.tasks.length}
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
                          <ul className="px-4 pb-4 space-y-2">
                            {week.tasks.map((task, tidx) => {
                              const taskKey = `${idx}-${widx}-${tidx}`;
                              const isCompleted = completedTasks[taskKey];

                              return (
                                <li
                                  key={tidx}
                                  className="flex items-start gap-3 text-sm leading-relaxed"
                                >
                                  <button
                                    onClick={() => toggleTask(idx, widx, tidx)}
                                    className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                      isCompleted
                                        ? "bg-lawn border-lawn"
                                        : "border-deep-brown/20 hover:border-lawn/50"
                                    }`}
                                  >
                                    {isCompleted && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                  <span className={isCompleted ? "text-deep-brown/40 line-through" : "text-deep-brown/80"}>
                                    {task}
                                  </span>
                                </li>
                              );
                            })}
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
    </div>
  );
}
