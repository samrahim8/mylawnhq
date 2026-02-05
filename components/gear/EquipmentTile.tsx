"use client";

import { Equipment } from "@/types";

interface EquipmentTileProps {
  equipment: Equipment;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: string) => void;
}

// Calculate warranty remaining
function getWarrantyRemaining(purchaseDate: string, warrantyMonths: number): { text: string; shortText: string; isExpired: boolean } {
  const purchase = new Date(purchaseDate);
  const warrantyEnd = new Date(purchase);
  warrantyEnd.setMonth(warrantyEnd.getMonth() + warrantyMonths);

  const now = new Date();
  const diffMs = warrantyEnd.getTime() - now.getTime();
  const monthsLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));

  if (monthsLeft <= 0) {
    return { text: "Warranty expired", shortText: "Expired", isExpired: true };
  }
  return {
    text: `${monthsLeft} mo. left on warranty`,
    shortText: `${monthsLeft} mo. warranty`,
    isExpired: false
  };
}

// Format purchase date
function formatPurchaseDate(dateStr: string, short: boolean = false): string {
  const date = new Date(dateStr);
  if (short) {
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${month} '${year}`;
  }
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Mower icon
function MowerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="18" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M32 20L40 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 24L40 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M39 6L42 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="34" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="28" cy="34" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M10 30h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Spreader icon
function SpreaderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 8h20l-3 16H17L14 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M14 8h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 8V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 24v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 24v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="36" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="31" cy="36" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="24" cy="28" rx="5" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
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

// Shield icon
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

// Get icon based on equipment type
function getEquipmentIcon(type: string) {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("mower")) {
    return MowerIcon;
  }
  if (lowerType.includes("spreader")) {
    return SpreaderIcon;
  }
  // Default to mower icon
  return MowerIcon;
}

export default function EquipmentTile({
  equipment,
  onEdit,
  onDelete,
}: EquipmentTileProps) {
  const warranty = equipment.purchaseDate && equipment.warrantyMonths
    ? getWarrantyRemaining(equipment.purchaseDate, equipment.warrantyMonths)
    : null;

  const Icon = getEquipmentIcon(equipment.type);

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden relative group">
      {/* Delete button - shows on hover */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(equipment.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg text-[#a3a3a3] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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

      {/* Top section */}
      <div
        className={`p-4 flex items-start gap-3 sm:gap-4 ${onEdit ? "cursor-pointer" : ""}`}
        onClick={() => onEdit?.(equipment)}
      >
        {/* Equipment icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5F3F0] rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#8B9D82]" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#3D3D3D] text-base sm:text-lg">{equipment.model}</h4>
          <p className="text-[#A8A8A8] text-sm">{equipment.type}</p>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Manual button - always show, green if linked, grey if not */}
          {equipment.manualUrl ? (
            <a
              href={equipment.manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#8B9D8226] rounded-lg text-[#8B9D82] hover:bg-[#8B9D8240] transition-colors"
            >
              <DocumentIcon className="w-4 h-4" />
              <span className="font-medium text-sm">Manual</span>
            </a>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#F5F3F0] rounded-lg text-[#A8A8A8]">
              <DocumentIcon className="w-4 h-4" />
              <span className="font-medium text-sm">Manual</span>
            </div>
          )}
          {/* Warranty */}
          {warranty && (
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${warranty.isExpired ? "text-[#A8A8A8]" : "text-[#8B9D82]"}`}>
              <ShieldIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{warranty.text}</span>
              <span className="sm:hidden">{warranty.shortText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section - details row */}
      <div className="border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 flex items-center">
        {/* Serial / Model column - always show, use model as fallback */}
        <div className="flex-1 text-center">
          <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Serial / Model</p>
          <p className="font-semibold text-[#3D3D3D] text-sm sm:text-base truncate">
            {equipment.serialNumber || equipment.model}
          </p>
        </div>
        <div className="w-px h-8 bg-[#E5E5E5]" />
        {/* Brand column */}
        <div className="flex-1 text-center">
          <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Brand</p>
          <p className="font-semibold text-[#3D3D3D] text-sm sm:text-base">{equipment.brand}</p>
        </div>
        <div className="w-px h-8 bg-[#E5E5E5]" />
        {/* Purchased column */}
        <div className="flex-1 text-center">
          <p className="text-xs font-medium text-[#A8A8A8] uppercase tracking-wide">Purchased</p>
          <p className="font-semibold text-[#3D3D3D] text-sm sm:text-base">
            {equipment.purchaseDate ? (
              <>
                <span className="hidden sm:inline">{formatPurchaseDate(equipment.purchaseDate)}</span>
                <span className="sm:hidden">{formatPurchaseDate(equipment.purchaseDate, true)}</span>
              </>
            ) : (
              <span className="text-[#D4D4D4]">&mdash;</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
