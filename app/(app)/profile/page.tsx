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
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(formData);
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
