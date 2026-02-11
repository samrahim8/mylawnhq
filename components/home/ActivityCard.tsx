"use client";

import { CalendarActivity } from "@/types";

interface ActivityCardProps {
  activities: CalendarActivity[];
  onAddActivity: () => void;
  onEditActivity: (activity: CalendarActivity) => void;
  onViewAll: () => void;
  maxVisible?: number;
}

const activityIcons: Record<string, string> = {
  mow: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z",
  water: "M12 21a8 8 0 01-8-8c0-3.5 8-11 8-11s8 7.5 8 11a8 8 0 01-8 8z",
  fertilize: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  aerate: "M12 3v18M3 12h18",
  pest: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  weedControl: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  seed: "M7 20h10M10 20c0-3.5-1-5.5-3-7m3 7c0-3.5 1-5.5 3-7m-3 7V10m0-8c-3 3-3 6-3 8m6-8c3 3 3 6 3 8m-6-6c3 0 6 0 6 0",
  other: "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z",
};

const activityLabels: Record<string, string> = {
  mow: "Mowed",
  water: "Watered",
  fertilize: "Fertilized",
  aerate: "Aerated",
  pest: "Pest Control",
  weedControl: "Weed Control",
  seed: "Seeded",
  other: "Activity",
};

export default function ActivityCard({
  activities,
  onAddActivity,
  onEditActivity,
  onViewAll,
  maxVisible = 3,
}: ActivityCardProps) {
  const today = new Date();

  const formatTimestamp = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateMidnight = new Date(year, month - 1, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((todayMidnight.getTime() - dateMidnight.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxVisible);

  const hasMore = activities.length > maxVisible;

  return (
    <div className="bg-white rounded-2xl border border-deep-brown/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-deep-brown/5">
        <h3 className="font-semibold text-deep-brown">Activity</h3>
        <button
          type="button"
          onClick={onAddActivity}
          className="w-8 h-8 bg-lawn rounded-lg flex items-center justify-center text-white hover:bg-lawn/90 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {sortedActivities.length === 0 ? (
        /* Empty State */
        <div className="px-4 py-8 text-center">
          <div className="w-12 h-12 bg-lawn/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm font-medium text-deep-brown mb-1">No activities yet</p>
          <p className="text-xs text-deep-brown/50 mb-3">Track what you do — it all adds up.</p>
          <button
            type="button"
            onClick={onAddActivity}
            className="text-sm font-medium text-lawn active:text-lawn/70"
          >
            Log your first activity →
          </button>
        </div>
      ) : (
        <>
          {/* Activity List */}
          <div className="divide-y divide-deep-brown/5">
            {sortedActivities.map((activity) => (
              <button
                key={activity.id}
                type="button"
                onClick={() => onEditActivity(activity)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream/50 active:bg-cream transition-colors text-left"
              >
                {/* Icon */}
                <div className="w-9 h-9 bg-lawn/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={activityIcons[activity.type] || activityIcons.other} />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-deep-brown">
                    {activityLabels[activity.type] || activity.type}
                  </p>
                  {activity.product && (
                    <p className="text-xs text-deep-brown/50 truncate">{activity.product}</p>
                  )}
                  {activity.notes && !activity.product && (
                    <p className="text-xs text-deep-brown/50 truncate italic">{activity.notes}</p>
                  )}
                </div>

                {/* Timestamp */}
                <span className="text-xs text-deep-brown/40 flex-shrink-0">
                  {formatTimestamp(activity.date)}
                </span>
              </button>
            ))}
          </div>

          {/* Footer */}
          {hasMore && (
            <div className="px-4 py-2.5 border-t border-deep-brown/5">
              <button
                type="button"
                onClick={onViewAll}
                className="w-full text-center text-sm font-medium text-lawn active:text-lawn/70"
              >
                See all activity →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
