"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, saveProfile, isSetUp } = useProfile();

  const [formData, setFormData] = useState({
    zipCode: "",
    grassType: "bermuda" as "bermuda" | "zoysia" | "fescue-kbg" | "st-augustine",
    lawnSize: "medium" as "small" | "medium" | "large",
    soilType: "",
    sunExposure: "full" as "full" | "partial" | "shade",
    spreaderType: "",
    irrigationSystem: "" as "" | "none" | "manual" | "in-ground" | "drip",
    lawnGoal: "" as "" | "low-maintenance" | "healthy-green" | "golf-course",
    lawnAge: "" as "" | "new" | "established",
    knownIssues: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        zipCode: profile.zipCode || "",
        grassType: profile.grassType || "bermuda",
        lawnSize: profile.lawnSize || "medium",
        soilType: profile.soilType || "",
        sunExposure: profile.sunExposure || "full",
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
    // Convert empty strings to undefined for optional fields
    saveProfile({
      ...formData,
      irrigationSystem: formData.irrigationSystem || undefined,
      lawnGoal: formData.lawnGoal || undefined,
      lawnAge: formData.lawnAge || undefined,
    });
    router.push("/dashboard");
  };

  // Selected button style with sage green
  const selectedClass = "bg-[#7a8b6e]/20 border-[#7a8b6e] text-[#5a6b4e]";
  const unselectedClass = "bg-white border-neutral-200 text-neutral-600 hover:border-[#7a8b6e]/50";

  return (
    <div className="min-h-full pb-8">
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-6">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-neutral-900 mb-1">
              Profile Setup
            </h1>
            <p className="text-sm text-neutral-600">
              Tell us about your lawn for personalized recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
                Zip Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                placeholder="Enter your zip code"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 text-sm placeholder-neutral-400 outline-none focus:border-[#7a8b6e]"
                required
                maxLength={10}
              />
            </div>

            {/* Grass Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
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
                    className={`px-3 py-2 rounded-lg border text-left transition-all ${
                      formData.grassType === option.value
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

            {/* Lawn Size */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
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
                    className={`px-3 py-2 rounded-lg border text-left transition-all ${
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
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
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
                    className={`px-3 py-2 rounded-lg border text-left transition-all ${
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

            {/* Irrigation System */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
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
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 text-sm outline-none focus:border-[#7a8b6e]"
              >
                <option value="">Select irrigation system</option>
                <option value="none">None</option>
                <option value="manual">Manual (hose/sprinkler)</option>
                <option value="in-ground">In-ground sprinkler system</option>
                <option value="drip">Drip irrigation</option>
              </select>
            </div>

            {/* Lawn Goal */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
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
                    className={`px-3 py-2 rounded-lg border text-left transition-all ${
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

            {/* Lawn Age */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
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
                    className={`px-3 py-2 rounded-lg border text-left transition-all ${
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
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
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
                      className={`px-3 py-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? selectedClass
                          : unselectedClass
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
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
                Soil Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) =>
                  setFormData({ ...formData, soilType: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 text-sm outline-none focus:border-[#7a8b6e]"
              >
                <option value="">Select soil type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loam">Loam</option>
                <option value="silt">Silt</option>
                <option value="unknown">Not sure</option>
              </select>
            </div>

            {/* Spreader Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1.5">
                Spreader Type
              </label>
              <select
                value={formData.spreaderType}
                onChange={(e) =>
                  setFormData({ ...formData, spreaderType: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 text-sm outline-none focus:border-[#7a8b6e]"
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

            {/* Submit */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-[#c17f59] hover:bg-[#a86d4a] text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isSetUp ? "Update Profile" : "Save Profile"}
              </button>
              {isSetUp && (
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
