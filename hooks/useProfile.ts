"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types";

const STORAGE_KEY = "lawnhq_profile";

const defaultProfile: UserProfile = {
  zipCode: "",
  grassType: "bermuda",
  lawnSize: "medium",
  knownIssues: [],
  createdAt: "",
  updatedAt: "",
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        setProfile(null);
      }
    }
    setLoading(false);
  }, []);

  const saveProfile = (data: Partial<UserProfile>) => {
    const now = new Date().toISOString();
    const updated: UserProfile = {
      ...defaultProfile,
      ...profile,
      ...data,
      updatedAt: now,
      createdAt: profile?.createdAt || now,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProfile(updated);
    return updated;
  };

  const clearProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  const isSetUp = profile !== null && profile.zipCode !== "";

  return { profile, loading, saveProfile, clearProfile, isSetUp };
}
