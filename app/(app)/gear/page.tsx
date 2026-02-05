"use client";

import { useState } from "react";
import { useEquipment } from "@/hooks/useEquipment";
import { useProfile } from "@/hooks/useProfile";
import EquipmentGrid from "@/components/gear/EquipmentGrid";
import AddEquipmentModal from "@/components/gear/AddEquipmentModal";
import { Equipment } from "@/types";

// Map mower type to display info
const MOWER_TYPE_MAP: Record<string, { name: string; equipmentType: string }> = {
  rotary: { name: "Rotary Mower", equipmentType: "Push Mower" },
  reel: { name: "Reel Mower", equipmentType: "Reel Mower" },
  riding: { name: "Riding Mower", equipmentType: "Riding Mower" },
};

// Map spreader type to display info
const SPREADER_TYPE_MAP: Record<string, { brand: string; model: string; equipmentType: string }> = {
  "andersons-lco-1000": { brand: "The Andersons", model: "LCO-1000", equipmentType: "Broadcast Spreader" },
  "andersons-pacer-pro": { brand: "The Andersons", model: "Pacer Pro", equipmentType: "Broadcast Spreader" },
  "andersons-yard-star-2150": { brand: "The Andersons", model: "Yard Star 2150", equipmentType: "Broadcast Spreader" },
  "andersons-2000": { brand: "The Andersons", model: "Model 2000", equipmentType: "Broadcast Spreader" },
  "andersons-sr": { brand: "The Andersons", model: "SR", equipmentType: "Broadcast Spreader" },
  "agri-fab-broadcast": { brand: "Agri-Fab", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "agri-fab-rotary": { brand: "Agri-Fab", model: "Rotary", equipmentType: "Broadcast Spreader" },
  "brinly-broadcast": { brand: "Brinly", model: "20 Series Push Broadcast", equipmentType: "Broadcast Spreader" },
  "chapin-broadcast": { brand: "Chapin", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "craftsman-broadcast": { brand: "Craftsman", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "earthway-3400-hand": { brand: "EarthWay", model: "3400 Hand Spreader", equipmentType: "Hand Spreader" },
  "earthway-broadcast": { brand: "EarthWay", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "earthway-drop": { brand: "EarthWay", model: "Drop", equipmentType: "Drop Spreader" },
  "earthway-rotary": { brand: "EarthWay", model: "Rotary", equipmentType: "Broadcast Spreader" },
  "echo-broadcast": { brand: "Echo", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "lesco-broadcast": { brand: "Lesco", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "lesco-rotary-numbers": { brand: "Lesco", model: "Rotary", equipmentType: "Broadcast Spreader" },
  "lesco-rotary-letters": { brand: "Lesco", model: "Rotary", equipmentType: "Broadcast Spreader" },
  "precision-broadcast": { brand: "Precision", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "prizelawn-bf1-cbr": { brand: "Prizelawn", model: "BF1/CBR", equipmentType: "Broadcast Spreader" },
  "prizelawn-lf-ii": { brand: "Prizelawn", model: "LF II", equipmentType: "Broadcast Spreader" },
  "scotts-broadcast": { brand: "Scotts", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "scotts-hand-held-broadcast": { brand: "Scotts", model: "Hand-Held Broadcast", equipmentType: "Hand Spreader" },
  "scotts-wizz": { brand: "Scotts", model: "Wizz Hand Broadcast", equipmentType: "Hand Spreader" },
  "scotts-rotary-consumer": { brand: "Scotts", model: "Rotary", equipmentType: "Broadcast Spreader" },
  "scotts-drop-consumer": { brand: "Scotts", model: "Drop", equipmentType: "Drop Spreader" },
  "scotts-easygreen": { brand: "Scotts", model: "EasyGreen", equipmentType: "Broadcast Spreader" },
  "scotts-rba-pro-rotary": { brand: "Scotts", model: "RBA Pro Rotary", equipmentType: "Broadcast Spreader" },
  "spyker-broadcast": { brand: "Spyker", model: "Broadcast", equipmentType: "Broadcast Spreader" },
  "spyker-rotary": { brand: "Spyker", model: "Rotary", equipmentType: "Broadcast Spreader" },
};

interface SuggestedEquipment {
  type: "mower" | "spreader";
  displayName: string;
  equipmentType: string;
  brand?: string;
  model?: string;
}

export default function GearPage() {
  const { equipment, loading, addEquipment, deleteEquipment } = useEquipment();
  const { profile, loading: profileLoading } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [prefillData, setPrefillData] = useState<Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">> | null>(null);

  const handleAddClick = () => {
    setEditingEquipment(null);
    setPrefillData(null);
    setIsModalOpen(true);
  };

  const handleAddSuggested = (suggested: SuggestedEquipment) => {
    setPrefillData({
      brand: suggested.brand || "",
      model: suggested.model || "",
      type: suggested.equipmentType,
      manualUrl: null,
    });
    setIsModalOpen(true);
  };

  const handleSave = (item: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => {
    addEquipment(item);
    setIsModalOpen(false);
    setPrefillData(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this equipment?")) {
      deleteEquipment(id);
    }
  };

  const handleEdit = (item: Equipment) => {
    // For now, just open modal - could add edit functionality later
    setEditingEquipment(item);
  };

  // Build list of suggested equipment from profile that isn't already added
  const getSuggestedEquipment = (): SuggestedEquipment[] => {
    if (!profile) return [];

    const suggestions: SuggestedEquipment[] = [];

    // Check mower type
    if (profile.mowerType && MOWER_TYPE_MAP[profile.mowerType]) {
      const mowerInfo = MOWER_TYPE_MAP[profile.mowerType];
      // Check if user already has a mower of this type
      const hasMower = equipment.some(e =>
        e.type.toLowerCase().includes("mower")
      );
      if (!hasMower) {
        suggestions.push({
          type: "mower",
          displayName: mowerInfo.name,
          equipmentType: mowerInfo.equipmentType,
        });
      }
    }

    // Check spreader type
    if (profile.spreaderType && profile.spreaderType !== "none" && profile.spreaderType !== "other") {
      const spreaderInfo = SPREADER_TYPE_MAP[profile.spreaderType];
      if (spreaderInfo) {
        // Check if user already has a spreader
        const hasSpreader = equipment.some(e =>
          e.type.toLowerCase().includes("spreader")
        );
        if (!hasSpreader) {
          suggestions.push({
            type: "spreader",
            displayName: `${spreaderInfo.brand} ${spreaderInfo.model}`,
            equipmentType: spreaderInfo.equipmentType,
            brand: spreaderInfo.brand,
            model: spreaderInfo.model,
          });
        }
      }
    }

    return suggestions;
  };

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-3 border-[#7a8b6e] border-t-transparent rounded-full" />
      </div>
    );
  }

  const suggestedEquipment = getSuggestedEquipment();

  return (
    <div className="max-w-2xl mx-auto pt-8">
      {/* Suggested Equipment from Profile */}
      {suggestedEquipment.length > 0 && equipment.length === 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide mb-3">
            From your profile
          </p>
          <div className="space-y-2">
            {suggestedEquipment.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex items-center gap-4"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.type === "mower" ? (
                    <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#3D3D3D]">{item.displayName}</h4>
                    <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] text-xs font-medium rounded-full">
                      Needs details
                    </span>
                  </div>
                  <p className="text-sm text-[#A8A8A8]">{item.equipmentType}</p>
                </div>

                {/* Add button */}
                <button
                  onClick={() => handleAddSuggested(item)}
                  className="px-4 py-2 bg-[#8B9D82] hover:bg-[#7a8b71] text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Grid */}
      <EquipmentGrid
        equipment={equipment}
        onAddClick={handleAddClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPrefillData(null);
        }}
        onSave={handleSave}
        prefillData={prefillData}
      />
    </div>
  );
}
