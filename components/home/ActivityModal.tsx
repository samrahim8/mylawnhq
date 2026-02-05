"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarActivity } from "@/types";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<CalendarActivity, "id">) => void;
  onUpdate?: (activity: CalendarActivity) => void;
  editingActivity?: CalendarActivity | null;
  savedProducts: string[];
  onAddProduct: (product: string) => void;
}

const ACTIVITY_TYPES = [
  { value: "mow", label: "Mow", icon: "✂️" },
  { value: "water", label: "Water", icon: "💧" },
  { value: "fertilize", label: "Fertilize", icon: "🌱" },
  { value: "seed", label: "Seed", icon: "🌾" },
  { value: "weedControl", label: "Weed Control", icon: "🌼" },
  { value: "pest", label: "Pest Control", icon: "🐛" },
  { value: "aerate", label: "Aerate", icon: "🔄" },
  { value: "other", label: "Other", icon: "📝" },
] as const;

// Get local date string in YYYY-MM-DD format
const getLocalDateString = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ActivityModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingActivity,
  savedProducts,
  onAddProduct,
}: ActivityModalProps) {
  const isEditing = !!editingActivity;
  const [date, setDate] = useState(() => getLocalDateString());
  const [activityType, setActivityType] = useState<CalendarActivity["type"]>("mow");
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["all"]);
  const [product, setProduct] = useState("");
  const [waterAmount, setWaterAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const productInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Common lawn care products for autocomplete
  const COMMON_PRODUCTS = [
    // Fertilizers
    "Scotts Turf Builder",
    "Scotts Turf Builder Winterguard",
    "Scotts Turf Builder Summerguard",
    "Scotts Turf Builder Starter",
    "Scotts Green Max",
    "Milorganite",
    "Pennington UltraGreen",
    "Pennington Lawn Fertilizer",
    "Jonathan Green Green-Up",
    "Jonathan Green Winter Survival",
    "Lesco Professional Fertilizer",
    "Simple Lawn Solutions",
    "The Andersons PGF Complete",
    "The Andersons Humic DG",
    "Sunday Lawn Fertilizer",
    "Ironite",
    "Espoma Organic Lawn Food",
    // Weed Control
    "Scotts Weed & Feed",
    "Scotts Halts Crabgrass Preventer",
    "Spectracide Weed Stop",
    "Ortho Weed B Gon",
    "BioAdvanced Weed Killer",
    "Tenacity Herbicide",
    "Prodiamine 65 WDG",
    "Dimension 2EW",
    "Barricade",
    "Celsius WG Herbicide",
    "Certainty Herbicide",
    "Speed Zone",
    "Trimec Classic",
    "2,4-D Amine",
    "Roundup For Lawns",
    // Pest Control
    "BioAdvanced Grub Killer",
    "Scotts GrubEx",
    "Spectracide Triazicide",
    "Sevin Insect Killer",
    "Merit Insecticide",
    "Acelepryn",
    "Talstar P",
    "Bifenthrin",
    "Imidacloprid",
    // Seeds
    "Scotts Turf Builder Grass Seed",
    "Pennington Smart Seed",
    "Jonathan Green Black Beauty",
    "Kentucky 31 Tall Fescue",
    "Perennial Ryegrass",
    "Kentucky Bluegrass",
    "Bermuda Grass Seed",
    "Zoysia Grass Seed",
    "St. Augustine Plugs",
    // Other
    "Lime",
    "Pelletized Lime",
    "Sulfur",
    "Gypsum",
    "Humic Acid",
    "Kelp Extract",
    "Liquid Aeration",
  ];

  // Combine saved products with common products (removing duplicates)
  const allProducts = Array.from(new Set([...savedProducts, ...COMMON_PRODUCTS]));

  // Filter products based on input
  const filteredProducts = product.trim()
    ? allProducts.filter((p) =>
        p.toLowerCase().includes(product.toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        productInputRef.current &&
        !productInputRef.current.contains(event.target as Node)
      ) {
        setShowProductDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset form when modal opens or populate with editing activity
  useEffect(() => {
    if (isOpen) {
      if (editingActivity) {
        // Populate form with existing activity data
        setDate(editingActivity.date);
        setActivityType(editingActivity.type);
        // Parse area string back to array (handles "Front, Back" format)
        if (editingActivity.area) {
          const areas = editingActivity.area.split(", ").map(a => a.toLowerCase());
          setSelectedAreas(areas.length > 0 ? areas : ["all"]);
        } else {
          setSelectedAreas(["all"]);
        }
        setProduct(editingActivity.product || "");
        setWaterAmount(editingActivity.amount || "");
        setNotes(editingActivity.notes || "");
      } else {
        // Reset to defaults for new activity
        setDate(getLocalDateString());
        setActivityType("mow");
        setSelectedAreas(["all"]);
        setProduct("");
        setWaterAmount("");
        setNotes("");
      }
    }
  }, [isOpen, editingActivity]);

  const AREA_OPTIONS = [
    { value: "front", label: "Front" },
    { value: "back", label: "Back" },
    { value: "side", label: "Side" },
    { value: "all", label: "All" },
  ];

  // Toggle area selection - "All" is exclusive, other areas can be multi-selected
  const toggleArea = (value: string) => {
    if (value === "all") {
      // Selecting "All" clears other selections
      setSelectedAreas(["all"]);
    } else {
      setSelectedAreas(prev => {
        // Remove "all" if it was selected
        const withoutAll = prev.filter(a => a !== "all");

        if (withoutAll.includes(value)) {
          // Deselect this area
          const newAreas = withoutAll.filter(a => a !== value);
          // If nothing left, default to "all"
          return newAreas.length > 0 ? newAreas : ["all"];
        } else {
          // Add this area
          return [...withoutAll, value];
        }
      });
    }
  };

  // Format selected areas for display/storage (e.g., "Front, Back")
  const formatAreas = (areas: string[]): string => {
    if (areas.includes("all")) return "All";
    const labelMap: Record<string, string> = {
      front: "Front",
      back: "Back",
      side: "Side",
    };
    return areas.map(a => labelMap[a] || a).join(", ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save product for future use if provided
    if (product.trim()) {
      onAddProduct(product.trim());
    }

    const activityData = {
      type: activityType,
      date,
      area: formatAreas(selectedAreas) || undefined,
      product: activityType !== "water" ? (product.trim() || undefined) : undefined,
      amount: activityType === "water" ? (waterAmount.trim() || undefined) : undefined,
      notes: notes.trim() || undefined,
    };

    if (isEditing && editingActivity && onUpdate) {
      // Update existing activity
      onUpdate({
        ...activityData,
        id: editingActivity.id,
      });
    } else {
      // Create new activity
      onSave(activityData);
    }

    onClose();
  };

  const selectProduct = (p: string) => {
    setProduct(p);
    setShowProductDropdown(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden mx-2">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:p-6 border-b border-[#e5e5e5] flex-shrink-0">
          <h2 className="text-base sm:text-xl font-semibold text-[#1a1a1a]">
            {isEditing ? "Edit Activity" : "Log Activity"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f5f5f5] rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#525252]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-2 sm:space-y-5 overflow-x-hidden overflow-y-auto flex-1">
          {/* Date Picker */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#525252] mb-1 sm:mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 border border-[#e5e5e5] rounded-lg text-base sm:text-sm text-[#1a1a1a] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#525252] mb-1 sm:mb-2">
              Activity Type
            </label>
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActivityType(type.value)}
                  className={`flex flex-col items-center justify-center gap-0.5 p-1 sm:p-3 rounded-lg border transition-colors min-w-0 ${
                    activityType === type.value
                      ? "border-[#7a8b6e] bg-[#f0f4ed] text-[#7a8b6e]"
                      : "border-[#e5e5e5] hover:border-[#a3a3a3] text-[#525252]"
                  }`}
                >
                  <span className="text-sm sm:text-xl">{type.icon}</span>
                  <span className="text-[9px] sm:text-xs font-medium leading-tight text-center w-full">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Area of Lawn */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#525252] mb-1 sm:mb-2">
              Area of Lawn
            </label>
            <div className="flex gap-1 sm:gap-2">
              {AREA_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleArea(option.value)}
                  className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors min-w-0 ${
                    selectedAreas.includes(option.value)
                      ? "border-[#7a8b6e] bg-[#f0f4ed] text-[#7a8b6e]"
                      : "border-[#e5e5e5] hover:border-[#a3a3a3] text-[#525252]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Used / Water Amount - Dynamic based on activity type */}
          {activityType === "water" ? (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#525252] mb-1 sm:mb-2">
                Water Amount (optional)
              </label>
              <input
                type="text"
                value={waterAmount}
                onChange={(e) => setWaterAmount(e.target.value)}
                placeholder="e.g., 30 minutes, 1 inch"
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 border border-[#e5e5e5] rounded-lg text-base sm:text-sm text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
              />
            </div>
          ) : (
            <div className="relative">
              <label className="block text-xs sm:text-sm font-medium text-[#525252] mb-1 sm:mb-2">
                Product Used (optional)
              </label>
              <input
                ref={productInputRef}
                type="text"
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value);
                  setShowProductDropdown(true);
                }}
                onFocus={() => setShowProductDropdown(true)}
                placeholder="e.g., Scotts Turf Builder"
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 border border-[#e5e5e5] rounded-lg text-base sm:text-sm text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
              />
              {/* Product Dropdown */}
              {showProductDropdown && filteredProducts.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg max-h-32 overflow-auto"
                >
                  {filteredProducts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => selectProduct(p)}
                      className="w-full px-3 sm:px-4 py-2 text-left text-sm text-[#525252] hover:bg-[#f5f5f5] transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#525252] mb-1 sm:mb-2">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 border border-[#e5e5e5] rounded-lg text-base sm:text-sm text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-[#e5e5e5] rounded-lg text-[#525252] text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white text-sm font-medium transition-colors"
            >
              {isEditing ? "Save Changes" : "Log Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
