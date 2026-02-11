"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

export default function SandboxProfilePage() {
  const router = useRouter();
  const { profile, saveProfile, isSetUp } = useProfile();

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

  // Pre-populate from existing profile (zip code and grass type will already be there)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({
      ...formData,
      mowerType: formData.mowerType || undefined,
      irrigationSystem: formData.irrigationSystem || undefined,
      lawnGoal: formData.lawnGoal || undefined,
      lawnAge: formData.lawnAge || undefined,
    });
    router.push("/home");
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

  const selectedClass = "bg-[#7a8b6e]/20 border-[#7a8b6e] text-[#5a6b4e]";
  const unselectedClass = "bg-white border-neutral-200 text-neutral-600 hover:border-[#7a8b6e]/50";

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
          <h1 className="font-display text-lg font-bold text-deep-brown">Finish Your Profile</h1>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-12">
        {/* Progress indicator */}
        <div className="bg-white rounded-2xl border border-deep-brown/10 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-deep-brown">Profile completeness</span>
            <span className="text-sm font-semibold text-lawn">
              {Math.round(((filledCount + 3) / (totalOptional + 3)) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-deep-brown/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-lawn rounded-full transition-all duration-500"
              style={{ width: `${((filledCount + 3) / (totalOptional + 3)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-deep-brown/50 mt-2">
            The more we know, the better your recommendations get.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-deep-brown/10 shadow-sm p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-deep-brown mb-1 font-display">
              Dial It In
            </h2>
            <p className="text-sm text-deep-brown/60">
              A few more details so Larry can give you spot-on advice.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Zip Code - Pre-populated, shown as confirmed */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Zip Code *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  placeholder="Enter your zip code"
                  className="w-full px-3 py-2.5 bg-lawn/5 border border-lawn/20 rounded-xl text-deep-brown text-sm placeholder-deep-brown/30 outline-none focus:border-lawn focus:ring-2 focus:ring-lawn/10"
                  required
                  maxLength={10}
                />
                {formData.zipCode && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Grass Type - Pre-populated, shown as confirmed */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Grass Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "bermuda", label: "Bermuda", desc: "Warm-season, drought-tolerant" },
                  { value: "zoysia", label: "Zoysia", desc: "Dense, low maintenance" },
                  { value: "fescue-kbg", label: "Fescue/KBG", desc: "Cool-season, shade-tolerant" },
                  { value: "st-augustine", label: "St. Augustine", desc: "Warm-season, shade-tolerant" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        grassType: option.value as "bermuda" | "zoysia" | "fescue-kbg" | "st-augustine",
                      })
                    }
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      formData.grassType === option.value
                        ? selectedClass
                        : unselectedClass
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{option.label}</p>
                      {formData.grassType === option.value && (
                        <svg className="w-4 h-4 text-[#5a6b4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider - "Almost there" section */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-deep-brown/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-deep-brown/40 font-medium">
                  FILL THESE IN FOR BETTER RESULTS
                </span>
              </div>
            </div>

            {/* Lawn Size */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Lawn Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "small", label: "Small", desc: "< 2,500 sq ft" },
                  { value: "medium", label: "Medium", desc: "2,500 - 10k sq ft" },
                  { value: "large", label: "Large", desc: "> 10,000 sq ft" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        lawnSize: option.value as "small" | "medium" | "large",
                      })
                    }
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      formData.lawnSize === option.value
                        ? selectedClass
                        : unselectedClass
                    }`}
                  >
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-neutral-400">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sun Exposure */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Sun Exposure
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "full", label: "Full Sun", desc: "6+ hours" },
                  { value: "partial", label: "Partial", desc: "3-6 hours" },
                  { value: "shade", label: "Shade", desc: "< 3 hours" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        sunExposure: option.value as "full" | "partial" | "shade",
                      })
                    }
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      formData.sunExposure === option.value
                        ? selectedClass
                        : unselectedClass
                    }`}
                  >
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-neutral-400">{option.desc}</p>
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
                  { value: "low-maintenance", label: "Low Maintenance", desc: "Minimal effort" },
                  { value: "healthy-green", label: "Healthy Green", desc: "Regular care" },
                  { value: "golf-course", label: "Golf-Course", desc: "Premium quality" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        lawnGoal: option.value as "low-maintenance" | "healthy-green" | "golf-course",
                      })
                    }
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      formData.lawnGoal === option.value
                        ? selectedClass
                        : unselectedClass
                    }`}
                  >
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-neutral-400">{option.desc}</p>
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
                  { value: "rotary", label: "Rotary", desc: "Push/self-propelled" },
                  { value: "reel", label: "Reel", desc: "Cylinder/manual mower" },
                  { value: "riding", label: "Riding", desc: "Sit-down mower" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        mowerType: option.value as "rotary" | "reel" | "riding",
                      })
                    }
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      formData.mowerType === option.value
                        ? selectedClass
                        : unselectedClass
                    }`}
                  >
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-neutral-400">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Spreader Type */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Spreader Type
              </label>
              <select
                value={formData.spreaderType}
                onChange={(e) =>
                  setFormData({ ...formData, spreaderType: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-deep-brown text-sm outline-none focus:border-[#7a8b6e] focus:ring-2 focus:ring-lawn/10"
              >
                <option value="">Select spreader</option>
                <optgroup label="The Andersons">
                  <option value="andersons-lco-1000">The Andersons LCO-1000</option>
                  <option value="andersons-pacer-pro">The Andersons Pacer Pro</option>
                  <option value="andersons-yard-star-2150">The Andersons Yard Star 2150</option>
                  <option value="andersons-2000">The Andersons Model 2000</option>
                  <option value="andersons-sr">The Andersons SR</option>
                </optgroup>
                <optgroup label="Agri-Fab">
                  <option value="agri-fab-broadcast">Agri-Fab Broadcast (1-10)</option>
                  <option value="agri-fab-rotary">Agri-Fab Rotary</option>
                </optgroup>
                <optgroup label="Brinly">
                  <option value="brinly-broadcast">Brinly 20 Series Push Broadcast (0-30)</option>
                </optgroup>
                <optgroup label="Chapin">
                  <option value="chapin-broadcast">Chapin Broadcast (0-30)</option>
                </optgroup>
                <optgroup label="Craftsman">
                  <option value="craftsman-broadcast">Craftsman Broadcast (1-10)</option>
                </optgroup>
                <optgroup label="EarthWay">
                  <option value="earthway-3400-hand">EarthWay 3400 Hand Spreader (1-3)</option>
                  <option value="earthway-broadcast">EarthWay Broadcast (0-30)</option>
                  <option value="earthway-drop">Earthway Drop</option>
                  <option value="earthway-rotary">Earthway Rotary</option>
                </optgroup>
                <optgroup label="Echo">
                  <option value="echo-broadcast">Echo Broadcast</option>
                </optgroup>
                <optgroup label="Lesco">
                  <option value="lesco-broadcast">Lesco Broadcast</option>
                  <option value="lesco-rotary-numbers">Lesco Rotary (numbers)</option>
                  <option value="lesco-rotary-letters">Lesco Rotary (letters)</option>
                </optgroup>
                <optgroup label="Precision">
                  <option value="precision-broadcast">Precision Broadcast (1-10)</option>
                </optgroup>
                <optgroup label="Prizelawn">
                  <option value="prizelawn-bf1-cbr">Prizelawn BF1/CBR/III/CBR IV</option>
                  <option value="prizelawn-lf-ii">Prizelawn LF II</option>
                </optgroup>
                <optgroup label="Scotts">
                  <option value="scotts-broadcast">Scotts Broadcast (2-15)</option>
                  <option value="scotts-hand-held-broadcast">Scotts Hand-Held Broadcast</option>
                  <option value="scotts-wizz">Scotts Wizz Hand Broadcast Spreader</option>
                  <option value="scotts-rotary-consumer">Scotts Rotary (Consumer)</option>
                  <option value="scotts-drop-consumer">Scotts Drop (Consumer)</option>
                  <option value="scotts-easygreen">Scotts EasyGreen (Consumer)</option>
                  <option value="scotts-rba-pro-rotary">Scotts RBA Pro Rotary</option>
                </optgroup>
                <optgroup label="Spyker">
                  <option value="spyker-broadcast">Spyker Broadcast</option>
                  <option value="spyker-rotary">Spyker Rotary</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="other">Other Spreader</option>
                  <option value="none">No Spreader</option>
                </optgroup>
              </select>
            </div>

            {/* Irrigation System */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Irrigation System
              </label>
              <select
                value={formData.irrigationSystem}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    irrigationSystem: e.target.value as "" | "none" | "manual" | "in-ground" | "drip",
                  })
                }
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-deep-brown text-sm outline-none focus:border-[#7a8b6e] focus:ring-2 focus:ring-lawn/10"
              >
                <option value="">Select irrigation system</option>
                <option value="none">None</option>
                <option value="manual">Manual (hose/sprinkler)</option>
                <option value="in-ground">In-ground sprinkler system</option>
                <option value="drip">Drip irrigation</option>
              </select>
            </div>

            {/* Lawn Age */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Lawn Age
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "new", label: "New", desc: "< 1 year old" },
                  { value: "established", label: "Established", desc: "1+ years old" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        lawnAge: option.value as "new" | "established",
                      })
                    }
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      formData.lawnAge === option.value
                        ? selectedClass
                        : unselectedClass
                    }`}
                  >
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-neutral-400">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Known Issues (multi-select) */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Known Issues
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: "weeds", label: "Weeds" },
                  { value: "bare-spots", label: "Bare Spots" },
                  { value: "fungus", label: "Fungus" },
                  { value: "pests", label: "Pests" },
                  { value: "shade-damage", label: "Shade Damage" },
                  { value: "none", label: "None" },
                ].map((option) => {
                  const isSelected = formData.knownIssues.includes(option.value);
                  const isNone = option.value === "none";

                  const handleToggle = () => {
                    if (isNone) {
                      setFormData({
                        ...formData,
                        knownIssues: isSelected ? [] : ["none"],
                      });
                    } else {
                      const withoutNone = formData.knownIssues.filter((i) => i !== "none");
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          knownIssues: withoutNone.filter((i) => i !== option.value),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          knownIssues: [...withoutNone, option.value],
                        });
                      }
                    }
                  };

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={handleToggle}
                      className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                        isSelected ? selectedClass : unselectedClass
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-[#7a8b6e] bg-[#7a8b6e]"
                              : "border-neutral-400"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <p className="font-medium text-sm">{option.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-sm font-medium text-deep-brown/70 mb-1.5">
                Soil Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) =>
                  setFormData({ ...formData, soilType: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-deep-brown text-sm outline-none focus:border-[#7a8b6e] focus:ring-2 focus:ring-lawn/10"
              >
                <option value="">Select soil type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loam">Loam</option>
                <option value="silt">Silt</option>
                <option value="unknown">Not sure</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-terracotta hover:bg-terracotta/90 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all"
              >
                Save & Go Back
              </button>
              <Link
                href="/home"
                className="px-4 py-3 bg-deep-brown/5 hover:bg-deep-brown/10 text-deep-brown/60 text-sm font-medium rounded-xl transition-colors text-center"
              >
                Skip for now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
