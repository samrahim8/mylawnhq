"use client";

import { Equipment } from "@/types";
import EquipmentTile from "./EquipmentTile";

interface EquipmentGridProps {
  equipment: Equipment[];
  onAddClick: () => void;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: string) => void;
}

// Spreader icon (side view)
function SpreaderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hopper */}
      <path
        d="M12 12h24l-4 16H16L12 12z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Handle */}
      <path
        d="M20 12V6h8v6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Wheels */}
      <circle cx="16" cy="34" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="32" cy="34" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Axle */}
      <path d="M16 34h16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
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

// String Trimmer icon (side view)
function TrimmerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shaft */}
      <path
        d="M12 8L36 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Handle grip */}
      <path
        d="M10 6L14 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* D-handle */}
      <path
        d="M18 12c-4 0-6 2-6 4s2 4 6 4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Trimmer head */}
      <circle cx="38" cy="34" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* String lines */}
      <path
        d="M34 38L32 42M42 38L44 42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Benefit item component
function BenefitItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="text-[#A8A8A8]">{icon}</div>
      <span className="text-sm text-[#6B6B6B]">{label}</span>
    </div>
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
      <div className="space-y-4">
        {/* Empty State Card */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
          <div className="flex flex-col items-center text-center">
            {/* Equipment Icons Row */}
            <div className="flex items-end justify-center gap-2 mb-6">
              {/* Spreader - muted, smaller */}
              <div className="w-14 h-14 bg-[#F5F3F0] rounded-xl flex items-center justify-center">
                <SpreaderIcon className="w-8 h-8 text-[#A8A8A8]" />
              </div>
              {/* Mower - highlighted, larger */}
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-xl flex items-center justify-center border-2 border-[#8B9D82]">
                <MowerIcon className="w-10 h-10 text-[#8B9D82]" />
              </div>
              {/* Trimmer - muted, smaller */}
              <div className="w-14 h-14 bg-[#F5F3F0] rounded-xl flex items-center justify-center">
                <TrimmerIcon className="w-8 h-8 text-[#A8A8A8]" />
              </div>
            </div>

            {/* Headline */}
            <h3 className="text-xl font-semibold text-[#3D3D3D] mb-2">
              No gear yet — let&apos;s fix that.
            </h3>

            {/* Subhead */}
            <p className="text-[#6B6B6B] mb-6 max-w-md">
              Add your mower, spreader, trimmer, whatever you&apos;ve got. We&apos;ll
              keep track of owner&apos;s manuals, maintenance tips, and help you get
              the most out of your tools.
            </p>

            {/* Benefit Callouts */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <BenefitItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                label="Owner's manuals"
              />
              <BenefitItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                }
                label="Maintenance reminders"
              />
              <BenefitItem
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                label="Smarter recs"
              />
            </div>

            {/* Primary CTA */}
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B9D82] hover:bg-[#7a8b71] text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Piece of Gear
            </button>

            {/* Secondary Hint */}
            <p className="text-sm text-[#A8A8A8] mt-4">
              Not sure what to add? Start with your mower — it&apos;s the MVP.
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <div className="border-2 border-dashed border-[#E5E5E5] rounded-2xl p-4">
          <p className="text-sm text-[#A8A8A8] text-center mb-3">
            Once you add gear, it&apos;ll show up like this:
          </p>
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex items-center gap-4">
            {/* Equipment icon */}
            <div className="w-12 h-12 bg-[#F5F3F0] rounded-lg flex items-center justify-center flex-shrink-0">
              <MowerIcon className="w-7 h-7 text-[#8B9D82]" />
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#3D3D3D]">Honda HRX217VKA</h4>
              <p className="text-sm text-[#A8A8A8]">Push Mower &bull; Added Jan 2026</p>
            </div>
            {/* View Manual link */}
            <a href="#" className="text-sm text-[#8B9D82] font-medium hover:underline flex-shrink-0">
              View Manual
            </a>
          </div>
        </div>
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
