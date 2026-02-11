"use client";

import { useState, useEffect } from "react";
import AddToHomeScreenModal from "@/components/pwa/AddToHomeScreenModal";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { ChatProvider } from "@/contexts/ChatContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showA2HSModal, setShowA2HSModal] = useState(false);

  const {
    canShowPrompt,
    platform,
    dismissPrompt,
    triggerNativeInstall,
    deferredPrompt,
  } = useInstallPrompt();

  // Show prompt after 15 second delay
  useEffect(() => {
    if (canShowPrompt) {
      const timer = setTimeout(() => {
        setShowA2HSModal(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [canShowPrompt]);

  return (
    <ChatProvider>
      <div className="h-screen h-[100dvh] overflow-hidden bg-cream">
        <main className="h-full overflow-auto">{children}</main>

        <AddToHomeScreenModal
          isOpen={showA2HSModal}
          onClose={() => setShowA2HSModal(false)}
          onDismiss={(permanent) => {
            dismissPrompt(permanent);
            setShowA2HSModal(false);
          }}
          platform={platform}
          hasNativePrompt={!!deferredPrompt}
          onNativeInstall={triggerNativeInstall}
        />
      </div>
    </ChatProvider>
  );
}
