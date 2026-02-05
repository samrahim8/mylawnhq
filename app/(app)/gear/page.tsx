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
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3D3D3D]">Your Gear Shed</h1>
        <p className="text-[#6B6B6B] mt-1">
          Your equipment, all in one place. Manuals, maintenance reminders, and
          recommendations — tailored to what you actually own.
        </p>
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
