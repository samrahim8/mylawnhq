"use client";

import { Equipment } from "@/types";
import EquipmentTile from "./EquipmentTile";

interface EquipmentGridProps {
  equipment: Equipment[];
  onAddClick: () => void;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: string) => void;
}

// Push Mower icon (side view)
function MowerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <rect
        x="8"
        y="18"
        width="24"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Handle */}
      <path
        d="M32 20L40 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 24L40 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Grip */}
      <path
        d="M39 6L42 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Wheels */}
      <circle cx="12" cy="34" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="28" cy="34" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Blade deck */}
      <path d="M10 30h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Document icon
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// Bell icon
function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export default function EquipmentGrid({
  equipment,
  onAddClick,
  onEdit,
  onDelete,
}: EquipmentGridProps) {
  if (equipment.length === 0) {
    return (
      <div className="space-y-4 pt-8">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-[#3D3D3D] mb-2">
            Time to show off the arsenal.
          </h2>
          <p className="text-[#6B6B6B]">
            Add your gear — we&apos;ll hook you up with manuals and remind you when it&apos;s time for maintenance.
          </p>
        </div>

        {/* Preview Section */}
        <div className="mt-6">
          <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide mb-3">
            Here&apos;s what it looks like
          </p>

          {/* Example Equipment Card */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex items-center gap-4">
            {/* Equipment icon */}
            <div className="w-14 h-14 bg-[#F5F3F0] rounded-xl flex items-center justify-center flex-shrink-0">
              <MowerIcon className="w-8 h-8 text-[#8B9D82]" />
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#3D3D3D] text-lg">Honda HRX217VKA</h4>
              <p className="text-[#A8A8A8]">Push Mower</p>
            </div>
            {/* Manual link */}
            <div className="flex items-center gap-1.5 text-[#8B9D82] flex-shrink-0">
              <DocumentIcon className="w-5 h-5" />
              <span className="font-medium">Manual</span>
            </div>
          </div>
        </div>

        {/* Benefits Row */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex items-stretch">
          {/* Manuals on tap */}
          <div className="flex-1 flex items-start gap-3">
            <DocumentIcon className="w-6 h-6 text-[#8B9D82] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#3D3D3D]">Manuals on tap</h4>
              <p className="text-sm text-[#A8A8A8]">No more digging through drawers</p>
            </div>
          </div>
          {/* Divider */}
          <div className="w-px bg-[#E5E5E5] mx-4" />
          {/* Maintenance pings */}
          <div className="flex-1 flex items-start gap-3">
            <BellIcon className="w-6 h-6 text-[#8B9D82] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#3D3D3D]">Maintenance pings</h4>
              <p className="text-sm text-[#A8A8A8]">We&apos;ll nudge you at the right time</p>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onAddClick}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#8B9D82] hover:bg-[#7a8b71] text-white rounded-xl font-medium text-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Piece of Gear
        </button>

        {/* Secondary Hint */}
        <p className="text-center text-[#A8A8A8]">
          Start with your mower — it&apos;s the MVP of the shed.
        </p>
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
        className="bg-white rounded-lg border-2 border-dashed border-[#d4d4d4] hover:border-[#8B9D82] p-4 flex flex-col items-center justify-center min-h-[120px] transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-[#F5F3F0] group-hover:bg-[#e8ebe5] flex items-center justify-center mb-2 transition-colors">
          <svg
            className="w-5 h-5 text-[#8B9D82]"
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
        <span className="text-sm font-medium text-[#6B6B6B] group-hover:text-[#8B9D82] transition-colors">
          Add Gear
        </span>
      </button>
    </div>
  );
}
