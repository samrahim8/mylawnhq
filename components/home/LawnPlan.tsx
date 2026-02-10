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

interface LawnPlanProps {
  onTaskToggle?: () => void;
}

export function LawnPlan({ onTaskToggle }: LawnPlanProps = {}) {
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
    const updated = { ...completedTasks, [key]: !completedTasks[key] };
    localStorage.setItem("lawnhq_completed_tasks", JSON.stringify(updated));
    setCompletedTasks(updated);
    onTaskToggle?.();
  };

  const totalTasks = plan.reduce((sum, month) =>
    sum + month.weeks.reduce((wSum, week) => wSum + week.tasks.length, 0), 0
  );

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  if (!params || plan.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-lawn/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌱</span>
          </div>
          <h3 className="font-display text-lg font-bold text-deep-brown mb-2">
            Get your free plan
          </h3>
          <p className="text-sm text-deep-brown/60 mb-5">
            Personalized 90-day lawn care schedule
          </p>
          <a
            href="/sandbox"
            className="inline-flex items-center justify-center gap-2 bg-lawn text-white font-bold w-full py-4 rounded-xl hover:bg-lawn/90 active:scale-[0.98] transition-all text-base"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Plan months */}
      <div className="space-y-2">
        {plan.map((month, idx) => {
          const monthTaskCount = month.weeks.reduce((s, w) => s + w.tasks.length, 0);
          const monthCompletedCount = month.weeks.reduce((s, w, widx) =>
            s + w.tasks.filter((_, tidx) => completedTasks[`${idx}-${widx}-${tidx}`]).length, 0
          );

          return (
            <div key={idx} className="overflow-hidden rounded-2xl border border-deep-brown/10">
              {/* Month header */}
              <button
                onClick={() => toggleMonth(idx)}
                className="w-full"
              >
                <div className={`flex items-center justify-between px-4 py-4 transition-colors ${
                  expandedMonths[idx]
                    ? "bg-lawn/10 text-deep-brown"
                    : "bg-white text-deep-brown active:bg-cream/50"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-base">
                      {month.name}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      expandedMonths[idx]
                        ? "bg-lawn/20 text-lawn"
                        : "bg-deep-brown/5 text-deep-brown/50"
                    }`}>
                      {monthCompletedCount}/{monthTaskCount}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedMonths[idx] ? "rotate-180" : ""} ${
                      expandedMonths[idx] ? "text-lawn" : "text-deep-brown/30"
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
                          className="w-full flex items-center justify-between px-4 py-3.5 active:bg-cream/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-terracotta">
                              {week.label}
                            </span>
                            <span className="text-xs text-deep-brown/40">
                              {weekCompletedCount}/{week.tasks.length}
                            </span>
                          </div>
                          <svg
                            className={`w-5 h-5 text-deep-brown/30 transition-transform ${isWeekOpen ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isWeekOpen && (
                          <ul className="px-4 pb-4 space-y-1">
                            {week.tasks.map((task, tidx) => {
                              const taskKey = `${idx}-${widx}-${tidx}`;
                              const isCompleted = completedTasks[taskKey];

                              return (
                                <li key={tidx}>
                                  <button
                                    onClick={() => toggleTask(idx, widx, tidx)}
                                    className="w-full flex items-start gap-3 text-left py-2 active:bg-cream/30 rounded-lg transition-colors -mx-2 px-2"
                                  >
                                    <span
                                      className={`w-6 h-6 mt-0.5 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                        isCompleted
                                          ? "bg-lawn border-lawn"
                                          : "border-deep-brown/20"
                                      }`}
                                    >
                                      {isCompleted && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </span>
                                    <span className={`text-sm leading-relaxed ${isCompleted ? "text-deep-brown/40 line-through" : "text-deep-brown/80"}`}>
                                      {task}
                                    </span>
                                  </button>
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
