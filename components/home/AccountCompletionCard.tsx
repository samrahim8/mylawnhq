"use client";

interface AccountCompletionCardProps {
  guestEmail: string;
  zipCode: string;
  grassType: string;
  onCreateAccount: () => void;
  onDismiss: () => void;
}

export function AccountCompletionCard({
  guestEmail,
  zipCode,
  grassType,
  onCreateAccount,
  onDismiss,
}: AccountCompletionCardProps) {
  // Format grass type for display
  const formatGrassType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-gradient-to-br from-white to-cream/50 rounded-2xl border border-deep-brown/10 p-4 relative">
      {/* Dismiss button */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-full text-deep-brown/30 hover:text-deep-brown/60 hover:bg-deep-brown/5 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Compact header with icon */}
      <div className="flex items-start gap-3 pr-6">
        <div className="w-9 h-9 bg-lawn/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-4.5 h-4.5 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-deep-brown text-sm leading-tight">Save your lawn plan</p>
          <p className="text-xs text-deep-brown/55 mt-0.5">Sync across devices and get timely reminders</p>
        </div>
      </div>

      {/* Saved data badges - inline */}
      {(zipCode || grassType) && (
        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
          {zipCode && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-deep-brown/60 bg-white/80 px-2 py-0.5 rounded-full border border-deep-brown/5">
              <svg className="w-3 h-3 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {zipCode}
            </span>
          )}
          {grassType && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-deep-brown/60 bg-white/80 px-2 py-0.5 rounded-full border border-deep-brown/5">
              <svg className="w-3 h-3 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {formatGrassType(grassType)}
            </span>
          )}
        </div>
      )}

      {/* CTA Button */}
      <button
        type="button"
        onClick={onCreateAccount}
        className="w-full bg-lawn text-white font-semibold py-2.5 rounded-xl hover:bg-lawn/90 active:scale-[0.98] transition-all text-sm mt-1"
      >
        Create Free Account
      </button>
    </div>
  );
}
