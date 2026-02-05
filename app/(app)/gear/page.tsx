"use client";

import { useState } from "react";
import { useEquipment } from "@/hooks/useEquipment";
import EquipmentGrid from "@/components/gear/EquipmentGrid";
import AddEquipmentModal from "@/components/gear/AddEquipmentModal";
import { Equipment } from "@/types";

export default function GearPage() {
  const { equipment, loading, addEquipment, deleteEquipment } = useEquipment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const handleAddClick = () => {
    setEditingEquipment(null);
    setIsModalOpen(true);
  };

  const handleSave = (item: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => {
    addEquipment(item);
    setIsModalOpen(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-3 border-[#7a8b6e] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a]">My Gear</h1>
          <p className="text-sm text-[#737373] mt-0.5">
            {equipment.length === 0
              ? "Add your lawn care equipment"
              : `${equipment.length} item${equipment.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {equipment.length > 0 && (
          <button
            onClick={handleAddClick}
            className="inline-flex items-center justify-center w-10 h-10 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg transition-colors"
            title="Add equipment"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>

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
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
