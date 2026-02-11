"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

interface GuestData {
  email: string;
  zipCode: string;
  grassType: string;
  createdAt: string;
}

export function useGuestGate() {
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [gateTrigger, setGateTrigger] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();

      // Check if authenticated
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        setIsGuest(false);
        setGuestData(null);
      } else {
        // Check for guest data
        const stored = localStorage.getItem("lawnhq_guest");
        if (stored) {
          setGuestData(JSON.parse(stored));
          setIsGuest(true);
        }
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuthStatus();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session?.user) {
          setIsAuthenticated(true);
          setIsGuest(false);
          setGuestData(null);
          localStorage.removeItem("lawnhq_guest");
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Call this to trigger the gate modal
  const requireAccount = useCallback((trigger?: string): boolean => {
    if (isAuthenticated) {
      return true; // Already has account, proceed
    }

    if (isGuest) {
      setGateTrigger(trigger);
      setShowGate(true);
      return false; // Show gate, don't proceed
    }

    // Not authenticated and not a guest - redirect to home/landing
    window.location.href = "/";
    return false;
  }, [isAuthenticated, isGuest]);

  const closeGate = useCallback(() => {
    setShowGate(false);
    setGateTrigger(undefined);
  }, []);

  const onAccountCreated = useCallback(() => {
    setShowGate(false);
    setGateTrigger(undefined);
    setIsAuthenticated(true);
    setIsGuest(false);
    setGuestData(null);
  }, []);

  return {
    isGuest,
    isAuthenticated,
    guestData,
    isLoading,
    // Gate state
    showGate,
    gateTrigger,
    requireAccount,
    closeGate,
    onAccountCreated,
  };
}
