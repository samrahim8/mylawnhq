"use client";

import { useState, useEffect, useCallback } from "react";
import type { BeforeInstallPromptEvent, InstallPlatform, A2HSPreferences } from "@/types/pwa";

const STORAGE_KEY = "lawnhq_a2hs";
const DISMISS_DELAYS = [3, 7, 30]; // Days before re-showing after each dismiss

interface InstallPromptState {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isStandalone: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isSamsung: boolean;
  platform: InstallPlatform;
  canShowPrompt: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  isDismissed: boolean;
  dismissPrompt: (permanent?: boolean) => void;
  triggerNativeInstall: () => Promise<boolean>;
}

function getPreferences(): A2HSPreferences {
  if (typeof window === "undefined") {
    return { dismissed: false, dismissCount: 0, lastDismissed: null, permanentDismiss: false };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors (e.g., private browsing)
  }
  return { dismissed: false, dismissCount: 0, lastDismissed: null, permanentDismiss: false };
}

function setPreferences(prefs: A2HSPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore errors
  }
}

function shouldShowPrompt(prefs: A2HSPreferences): boolean {
  if (prefs.permanentDismiss) return false;
  if (!prefs.lastDismissed) return true;

  const lastDismissed = new Date(prefs.lastDismissed);
  const now = new Date();
  const daysSinceDismiss = Math.floor((now.getTime() - lastDismissed.getTime()) / (1000 * 60 * 60 * 24));
  const delayIndex = Math.min(prefs.dismissCount - 1, DISMISS_DELAYS.length - 1);
  const requiredDelay = DISMISS_DELAYS[delayIndex] || DISMISS_DELAYS[0];

  return daysSinceDismiss >= requiredDelay;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [preferences, setPreferencesState] = useState<A2HSPreferences>(() => getPreferences());
  const [mounted, setMounted] = useState(false);

  // Platform detection (only on client)
  const [platformInfo, setPlatformInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isStandalone: false,
    isSafari: false,
    isChrome: false,
    isSamsung: false,
    platform: "unknown" as InstallPlatform,
  });

  useEffect(() => {
    setMounted(true);
    setPreferencesState(getPreferences());

    const ua = navigator.userAgent;

    // iOS Detection
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;

    // Android Detection
    const isAndroid = /Android/.test(ua);

    // Mobile Detection
    const isMobile = isIOS || isAndroid || /Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // Standalone Mode Detection (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    // Browser Detection
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isChrome = /Chrome/.test(ua) && !/Edge|Edg/.test(ua);
    const isSamsung = /SamsungBrowser/.test(ua);

    // Determine platform
    let platform: InstallPlatform = "unknown";
    if (!isMobile) {
      platform = "desktop";
    } else if (isIOS && isSafari) {
      platform = "ios-safari";
    } else if (isAndroid && isChrome) {
      platform = "android-chrome";
    } else if (isAndroid && isSamsung) {
      platform = "android-samsung";
    } else if (isAndroid) {
      platform = "android-other";
    }

    setPlatformInfo({
      isIOS,
      isAndroid,
      isMobile,
      isStandalone,
      isSafari,
      isChrome,
      isSamsung,
      platform,
    });
  }, []);

  // Listen for beforeinstallprompt event (Android Chrome)
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const dismissPrompt = useCallback((permanent = false) => {
    const newPrefs: A2HSPreferences = {
      dismissed: true,
      dismissCount: preferences.dismissCount + 1,
      lastDismissed: new Date().toISOString(),
      permanentDismiss: permanent,
    };
    setPreferences(newPrefs);
    setPreferencesState(newPrefs);
  }, [preferences.dismissCount]);

  const triggerNativeInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome === "accepted";
    } catch {
      return false;
    }
  }, [deferredPrompt]);

  // Determine if we can show the prompt
  const canShowPrompt =
    mounted &&
    platformInfo.isMobile &&
    !platformInfo.isStandalone &&
    shouldShowPrompt(preferences);

  return {
    ...platformInfo,
    canShowPrompt,
    deferredPrompt,
    isDismissed: preferences.dismissed && !shouldShowPrompt(preferences),
    dismissPrompt,
    triggerNativeInstall,
  };
}
