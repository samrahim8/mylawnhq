"use client";

interface UsageIndicatorProps {
  used: number;
  limit: number;
  type: "chat" | "photo";
  compact?: boolean;
}

export function UsageIndicator({ used, limit, type, compact = false }: UsageIndicatorProps) {
  const remaining = Math.max(0, limit - used);
  const isLow = remaining <= 2 && remaining > 0;
  const isExhausted = remaining === 0;
  const isUnlimited = limit === Infinity || limit === -1;

  if (isUnlimited) {
    return null; // Don't show indicator for Pro users
  }

  const getColor = () => {
    if (isExhausted) return "text-red-500 bg-red-50";
    if (isLow) return "text-orange-500 bg-orange-50";
    return "text-deep-brown/60 bg-deep-brown/5";
  };

  const getBorderColor = () => {
    if (isExhausted) return "border-red-200";
    if (isLow) return "border-orange-200";
    return "border-deep-brown/10";
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded ${getColor()}`}
        title={`${remaining} ${type === "chat" ? "chats" : "diagnoses"} remaining this month`}
      >
        {used}/{limit}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg border ${getColor()} ${getBorderColor()}`}
      title={`${remaining} ${type === "chat" ? "AI chats" : "photo diagnoses"} remaining this month`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {type === "chat" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        )}
      </svg>
      <span>{used}/{limit}</span>
    </div>
  );
}
