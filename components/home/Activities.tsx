"use client";

import { CalendarActivity } from "@/types";

interface ActivitiesProps {
  activities: CalendarActivity[];
  onDeleteActivity?: (id: string) => void;
  onOpenActivityModal?: () => void;
}

export default function Activities({ activities, onDeleteActivity, onOpenActivityModal }: ActivitiesProps) {
  const today = new Date();

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      mow: "✂️",
      water: "💧",
      fertilize: "🌱",
      aerate: "🔄",
      pest: "🐛",
      other: "📝",
    };
    return icons[type] || "📝";
  };

  const getActivityLabel = (type: string, isPast: boolean) => {
    if (isPast) {
      const pastTense: Record<string, string> = {
        mow: "Mowed",
        water: "Watered",
        fertilize: "Fertilized",
        aerate: "Aerated",
        pest: "Pest Control",
        other: "Other Activity",
      };
      return pastTense[type] || type;
    } else {
      const presentTense: Record<string, string> = {
        mow: "Mow",
        water: "Water",
        fertilize: "Fertilize",
        aerate: "Aerate",
        pest: "Pest Control",
        other: "Other Activity",
      };
      return presentTense[type] || type;
    }
  };

  const getDateLabel = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const activityDate = new Date(year, month - 1, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diff = Math.floor((todayMidnight.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return { label: "Today", isPast: true };
    if (diff === 1) return { label: "Yesterday", isPast: true };
    if (diff > 1) return { label: `${diff} days ago`, isPast: true };
    if (diff === -1) return { label: "in 1 day", isPast: false };
    return { label: `in ${Math.abs(diff)} days`, isPast: false };
  };

  // Sort activities by date (most recent first)
  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm p-4 h-[340px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-[#1a1a1a]">Activities</h3>
        <button
          type="button"
          onClick={() => onOpenActivityModal?.()}
          className="p-1.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="text-center py-6 flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-[#a3a3a3]">No activities yet</p>
          <p className="text-xs text-[#a3a3a3] mt-1">Click the + button to add your first activity</p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-auto">
          {sortedActivities.map((activity) => {
            const { label, isPast } = getDateLabel(activity.date);
            return (
              <div key={activity.id} className="flex items-center gap-2 text-sm group py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7a8b6e] flex-shrink-0" />
                <span className="text-base">{getActivityIcon(activity.type)}</span>
                <span className="text-[#525252] font-medium">{getActivityLabel(activity.type, isPast)}:</span>
                <span className="text-[#a3a3a3] flex-1">{label}</span>
                {onDeleteActivity && (
                  <button
                    type="button"
                    onClick={() => onDeleteActivity(activity.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-50 rounded transition-opacity"
                    title="Delete activity"
                  >
                    <svg className="w-3.5 h-3.5 text-red-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
