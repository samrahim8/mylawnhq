"use client";

import { Equipment } from "@/types";
import EquipmentTile from "./EquipmentTile";

interface EquipmentGridProps {
  equipment: Equipment[];
  onAddClick: () => void;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: string) => void;
  suggestedEquipment?: SuggestedEquipment[];
  onAddSuggested?: (suggested: SuggestedEquipment) => void;
}

export interface SuggestedEquipment {
  type: "mower" | "spreader";
  displayName: string;
  equipmentType: string;
  brand?: string;
  model?: string;
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

// Wrench icon for badge
function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
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
        d="M8 6L14 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* D-handle */}
      <path
        d="M16 14C18 12 22 12 24 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Motor housing */}
      <ellipse
        cx="38"
        cy="34"
        rx="4"
        ry="5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Cutting head */}
      <circle cx="38" cy="42" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* String lines */}
      <path
        d="M34 42L32 44M42 42L44 44"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 1"
      />
    </svg>
  );
}

// Broadcast Spreader icon
export function SpreaderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hopper/container */}
      <path
        d="M14 8h20l-3 16H17L14 8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Hopper top rim */}
      <path
        d="M14 8h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Handle */}
      <path
        d="M24 8V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 4h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Frame/legs */}
      <path
        d="M17 24v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M31 24v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Wheels */}
      <circle cx="17" cy="36" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="31" cy="36" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Spreader disc */}
      <ellipse cx="24" cy="28" rx="5" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Spread pattern */}
      <path
        d="M16 32l-4 6M24 30v8M32 32l4 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

// Export MowerIcon for use in other components
export { MowerIcon };

export default function EquipmentGrid({
  equipment,
  onAddClick,
  onEdit,
  onDelete,
  suggestedEquipment = [],
  onAddSuggested,
}: EquipmentGridProps) {
  const hasEquipment = equipment.length > 0;
  const hasSuggested = suggestedEquipment.length > 0;

  return (
    <div className="bg-[#f8f6f3] min-h-screen -mt-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
      {/* Header Section */}
      <div className="text-center pt-8 pb-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C17F5920] mb-5">
          <WrenchIcon className="w-4 h-4 text-[#C17F59]" />
          <span className="text-sm font-medium text-[#C17F59]">GEAR TRACKER</span>
        </div>

        {/* Equipment Icons Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5">
          {/* Spreader - smaller, gray */}
          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl border border-[#E5E5E5] flex items-center justify-center">
            <SpreaderIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#A8A8A8]" />
          </div>
          {/* Mower - larger, sage border */}
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white rounded-xl border-2 border-[#8B9D82] flex items-center justify-center">
            <MowerIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#8B9D82]" />
          </div>
          {/* Trimmer - smaller, gray */}
          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl border border-[#E5E5E5] flex items-center justify-center">
            <TrimmerIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#A8A8A8]" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3D3D3D] mb-2">
          Time to show off the <span className="text-[#C17F59]">arsenal</span>.
        </h1>
        <p className="text-[#6B6B6B]">
          Log it. Track it. Never lose another manual.
        </p>
      </div>

      {/* Sage Accent Stripe */}
      <div className="h-1 bg-[#8B9D82] mb-6" />

      {/* Content Section */}
      <div className="space-y-5 pb-8">
        {/* Example Card Section - Only show when no equipment */}
        {!hasEquipment && (
          <div>
            <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide mb-3">
              HERE&apos;S WHAT IT LOOKS LIKE
            </p>

            <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
              {/* Top section */}
              <div className="p-4 flex items-start gap-3 sm:gap-4">
                {/* Equipment icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5F3F0] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MowerIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#8B9D82]" />
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#3D3D3D] text-base sm:text-lg">HRX217VKA</h4>
                  <p className="text-[#A8A8A8] text-sm">Push Mower</p>
                </div>
                {/* Right side */}
                <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
                  {/* Manual button */}
                  <a
                    href="http://cdn.powerequipment.honda.com/pe/pdf/manuals/00x31vh7n030.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#8B9D8226] rounded-lg text-[#8B9D82] hover:bg-[#8B9D8240] transition-colors"
                  >
                    <DocumentIcon className="w-4 h-4" />
                    <span className="font-medium text-sm">Manual</span>
                  </a>
                  {/* Warranty */}
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-[#8B9D82]">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="hidden sm:inline">18 mo. left on warranty</span>
                    <span className="sm:hidden">18 mo. warranty</span>
                  </div>
                </div>
              </div>
              {/* Bottom section - details row */}
              <div className="border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 flex items-center">
                <div className="flex-1 text-center">
                  <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Serial / Model</p>
                  <p className="font-semibold text-[#3D3D3D] text-sm sm:text-base">
                    <span className="hidden sm:inline">MZCG-8677291</span>
                    <span className="sm:hidden">MZCG-867...</span>
                  </p>
                </div>
                <div className="w-px h-8 bg-[#E5E5E5]" />
                <div className="flex-1 text-center">
                  <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Brand</p>
                  <p className="font-semibold text-[#3D3D3D] text-sm sm:text-base">Honda</p>
                </div>
                <div className="w-px h-8 bg-[#E5E5E5]" />
                <div className="flex-1 text-center">
                  <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Purchased</p>
                  <p className="font-semibold text-[#3D3D3D] text-sm sm:text-base">
                    <span className="hidden sm:inline">Mar 2024</span>
                    <span className="sm:hidden">Mar &apos;24</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Incomplete Items Section - NOW FINISH YOURS */}
        {hasSuggested && (
          <div>
            <p className="text-xs font-medium text-[#C17F59] uppercase tracking-wide mb-3">
              NOW FINISH YOURS
            </p>

            <div className="space-y-3">
              {suggestedEquipment.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden"
                >
                  {/* Desktop version */}
                  <div className="hidden sm:block">
                    <div className="p-4 flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-[#F5F3F0] rounded-xl flex items-center justify-center flex-shrink-0">
                        {item.type === "mower" ? (
                          <MowerIcon className="w-7 h-7 text-[#A8A8A8]" />
                        ) : (
                          <SpreaderIcon className="w-7 h-7 text-[#A8A8A8]" />
                        )}
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#3D3D3D]">{item.displayName}</h4>
                        <p className="text-sm text-[#A8A8A8]">{item.equipmentType}</p>
                      </div>
                      {/* Complete link */}
                      <button
                        onClick={() => onAddSuggested?.(item)}
                        className="inline-flex items-center gap-1 text-[#8B9D82] hover:text-[#7a8b71] font-medium transition-colors"
                      >
                        Complete
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    {/* Ghost details row */}
                    <div className="border-t border-dashed border-[#E5E5E5] px-4 py-3 flex items-center">
                      <div className="flex-1 text-center">
                        <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Serial / Model</p>
                        <p className="text-[#D4D4D4]">&mdash;</p>
                      </div>
                      <div className="w-px h-8 bg-[#E5E5E5]" />
                      <div className="flex-1 text-center">
                        <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Brand</p>
                        <p className="text-[#D4D4D4]">&mdash;</p>
                      </div>
                      <div className="w-px h-8 bg-[#E5E5E5]" />
                      <div className="flex-1 text-center">
                        <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Purchased</p>
                        <p className="text-[#D4D4D4]">&mdash;</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile version - compact */}
                  <div className="sm:hidden p-4 flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#F5F3F0] rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.type === "mower" ? (
                        <MowerIcon className="w-6 h-6 text-[#A8A8A8]" />
                      ) : (
                        <SpreaderIcon className="w-6 h-6 text-[#A8A8A8]" />
                      )}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#3D3D3D] text-sm">{item.displayName}</h4>
                      <p className="text-xs text-[#A8A8A8]">Needs serial, brand, date</p>
                    </div>
                    {/* Add link */}
                    <button
                      onClick={() => onAddSuggested?.(item)}
                      className="inline-flex items-center gap-0.5 text-[#8B9D82] hover:text-[#7a8b71] font-medium text-sm transition-colors"
                    >
                      Add
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Gear Section - Show completed equipment */}
        {hasEquipment && (
          <div>
            <p className="text-xs font-medium text-[#8B9D82] uppercase tracking-wide mb-3">
              YOUR GEAR
            </p>

            <div className="space-y-3">
              {equipment.map((item) => (
                <EquipmentTile
                  key={item.id}
                  equipment={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section - Only show when no equipment */}
        {!hasEquipment && (
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-4">
            {/* Desktop: side by side */}
            <div className="hidden sm:flex items-stretch">
              <div className="flex-1 flex items-start gap-3">
                <DocumentIcon className="w-5 h-5 text-[#8B9D82] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#3D3D3D]">Manuals on tap</h4>
                  <p className="text-sm text-[#A8A8A8]">No more digging through drawers</p>
                </div>
              </div>
              <div className="w-px bg-[#E5E5E5] mx-4" />
              <div className="flex-1 flex items-start gap-3">
                <BellIcon className="w-5 h-5 text-[#8B9D82] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#3D3D3D]">Maintenance pings</h4>
                  <p className="text-sm text-[#A8A8A8]">We&apos;ll nudge you at the right time</p>
                </div>
              </div>
            </div>

            {/* Mobile: stacked */}
            <div className="sm:hidden space-y-4">
              <div className="flex items-start gap-3">
                <DocumentIcon className="w-5 h-5 text-[#8B9D82] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#3D3D3D]">Manuals on tap</h4>
                  <p className="text-sm text-[#A8A8A8]">No more digging through drawers</p>
                </div>
              </div>
              <div className="h-px bg-[#E5E5E5]" />
              <div className="flex items-start gap-3">
                <BellIcon className="w-5 h-5 text-[#8B9D82] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#3D3D3D]">Maintenance pings</h4>
                  <p className="text-sm text-[#A8A8A8]">We&apos;ll nudge you at the right time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <button
          onClick={onAddClick}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#8B9D82] hover:bg-[#7a8b71] text-white rounded-xl font-medium text-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add More Gear
        </button>

        {/* Footer Hint */}
        <p className="text-center text-[#A8A8A8] text-sm">
          Mowers, trimmers, spreaders, blowers — if it touches the lawn, add it.
        </p>
      </div>
    </div>
  );
}
