"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import AddToHomeScreenModal from "@/components/pwa/AddToHomeScreenModal";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showA2HSModal, setShowA2HSModal] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const {
    canShowPrompt,
    platform,
    dismissPrompt,
    triggerNativeInstall,
    deferredPrompt,
  } = useInstallPrompt();

  // Show prompt after 5 second delay
  useEffect(() => {
    if (canShowPrompt) {
      const timer = setTimeout(() => {
        setShowA2HSModal(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [canShowPrompt]);

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-[#f8f6f3]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile header with hamburger menu */}
        <div className="lg:hidden flex items-center gap-3 px-3 py-2 bg-white border-b border-[#e5e5e5] flex-shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#f8f6f3] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#7a8b6e] rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="font-display font-semibold text-[#1a1a1a]">LawnHQ</span>
          </Link>
        </div>

        <main ref={mainRef} className="flex-1 overflow-auto">{children}</main>
        <ScrollIndicator containerRef={mainRef} />
      </div>

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
  );
}
