"use client";

import { useState } from "react";
import { useEquipment } from "@/hooks/useEquipment";
import { useProfile } from "@/hooks/useProfile";
import EquipmentGrid, { SuggestedEquipment } from "@/components/gear/EquipmentGrid";
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
      {/* Equipment Grid */}
      <EquipmentGrid
        equipment={equipment}
        onAddClick={handleAddClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        suggestedEquipment={suggestedEquipment}
        onAddSuggested={handleAddSuggested}
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
