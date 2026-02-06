"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/types";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "lawnhq_profile";

const defaultProfile: UserProfile = {
  zipCode: "",
  grassType: "bermuda",
  lawnSize: "medium",
  knownIssues: [],
  createdAt: "",
  updatedAt: "",
};

// Database profile type (snake_case from Supabase)
interface DbProfile {
  id: string;
  email: string | null;
  zip_code: string | null;
  grass_type: string | null;
  lawn_size: string | null;
  sun_exposure: string | null;
  lawn_goal: string | null;
  mower_type: string | null;
  spreader_type: string | null;
  irrigation_system: string | null;
  soil_type: string | null;
  lawn_age: string | null;
  known_issues: string[] | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// Convert database profile to frontend format
function dbToFrontend(dbProfile: DbProfile): UserProfile {
  return {
    zipCode: dbProfile.zip_code || "",
    grassType: (dbProfile.grass_type as UserProfile["grassType"]) || "bermuda",
    lawnSize: (dbProfile.lawn_size as UserProfile["lawnSize"]) || "medium",
    sunExposure: dbProfile.sun_exposure as UserProfile["sunExposure"],
    lawnGoal: dbProfile.lawn_goal as UserProfile["lawnGoal"],
    mowerType: dbProfile.mower_type as UserProfile["mowerType"],
    spreaderType: dbProfile.spreader_type || undefined,
    irrigationSystem: dbProfile.irrigation_system as UserProfile["irrigationSystem"],
    soilType: dbProfile.soil_type || undefined,
    lawnAge: dbProfile.lawn_age as UserProfile["lawnAge"],
    knownIssues: dbProfile.known_issues || [],
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);
          setUserId(user.id);

          // Fetch profile from database
          const { data: dbProfile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            // Fall back to localStorage if database fails
            loadFromLocalStorage();
          } else if (dbProfile) {
            const frontendProfile = dbToFrontend(dbProfile);
            setProfile(frontendProfile);

            // Migrate localStorage data to database if exists
            const localData = localStorage.getItem(STORAGE_KEY);
            if (localData) {
              try {
                const localProfile = JSON.parse(localData);
                // If local profile has data that database doesn't, migrate it
                if (localProfile.zipCode && !dbProfile.zip_code) {
                  await migrateLocalToDb(user.id, localProfile);
                }
                // Clear localStorage after successful migration
                localStorage.removeItem(STORAGE_KEY);
              } catch {
                // Ignore parse errors
              }
            }
          }
        } else {
          // Not authenticated - use localStorage
          setIsAuthenticated(false);
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProfile(JSON.parse(stored));
        } catch {
          setProfile(null);
        }
      }
    };

    const migrateLocalToDb = async (uid: string, localProfile: UserProfile) => {
      try {
        await supabase
          .from("profiles")
          .update({
            zip_code: localProfile.zipCode,
            grass_type: localProfile.grassType,
            lawn_size: localProfile.lawnSize,
            sun_exposure: localProfile.sunExposure,
            lawn_goal: localProfile.lawnGoal,
            mower_type: localProfile.mowerType,
            spreader_type: localProfile.spreaderType,
            irrigation_system: localProfile.irrigationSystem,
            soil_type: localProfile.soilType,
            lawn_age: localProfile.lawnAge,
            known_issues: localProfile.knownIssues,
          })
          .eq("id", uid);
      } catch (error) {
        console.error("Migration error:", error);
      }
    };

    loadProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          // Reload profile from database
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (dbProfile) {
            setProfile(dbToFrontend(dbProfile));
          }
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUserId(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const saveProfile = useCallback(async (data: Partial<UserProfile>) => {
    const now = new Date().toISOString();
    const updated: UserProfile = {
      ...defaultProfile,
      ...profile,
      ...data,
      updatedAt: now,
      createdAt: profile?.createdAt || now,
    };

    if (isAuthenticated && userId) {
      // Save to database
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            zip_code: updated.zipCode,
            grass_type: updated.grassType,
            lawn_size: updated.lawnSize,
            sun_exposure: updated.sunExposure,
            lawn_goal: updated.lawnGoal,
            mower_type: updated.mowerType,
            spreader_type: updated.spreaderType,
            irrigation_system: updated.irrigationSystem,
            soil_type: updated.soilType,
            lawn_age: updated.lawnAge,
            known_issues: updated.knownIssues,
          })
          .eq("id", userId);

        if (error) {
          console.error("Error saving profile:", error);
          // Fall back to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } catch (error) {
        console.error("Database save error:", error);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } else {
      // Not authenticated - save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    setProfile(updated);
    return updated;
  }, [isAuthenticated, userId, profile, supabase]);

  const clearProfile = useCallback(async () => {
    if (isAuthenticated && userId) {
      // Clear database fields (but don't delete profile row)
      try {
        await supabase
          .from("profiles")
          .update({
            zip_code: null,
            grass_type: null,
            lawn_size: null,
            sun_exposure: null,
            lawn_goal: null,
            mower_type: null,
            spreader_type: null,
            irrigation_system: null,
            soil_type: null,
            lawn_age: null,
            known_issues: null,
          })
          .eq("id", userId);
      } catch (error) {
        console.error("Error clearing profile:", error);
      }
    }

    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, [isAuthenticated, userId, supabase]);

  const isSetUp = profile !== null && profile.zipCode !== "";

  return {
    profile,
    loading,
    saveProfile,
    clearProfile,
    isSetUp,
    isAuthenticated,
  };
}
