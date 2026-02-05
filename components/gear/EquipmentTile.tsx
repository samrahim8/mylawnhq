"use client";

import { Equipment } from "@/types";

interface EquipmentTileProps {
  equipment: Equipment;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: string) => void;
}

// Calculate warranty remaining
function getWarrantyRemaining(purchaseDate: string, warrantyMonths: number): { text: string; isExpired: boolean } {
  const purchase = new Date(purchaseDate);
  const warrantyEnd = new Date(purchase);
  warrantyEnd.setMonth(warrantyEnd.getMonth() + warrantyMonths);

  const now = new Date();
  const diffMs = warrantyEnd.getTime() - now.getTime();
  const monthsLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));

  if (monthsLeft <= 0) {
    return { text: "Warranty expired", isExpired: true };
  }
  return { text: `${monthsLeft} mo. left on warranty`, isExpired: false };
}

// Format purchase date
function formatPurchaseDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function EquipmentTile({
  equipment,
  onEdit,
  onDelete,
}: EquipmentTileProps) {
  const hasExtraDetails = equipment.serialNumber || equipment.purchaseDate || equipment.warrantyMonths;
  const warranty = equipment.purchaseDate && equipment.warrantyMonths
    ? getWarrantyRemaining(equipment.purchaseDate, equipment.warrantyMonths)
    : null;

  return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden relative group">
      {/* Delete button - shows on hover */}
      {onDelete && (
        <button
          onClick={() => onDelete(equipment.id)}
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

      {/* Main content area */}
      <div
        className={`p-4 ${onEdit ? "cursor-pointer" : ""}`}
        onClick={() => onEdit?.(equipment)}
      >
        <div className="flex items-start gap-3">
          {/* Equipment info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#1a1a1a] text-base leading-tight">
              {equipment.model}
            </h3>
            <p className="text-sm text-[#737373] mt-0.5">{equipment.type}</p>
          </div>

          {/* Manual link */}
          <div className="flex-shrink-0">
            {equipment.manualUrl ? (
              <a
                href={equipment.manualUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F5F3F0] rounded-lg text-[#8B9D82] text-sm font-medium hover:bg-[#e8e6e1] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Manual
              </a>
            ) : null}
          </div>
        </div>

        {/* Warranty indicator */}
        {warranty && (
          <div className={`flex items-center gap-1.5 mt-2 text-sm ${warranty.isExpired ? "text-[#a3a3a3]" : "text-[#737373]"}`}>
            <span>📋</span>
            <span>{warranty.text}</span>
          </div>
        )}
      </div>

      {/* Details row */}
      {hasExtraDetails && (
        <div className="border-t border-[#e5e5e5] bg-[#FAFAFA] px-4 py-2.5 flex items-center text-center divide-x divide-[#e5e5e5]">
          {equipment.serialNumber && (
            <div className="flex-1 px-2 first:pl-0 last:pr-0">
              <p className="text-[10px] font-medium text-[#A8A8A8] uppercase tracking-wide">Serial</p>
              <p className="text-xs font-semibold text-[#3D3D3D] truncate">{equipment.serialNumber}</p>
            </div>
          )}
          <div className="flex-1 px-2 first:pl-0 last:pr-0">
            <p className="text-[10px] font-medium text-[#A8A8A8] uppercase tracking-wide">Brand</p>
            <p className="text-xs font-semibold text-[#3D3D3D]">{equipment.brand}</p>
          </div>
          {equipment.purchaseDate && (
            <div className="flex-1 px-2 first:pl-0 last:pr-0">
              <p className="text-[10px] font-medium text-[#A8A8A8] uppercase tracking-wide">Purchased</p>
              <p className="text-xs font-semibold text-[#3D3D3D]">{formatPurchaseDate(equipment.purchaseDate)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
