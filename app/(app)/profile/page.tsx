"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, saveProfile, isAuthenticated } = useProfile();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showLawnProfile, setShowLawnProfile] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [formData, setFormData] = useState({
    zipCode: "",
    grassType: "bermuda" as "bermuda" | "zoysia" | "fescue-kbg" | "st-augustine",
    lawnSize: "medium" as "small" | "medium" | "large",
    soilType: "",
    sunExposure: "full" as "full" | "partial" | "shade",
    mowerType: "" as "" | "rotary" | "reel" | "riding",
    spreaderType: "",
    irrigationSystem: "" as "" | "none" | "manual" | "in-ground" | "drip",
    lawnGoal: "" as "" | "low-maintenance" | "healthy-green" | "golf-course",
    lawnAge: "" as "" | "new" | "established",
    knownIssues: [] as string[],
  });

  // Get user email and sync auth state
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        // Sync sessionStorage for consistency
        sessionStorage.setItem("lawnhq_authenticated", "true");
      } else {
        // Try to get session as fallback
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
          sessionStorage.setItem("lawnhq_authenticated", "true");
        }
      }
    };
    getUser();
  }, []);

  // Pre-populate from existing profile
  useEffect(() => {
    if (profile) {
      setFormData({
        zipCode: profile.zipCode || "",
        grassType: profile.grassType || "bermuda",
        lawnSize: profile.lawnSize || "medium",
        soilType: profile.soilType || "",
        sunExposure: profile.sunExposure || "full",
        mowerType: profile.mowerType || "",
        spreaderType: profile.spreaderType || "",
        irrigationSystem: profile.irrigationSystem || "",
        lawnGoal: profile.lawnGoal || "",
        lawnAge: profile.lawnAge || "",
        knownIssues: profile.knownIssues || [],
      });
    }
  }, [profile]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveProfile = () => {
    saveProfile({
      ...formData,
      mowerType: formData.mowerType || undefined,
      irrigationSystem: formData.irrigationSystem || undefined,
      lawnGoal: formData.lawnGoal || undefined,
      lawnAge: formData.lawnAge || undefined,
    });
    setShowLawnProfile(false);
  };

  // Count how many optional fields are filled
  const filledCount = [
    formData.lawnGoal,
    formData.mowerType,
    formData.spreaderType,
    formData.irrigationSystem,
    formData.lawnAge,
    formData.soilType,
    formData.knownIssues.length > 0 ? "filled" : "",
  ].filter(Boolean).length;
  const totalOptional = 7;
  const profileComplete = filledCount >= 4;

  const selectedClass = "bg-lawn/10 border-lawn/30 text-deep-brown";
  const unselectedClass = "bg-white border-deep-brown/10 text-deep-brown/70 hover:border-deep-brown/20";

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-deep-brown/10 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/home"
            className="p-2 -ml-2 rounded-xl hover:bg-deep-brown/5 active:bg-deep-brown/10 transition-colors"
          >
            <svg className="w-5 h-5 text-deep-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-display text-lg font-bold text-deep-brown">Account</h1>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-12 space-y-4">
        {/* Account Card */}
        <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-lawn/10 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-deep-brown truncate">
                {userEmail || "Loading..."}
              </p>
              <p className="text-sm text-deep-brown/50">
                {isAuthenticated ? "Signed in" : "Guest"}
              </p>
            </div>
          </div>
        </div>

        {/* Lawn Summary Card */}
        <div className="bg-white rounded-2xl border border-deep-brown/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-deep-brown">Your Lawn</h2>
            {!profileComplete && (
              <span className="text-xs font-medium text-terracotta bg-terracotta/10 px-2 py-1 rounded-full">
                Incomplete
              </span>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-cream/50 rounded-xl px-3 py-2.5">
              <p className="text-xs text-deep-brown/50 mb-0.5">Location</p>
              <p className="font-medium text-deep-brown text-sm">
                {formData.zipCode || "Not set"}
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl px-3 py-2.5">
              <p className="text-xs text-deep-brown/50 mb-0.5">Grass Type</p>
              <p className="font-medium text-deep-brown text-sm capitalize">
                {formData.grassType?.replace("-", " ") || "Not set"}
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl px-3 py-2.5">
              <p className="text-xs text-deep-brown/50 mb-0.5">Lawn Size</p>
              <p className="font-medium text-deep-brown text-sm capitalize">
                {formData.lawnSize || "Not set"}
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl px-3 py-2.5">
              <p className="text-xs text-deep-brown/50 mb-0.5">Goal</p>
              <p className="font-medium text-deep-brown text-sm capitalize">
                {formData.lawnGoal?.replace("-", " ") || "Not set"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLawnProfile(!showLawnProfile)}
            className="w-full flex items-center justify-between px-4 py-3 bg-cream/50 hover:bg-cream rounded-xl transition-colors"
          >
            <span className="text-sm font-medium text-deep-brown">
              {profileComplete ? "Edit lawn profile" : "Finish lawn profile"}
            </span>
            <svg
              className={`w-5 h-5 text-deep-brown/50 transition-transform ${showLawnProfile ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Expanded Lawn Profile Form */}
        {showLawnProfile && (
          <div className="bg-white rounded-2xl border border-deep-brown/10 p-5 space-y-5">
            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Zip Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="Enter your zip code"
                className="w-full px-3 py-2.5 bg-cream/30 border border-deep-brown/10 rounded-xl text-deep-brown text-sm placeholder-deep-brown/30 outline-none focus:border-lawn focus:ring-2 focus:ring-lawn/10"
                maxLength={10}
              />
            </div>

            {/* Grass Type */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Grass Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "bermuda", label: "Bermuda" },
                  { value: "zoysia", label: "Zoysia" },
                  { value: "fescue-kbg", label: "Fescue/KBG" },
                  { value: "st-augustine", label: "St. Augustine" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, grassType: option.value as typeof formData.grassType })}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      formData.grassType === option.value ? selectedClass : unselectedClass
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lawn Size */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Lawn Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, lawnSize: option.value as typeof formData.lawnSize })}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      formData.lawnSize === option.value ? selectedClass : unselectedClass
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lawn Goal */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Lawn Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "low-maintenance", label: "Low Maint." },
                  { value: "healthy-green", label: "Healthy" },
                  { value: "golf-course", label: "Golf-Course" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, lawnGoal: option.value as typeof formData.lawnGoal })}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      formData.lawnGoal === option.value ? selectedClass : unselectedClass
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mower Type */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Mower Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "rotary", label: "Rotary" },
                  { value: "reel", label: "Reel" },
                  { value: "riding", label: "Riding" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, mowerType: option.value as typeof formData.mowerType })}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      formData.mowerType === option.value ? selectedClass : unselectedClass
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spreader */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Spreader
              </label>
              <select
                value={formData.spreaderType}
                onChange={(e) => setFormData({ ...formData, spreaderType: e.target.value })}
                className="w-full px-3 py-2.5 bg-cream/30 border border-deep-brown/10 rounded-xl text-deep-brown text-sm outline-none focus:border-lawn focus:ring-2 focus:ring-lawn/10"
              >
                <option value="">Select spreader</option>
                <option value="scotts-broadcast">Scotts Broadcast</option>
                <option value="scotts-wizz">Scotts Wizz</option>
                <option value="earthway-broadcast">EarthWay Broadcast</option>
                <option value="andersons-lco-1000">Andersons LCO-1000</option>
                <option value="other">Other</option>
                <option value="none">No Spreader</option>
              </select>
            </div>

            {/* Irrigation */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Irrigation
              </label>
              <select
                value={formData.irrigationSystem}
                onChange={(e) => setFormData({ ...formData, irrigationSystem: e.target.value as typeof formData.irrigationSystem })}
                className="w-full px-3 py-2.5 bg-cream/30 border border-deep-brown/10 rounded-xl text-deep-brown text-sm outline-none focus:border-lawn focus:ring-2 focus:ring-lawn/10"
              >
                <option value="">Select irrigation</option>
                <option value="none">None</option>
                <option value="manual">Manual (hose/sprinkler)</option>
                <option value="in-ground">In-ground system</option>
                <option value="drip">Drip irrigation</option>
              </select>
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSaveProfile}
              className="w-full px-4 py-3 bg-lawn hover:bg-lawn/90 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Account Actions */}
        <div className="bg-white rounded-2xl border border-deep-brown/10 overflow-hidden">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-cream/50 transition-colors text-left"
          >
            <svg className="w-5 h-5 text-deep-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium text-deep-brown">
              {signingOut ? "Signing out..." : "Sign Out"}
            </span>
          </button>
        </div>

        {/* App info */}
        <p className="text-center text-xs text-deep-brown/30 pt-4">
          LawnHQ v1.0
        </p>
      </div>
    </div>
  );
}
