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
    <div className="bg-white rounded-2xl border border-deep-brown/10 p-4 relative">
      {/* Dismiss button */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-full text-deep-brown/30 hover:text-deep-brown/60 hover:bg-deep-brown/5 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pr-6">
        <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-deep-brown text-sm">Your lawn plan is saved locally</p>
          <p className="text-xs text-deep-brown/50">Create an account to keep it forever</p>
        </div>
      </div>

      {/* Saved data badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {zipCode && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-deep-brown/70 bg-cream px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {zipCode}
          </span>
        )}
        {grassType && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-deep-brown/70 bg-cream px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {formatGrassType(grassType)} grass
          </span>
        )}
      </div>

      {/* Benefits list */}
      <div className="space-y-2 mb-4">
        {[
          "Sync across all your devices",
          "Never lose your progress",
          "Get reminders when it's time to act",
        ].map((benefit, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-deep-brown/70">
            <span className="text-lawn">•</span>
            {benefit}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onCreateAccount}
        className="w-full bg-lawn text-white font-semibold py-3 rounded-xl hover:bg-lawn/90 active:scale-[0.98] transition-all"
      >
        Create Free Account
      </button>

      {/* Dismiss link */}
      <button
        type="button"
        onClick={onDismiss}
        className="w-full mt-2 text-deep-brown/50 text-sm py-2 hover:text-deep-brown/70 transition-colors"
      >
        I&apos;ll do this later
      </button>
    </div>
  );
}
