"use client";

import type { InstallPlatform } from "@/types/pwa";

interface AddToHomeScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: (permanent?: boolean) => void;
  platform: InstallPlatform;
  onNativeInstall?: () => Promise<boolean>;
  hasNativePrompt?: boolean;
}

// Share icon for iOS Safari
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

// Menu dots icon for Android
function MenuDotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

// Plus icon
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

// Checkmark icon
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

interface InstructionStepProps {
  number: number;
  icon: React.ReactNode;
  text: string;
}

function InstructionStep({ number, icon, text }: InstructionStepProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7a8b6e] text-white text-sm font-medium flex items-center justify-center">
        {number}
      </div>
      <div className="flex items-center gap-2 text-[#525252]">
        {icon}
        <span>{text}</span>
      </div>
    </div>
  );
}

function IOSSafariInstructions() {
  return (
    <div className="space-y-4">
      <InstructionStep
        number={1}
        icon={<ShareIcon className="w-5 h-5 text-[#007AFF]" />}
        text="Tap the Share button at the bottom"
      />
      <InstructionStep
        number={2}
        icon={<PlusIcon className="w-5 h-5 text-[#525252]" />}
        text='Scroll down and tap "Add to Home Screen"'
      />
      <InstructionStep
        number={3}
        icon={<CheckIcon className="w-5 h-5 text-[#7a8b6e]" />}
        text='Tap "Add" in the top right corner'
      />
    </div>
  );
}

function AndroidChromeInstructions({
  hasNativePrompt,
  onNativeInstall,
}: {
  hasNativePrompt?: boolean;
  onNativeInstall?: () => Promise<boolean>;
}) {
  if (hasNativePrompt && onNativeInstall) {
    return (
      <div className="space-y-4">
        <p className="text-[#525252] text-sm">
          Add LawnHQ to your home screen for quick access.
        </p>
        <button
          onClick={async () => {
            await onNativeInstall();
          }}
          className="w-full px-4 py-3 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Install LawnHQ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <InstructionStep
        number={1}
        icon={<MenuDotsIcon className="w-5 h-5 text-[#525252]" />}
        text="Tap the menu (3 dots) in the top right"
      />
      <InstructionStep
        number={2}
        icon={<PlusIcon className="w-5 h-5 text-[#525252]" />}
        text='Tap "Add to Home screen" or "Install app"'
      />
      <InstructionStep
        number={3}
        icon={<CheckIcon className="w-5 h-5 text-[#7a8b6e]" />}
        text="Confirm by tapping Install or Add"
      />
    </div>
  );
}

function SamsungInstructions() {
  return (
    <div className="space-y-4">
      <InstructionStep
        number={1}
        icon={
          <svg className="w-5 h-5 text-[#525252]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        }
        text="Tap the menu (3 lines) at the bottom"
      />
      <InstructionStep
        number={2}
        icon={<PlusIcon className="w-5 h-5 text-[#525252]" />}
        text='Tap "Add page to" then "Home screen"'
      />
      <InstructionStep
        number={3}
        icon={<CheckIcon className="w-5 h-5 text-[#7a8b6e]" />}
        text='Tap "Add" to confirm'
      />
    </div>
  );
}

function GenericInstructions() {
  return (
    <div className="space-y-3 text-[#525252] text-sm">
      <p>To add LawnHQ to your home screen:</p>
      <ol className="list-decimal list-inside space-y-2">
        <li>Open your browser menu</li>
        <li>Look for &quot;Add to Home Screen&quot; or &quot;Install&quot;</li>
        <li>Follow the prompts to add</li>
      </ol>
    </div>
  );
}

export default function AddToHomeScreenModal({
  isOpen,
  onClose,
  onDismiss,
  platform,
  onNativeInstall,
  hasNativePrompt,
}: AddToHomeScreenModalProps) {
  if (!isOpen) return null;

  const handleMaybeLater = () => {
    onDismiss(false);
    onClose();
  };

  const handleDontShowAgain = () => {
    onDismiss(true);
    onClose();
  };

  const handleGotIt = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleGotIt}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-md sm:mx-4 overflow-hidden animate-slide-up sm:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7a8b6e] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Add to Home Screen</h2>
              <p className="text-sm text-[#737373]">Get the app experience</p>
            </div>
          </div>
          <button
            onClick={handleGotIt}
            className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-[#525252]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Benefits */}
          <div className="flex gap-4 mb-6 text-xs text-[#737373]">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Faster loading</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Fullscreen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Home screen</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#f8f6f3] rounded-xl p-4">
            {platform === "ios-safari" && <IOSSafariInstructions />}
            {platform === "android-chrome" && (
              <AndroidChromeInstructions
                hasNativePrompt={hasNativePrompt}
                onNativeInstall={onNativeInstall}
              />
            )}
            {platform === "android-samsung" && <SamsungInstructions />}
            {(platform === "android-other" || platform === "unknown") && <GenericInstructions />}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-0 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={handleMaybeLater}
              className="flex-1 px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#525252] font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleGotIt}
              className="flex-1 px-4 py-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white font-medium transition-colors"
            >
              Got it!
            </button>
          </div>
          <button
            onClick={handleDontShowAgain}
            className="w-full text-center text-sm text-[#a3a3a3] hover:text-[#737373] transition-colors"
          >
            Don&apos;t show again
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
