"use client";

import { Equipment } from "@/types";
import EquipmentTile from "./EquipmentTile";

interface EquipmentGridProps {
  equipment: Equipment[];
  onAddClick: () => void;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: string) => void;
}

export default function EquipmentGrid({
  equipment,
  onAddClick,
  onEdit,
  onDelete,
}: EquipmentGridProps) {
  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-[#f8f6f3] rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-[#7a8b6e]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">
          No gear yet
        </h3>
        <p className="text-sm text-[#737373] text-center mb-4">
          Add your first piece of equipment to get started
        </p>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg font-medium text-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
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
          Add Your First Gear
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {equipment.map((item) => (
        <EquipmentTile
          key={item.id}
          equipment={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* Add Gear tile */}
      <button
        onClick={onAddClick}
        className="bg-white rounded-lg border-2 border-dashed border-[#d4d4d4] hover:border-[#7a8b6e] p-4 flex flex-col items-center justify-center min-h-[120px] transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-[#f8f6f3] group-hover:bg-[#e8ebe5] flex items-center justify-center mb-2 transition-colors">
          <svg
            className="w-5 h-5 text-[#7a8b6e]"
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
        </div>
        <span className="text-sm font-medium text-[#737373] group-hover:text-[#7a8b6e] transition-colors">
          Add Gear
        </span>
      </button>
    </div>
  );
}
