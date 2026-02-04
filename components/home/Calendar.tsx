"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarActivity } from "@/types";

interface CalendarProps {
  activities: CalendarActivity[];
  onOpenActivityModal?: () => void;
  compact?: boolean;
}

interface TooltipPosition {
  top: number;
  left: number;
}

export default function Calendar({ activities, onOpenActivityModal, compact }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const dayRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const hasActivity = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return activities.filter((a) => a.date === dateStr);
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      mow: "✂️",
      water: "💧",
      fertilize: "🌱",
      aerate: "🔄",
      pest: "🐛",
      weedControl: "🌼",
      seed: "🌾",
      other: "📝",
    };
    return icons[type] || "📝";
  };

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      mow: "Mowed",
      water: "Watered",
      fertilize: "Fertilized",
      aerate: "Aerated",
      pest: "Pest Control",
      weedControl: "Weed Control",
      seed: "Seeded",
      other: "Activity",
    };
    return labels[type] || type;
  };

  const handleMouseEnter = (day: number, element: HTMLDivElement) => {
    const dayActivities = hasActivity(day);
    if (dayActivities.length === 0) return;

    const rect = element.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
    setHoveredDay(day);
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setTooltipPosition(null);
  };

  const hoveredActivities = hoveredDay ? hasActivity(hoveredDay) : [];

  const wrapperClass = compact
    ? "flex flex-col h-full"
    : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 h-full flex flex-col overflow-hidden";

  return (
    <div className={wrapperClass}>
      {!compact && (
        <div className="flex items-center justify-between mb-1 sm:mb-1.5">
          <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">Calendar</h3>
          <button
            type="button"
            onClick={() => onOpenActivityModal?.()}
            className="p-1 sm:p-1.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white transition-colors"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      {/* Month navigation */}
      <div className={`flex items-center justify-between ${compact ? 'mb-2 sm:mb-3' : 'mb-1'}`}>
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(year, month - 1))}
          className="p-0.5 hover:bg-[#f8f6f3] rounded"
        >
          <svg className={`${compact ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3'} text-[#525252]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className={`${compact ? 'text-sm sm:text-base lg:text-lg' : 'text-[11px] sm:text-xs'} text-[#1a1a1a] font-semibold`}>
          {monthNames[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setCurrentDate(new Date(year, month + 1))}
          className="p-0.5 hover:bg-[#f8f6f3] rounded"
        >
          <svg className={`${compact ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3'} text-[#525252]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className={`grid grid-cols-7 gap-0.5 ${compact ? 'mb-1' : ''}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className={`text-center ${compact ? 'text-xs sm:text-sm py-1' : 'text-[9px] sm:text-[10px] py-0.5'} text-[#a3a3a3] font-medium`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - shows all weeks */}
      <div className={`grid grid-cols-7 gap-0.5 ${compact ? 'flex-1' : ''}`} style={compact ? { gridAutoRows: '1fr' } : {}}>
        {days.map((day, i) => {
          if (day === null) {
            return <div key={i} />;
          }
          const dayActivities = hasActivity(day);

          return (
            <div
              key={i}
              ref={(el) => {
                if (el) dayRefs.current.set(day, el);
              }}
              className={`flex flex-col items-center justify-center rounded relative cursor-pointer ${
                compact ? 'text-sm sm:text-base py-2' : 'text-[10px] sm:text-xs py-1'
              } ${
                isToday(day)
                  ? "bg-[#7a8b6e] text-white font-semibold"
                  : "text-[#525252] hover:bg-[#f8f6f3]"
              }`}
              onMouseEnter={(e) => handleMouseEnter(day, e.currentTarget)}
              onMouseLeave={handleMouseLeave}
            >
              {day}
              {dayActivities.length > 0 && (
                <div className="absolute bottom-0.5 flex gap-0.5">
                  {dayActivities.map((_, idx) => (
                    <div key={idx} className="w-1 h-1 rounded-full bg-[#c17f59]" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Activity Tooltip - rendered via Portal */}
      {mounted && hoveredDay && tooltipPosition && hoveredActivities.length > 0 && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="w-64 bg-white border border-[#e5e5e5] rounded-lg shadow-xl p-3">
            <div className="text-xs sm:text-sm font-semibold text-[#1a1a1a] mb-2 border-b border-[#e5e5e5] pb-2">
              {monthNames[month]} {hoveredDay}, {year}
            </div>
            <div className="space-y-2">
              {hoveredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0">{getActivityIcon(activity.type)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-[#2d3748]">
                      {getActivityLabel(activity.type)}
                    </p>
                    {activity.product && (
                      <p className="text-[11px] sm:text-xs text-[#525252]">
                        {activity.product}
                      </p>
                    )}
                    {activity.area && (
                      <p className="text-[11px] sm:text-xs text-[#7a8b6e] mt-0.5">
                        📍 {activity.area}
                      </p>
                    )}
                    {activity.notes && (
                      <p className="text-[11px] sm:text-xs text-[#a3a3a3] mt-0.5">
                        {activity.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white" style={{ marginTop: '-1px' }} />
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#e5e5e5]" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
