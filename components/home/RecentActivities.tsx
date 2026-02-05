"use client";

import { CalendarActivity } from "@/types";

interface RecentActivitiesProps {
  activities: CalendarActivity[];
  onDeleteActivity?: (id: string) => void;
  onOpenActivityModal?: () => void;
  onEditActivity?: (activity: CalendarActivity) => void;
  onViewAll?: () => void;
  maxVisible?: number;
  compact?: boolean;
}

export default function RecentActivities({
  activities,
  onDeleteActivity,
  onOpenActivityModal,
  onEditActivity,
  maxVisible = 4,
  compact,
}: RecentActivitiesProps) {
  const today = new Date();

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      mow: "\u2702\uFE0F",
      water: "\uD83D\uDCA7",
      fertilize: "\uD83C\uDF31",
      aerate: "\uD83D\uDD04",
      pest: "\uD83D\uDC1B",
      weedControl: "🌼",
      seed: "\uD83C\uDF3E",
      other: "\uD83D\uDCDD",
    };
    return icons[type] || "\uD83D\uDCDD";
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

  const formatTimestamp = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateMidnight = new Date(year, month - 1, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((todayMidnight.getTime() - dateMidnight.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays === -1) return "Tomorrow";
    if (diffDays < -1) return `In ${Math.abs(diffDays)} days`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  const getDetailsLine = (activity: CalendarActivity) => {
    const details: string[] = [];

    if (activity.product) details.push(activity.product);
    if (activity.duration) details.push(`${activity.duration} min`);
    if (activity.height) details.push(`${activity.height}`);

    return details.length > 0 ? details.join(" • ") : null;
  };

  const getAdditionalDetails = (activity: CalendarActivity) => {
    const details: string[] = [];

    // Mowing specific
    if (activity.method) {
      const methodLabels: Record<string, string> = {
        bagged: "Bagged",
        mulched: "Mulched",
        "side-discharge": "Side Discharge",
      };
      details.push(methodLabels[activity.method] || activity.method);
    }

    // Watering specific
    if (activity.zones) details.push(`Zones: ${activity.zones}`);
    if (activity.amount) details.push(activity.amount);

    // Fertilizing specific
    if (activity.applicationRate) {
      const rateLabels: Record<string, string> = {
        light: "Light Rate",
        normal: "Normal Rate",
        heavy: "Heavy Rate",
      };
      details.push(rateLabels[activity.applicationRate] || activity.applicationRate);
    }
    if (activity.npk) details.push(`NPK: ${activity.npk}`);

    // Seeding specific
    if (activity.grassType) details.push(activity.grassType);
    if (activity.seedAmount) details.push(activity.seedAmount);
    if (activity.germinationWindow) details.push(`Germination: ${activity.germinationWindow}`);

    // Weed/Pest control specific
    if (activity.treatmentType) {
      const treatmentLabels: Record<string, string> = {
        spot: "Spot Treatment",
        broadcast: "Broadcast",
      };
      details.push(treatmentLabels[activity.treatmentType] || activity.treatmentType);
    }
    if (activity.target) details.push(`Target: ${activity.target}`);

    return details.length > 0 ? details.join(" • ") : null;
  };

  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const visibleActivities = sortedActivities.slice(0, maxVisible);

  const wrapperClass = compact
    ? "flex flex-col pt-3"
    : "bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4 h-full flex flex-col overflow-hidden";

  return (
    <div className={wrapperClass}>
      {/* Header - hidden in compact mode */}
      {!compact && (
        <div className="flex items-center justify-between mb-1.5 sm:mb-2 flex-shrink-0">
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#1a1a1a]">Recent Activities</h3>
          <button
            type="button"
            onClick={() => onOpenActivityModal?.()}
            className="p-1.5 sm:p-2 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white transition-colors"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      {/* Activities List */}
      {sortedActivities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <p className="text-base sm:text-lg font-semibold text-[#525252] mb-1">Let&apos;s get it</p>
          <p className="text-sm sm:text-base text-[#a3a3a3] mb-3">
            Your lawn&apos;s not gonna brag about itself
          </p>
          <button
            type="button"
            onClick={() => onOpenActivityModal?.()}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg text-[11px] sm:text-xs font-medium transition-colors"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log First Activity
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-0 min-h-0 scrollbar-hide">
          {visibleActivities.map((activity, index) => {
            return (
              <article
                key={activity.id}
                className={`group py-1.5 sm:py-2 hover:bg-[#f9fafb] -mx-1 px-1 rounded transition-colors cursor-pointer ${
                  index !== visibleActivities.length - 1 ? "border-b border-[#e5e5e5]" : ""
                }`}
                onClick={() => onEditActivity?.(activity)}
              >
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <span className="text-sm sm:text-base lg:text-lg flex-shrink-0 mt-0.5" role="img" aria-hidden="true">
                    {getActivityIcon(activity.type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-[#2d3748]">
                      {getActivityLabel(activity.type)}
                    </p>
                    {activity.product && (
                      <p className="text-[10px] sm:text-[11px] text-[#4a5568] truncate">
                        {activity.product}
                      </p>
                    )}
                    {activity.area && (
                      <p className="text-[10px] sm:text-[11px] text-[#a3a3a3]">
                        Area: {activity.area}
                      </p>
                    )}
                    {(activity.amount || activity.duration) && (
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#a3a3a3]">
                        {activity.duration && (
                          <span className="flex-shrink-0">{activity.duration} min</span>
                        )}
                        {activity.amount && (
                          <span className="flex-shrink-0">{activity.amount}</span>
                        )}
                      </div>
                    )}
                    {activity.notes && (
                      <p className="text-[10px] sm:text-[11px] text-[#a3a3a3] italic truncate">
                        {activity.notes}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] sm:text-[11px] text-[#4a5568] flex-shrink-0">
                    {formatTimestamp(activity.date)}
                  </span>

                  {onDeleteActivity && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteActivity(activity.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#e5e5e5] rounded transition-all flex-shrink-0"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#a3a3a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {sortedActivities.length > 0 && (
        <div className="pt-1.5 sm:pt-2 mt-auto flex-shrink-0 border-t border-[#e5e5e5]">
          <button
            type="button"
            onClick={() => onOpenActivityModal?.()}
            className="w-full text-[11px] sm:text-xs text-[#7a8b6e] hover:text-[#6a7b5e] font-medium py-0.5 sm:py-1 flex items-center justify-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Activity
          </button>
        </div>
      )}
    </div>
  );
}
