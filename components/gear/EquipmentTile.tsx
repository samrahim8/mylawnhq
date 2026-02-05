"use client";

import { Equipment } from "@/types";

interface EquipmentTileProps {
  equipment: Equipment;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: string) => void;
}

export default function EquipmentTile({
  equipment,
  onEdit,
  onDelete,
}: EquipmentTileProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-4 flex flex-col justify-between min-h-[120px] relative group">
      {/* Delete button - shows on hover */}
      {onDelete && (
        <button
          onClick={() => onDelete(equipment.id)}
          className="absolute top-2 right-2 p-1.5 rounded-lg text-[#a3a3a3] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete equipment"
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
              strokeWidth={1.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      {/* Equipment info */}
      <div
        className={onEdit ? "cursor-pointer" : ""}
        onClick={() => onEdit?.(equipment)}
      >
        <h3 className="font-semibold text-[#1a1a1a] text-base leading-tight">
          {equipment.brand} {equipment.model}
        </h3>
        <p className="text-sm text-[#737373] mt-1">{equipment.type}</p>
      </div>

      {/* Manual link */}
      <div className="mt-3">
        {equipment.manualUrl ? (
          <a
            href={equipment.manualUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#7a8b6e] hover:text-[#5a6950] font-medium inline-flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            Owner&apos;s Manual
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ) : (
          <span className="text-sm text-[#a3a3a3]">No manual found</span>
        )}
      </div>
    </div>
  );
}
