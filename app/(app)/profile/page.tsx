"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, saveProfile, isSetUp } = useProfile();

  const [formData, setFormData] = useState({
    zipCode: "",
    grassType: "bermuda" as "zoysia" | "bermuda" | "mixed",
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Profile Setup
          </h1>
          <p className="text-neutral-600">
            Tell us about your lawn so we can provide personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Zip Code *
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              placeholder="Enter your zip code"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
              required
              maxLength={10}
            />
            <p className="mt-1 text-xs text-neutral-400">
              Used for local weather and growing conditions
            </p>
          </div>

          {/* Grass Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Grass Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "bermuda", label: "Bermuda", desc: "Warm-season, drought-tolerant" },
                { value: "zoysia", label: "Zoysia", desc: "Dense, low maintenance" },
                { value: "mixed", label: "Mixed", desc: "Combination of types" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      grassType: option.value as "zoysia" | "bermuda" | "mixed",
                    })
                  }
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.grassType === option.value
                      ? "bg-neutral-900/10 border-neutral-900 text-neutral-900"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-neutral-400 mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Lawn Size */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Lawn Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "small", label: "Small", desc: "< 2,500 sq ft" },
                { value: "medium", label: "Medium", desc: "2,500 - 10,000 sq ft" },
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
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.lawnSize === option.value
                      ? "bg-neutral-900/10 border-neutral-900 text-neutral-900"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-neutral-400 mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sun Exposure */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Sun Exposure
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "full", label: "Full Sun", desc: "6+ hours direct sun" },
                { value: "partial", label: "Partial", desc: "3-6 hours sun" },
                { value: "shade", label: "Shade", desc: "< 3 hours sun" },
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
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.sunExposure === option.value
                      ? "bg-neutral-900/10 border-neutral-900 text-neutral-900"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-neutral-400 mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Irrigation System */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Irrigation System (optional)
            </label>
            <select
              value={formData.irrigationSystem}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  irrigationSystem: e.target.value as "" | "none" | "manual" | "in-ground" | "drip",
                })
              }
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 outline-none focus:border-neutral-900"
            >
              <option value="">Select irrigation system</option>
              <option value="none">None</option>
              <option value="manual">Manual (hose/sprinkler)</option>
              <option value="in-ground">In-ground sprinkler system</option>
              <option value="drip">Drip irrigation</option>
            </select>
            <p className="mt-1 text-xs text-neutral-400">
              Helps us recommend watering schedules
            </p>
          </div>

          {/* Lawn Goal */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Lawn Goal (optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "low-maintenance", label: "Low Maintenance", desc: "Minimal effort, good enough" },
                { value: "healthy-green", label: "Healthy Green", desc: "Regular care, nice lawn" },
                { value: "golf-course", label: "Golf-Course", desc: "Premium quality, pristine" },
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
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.lawnGoal === option.value
                      ? "bg-neutral-900/10 border-neutral-900 text-neutral-900"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-neutral-400 mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Lawn Age */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Lawn Age (optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "new", label: "New", desc: "Less than 1 year old" },
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
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.lawnAge === option.value
                      ? "bg-neutral-900/10 border-neutral-900 text-neutral-900"
                      : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-neutral-400 mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Known Issues (multi-select) */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Known Issues (optional)
            </label>
            <p className="text-xs text-neutral-400 mb-3">
              Select all that apply to your lawn
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: "weeds", label: "Weeds", desc: "Unwanted plants" },
                { value: "bare-spots", label: "Bare Spots", desc: "Patchy areas" },
                { value: "fungus", label: "Fungus", desc: "Disease/mold" },
                { value: "pests", label: "Pests", desc: "Insects/grubs" },
                { value: "shade-damage", label: "Shade Damage", desc: "Thin/weak areas" },
                { value: "none", label: "None", desc: "No issues" },
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
                    className={`p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-neutral-900/10 border-neutral-900 text-neutral-900"
                        : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "border-neutral-900 bg-neutral-900"
                            : "border-neutral-400"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
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
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{option.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Soil Type (optional) */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Soil Type (optional)
            </label>
            <select
              value={formData.soilType}
              onChange={(e) =>
                setFormData({ ...formData, soilType: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 outline-none focus:border-neutral-900"
            >
              <option value="">Select soil type</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loam">Loam</option>
              <option value="silt">Silt</option>
              <option value="unknown">Not sure</option>
            </select>
          </div>

          {/* Spreader Type (optional) */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Spreader Type (optional)
            </label>
            <select
              value={formData.spreaderType}
              onChange={(e) =>
                setFormData({ ...formData, spreaderType: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 outline-none focus:border-neutral-900"
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
            <p className="mt-1 text-xs text-neutral-400">
              Used for fertilizer and seed application rate settings
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors"
            >
              {isSetUp ? "Update Profile" : "Save Profile"}
            </button>
            {isSetUp && (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
