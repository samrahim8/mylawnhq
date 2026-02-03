"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSpreaderSettings } from "@/hooks/useSpreaderSettings";
import { useProducts } from "@/hooks/useProducts";
import { useProfile } from "@/hooks/useProfile";
import { LawnProduct, ApplicationResult } from "@/types";

type ViewMode = "search" | "manual" | "result";

export default function SpreaderPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const {
    userSpreader,
    hasSpreader,
    lawnSqFt,
    calculateApplication,
    calculateForRate,
    searchCuratedProducts,
    getAllProducts,
  } = useSpreaderSettings();
  const { userProducts, addUserProduct } = useProducts();

  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<LawnProduct | null>(null);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [customSqFt, setCustomSqFt] = useState<string>("");
  const [selectedRate, setSelectedRate] = useState<"low" | "high">("low");

  // Manual entry state
  const [manualName, setManualName] = useState("");
  const [manualBrand, setManualBrand] = useState("");
  const [manualRate, setManualRate] = useState("");
  const [manualCategory, setManualCategory] = useState<LawnProduct["category"]>("fertilizer");
  const [manualBagSize, setManualBagSize] = useState("");
  const [manualNpk, setManualNpk] = useState("");

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const curated = searchCuratedProducts(searchQuery);
    const userMatches = userProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Combine and dedupe by name
    const all = [...curated, ...userMatches];
    const seen = new Set<string>();
    return all.filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
  }, [searchQuery, searchCuratedProducts, userProducts]);

  // All products for browsing
  const allProducts = useMemo(() => getAllProducts(), [getAllProducts]);

  // Calculate result when product is selected
  const handleSelectProduct = (product: LawnProduct) => {
    setSelectedProduct(product);
    const sqFt = customSqFt ? parseInt(customSqFt) : undefined;
    const calcResult = calculateApplication(product, sqFt);
    setResult(calcResult);
    setViewMode("result");
  };

  // Calculate for manual rate entry
  const handleManualCalculate = () => {
    const rate = parseFloat(manualRate);
    if (isNaN(rate) || rate <= 0) return;

    const sqFt = customSqFt ? parseInt(customSqFt) : undefined;

    // Create a product object for the result
    const manualProduct: LawnProduct = {
      id: `manual-${Date.now()}`,
      name: manualName || "Custom Product",
      brand: manualBrand || "Unknown",
      category: manualCategory,
      applicationRate: {
        lbsPer1000sqft: rate,
        bagSize: manualBagSize ? parseFloat(manualBagSize) : undefined,
      },
      npk: manualNpk || undefined,
      source: "user",
    };

    const calcResult = calculateApplication(manualProduct, sqFt);
    setSelectedProduct(manualProduct);
    setResult(calcResult);
    setViewMode("result");
  };

  // Save manual product to library
  const handleSaveProduct = () => {
    if (!selectedProduct || selectedProduct.source === "curated") return;

    addUserProduct({
      name: selectedProduct.name,
      brand: selectedProduct.brand,
      category: selectedProduct.category,
      applicationRate: selectedProduct.applicationRate,
      npk: selectedProduct.npk,
    });
  };

  // Reset to search
  const handleReset = () => {
    setViewMode("search");
    setSelectedProduct(null);
    setResult(null);
    setSearchQuery("");
    setManualName("");
    setManualBrand("");
    setManualRate("");
    setManualBagSize("");
    setManualNpk("");
    setSelectedRate("low");
  };

  // Calculate display values based on selected rate
  const getDisplayValues = () => {
    if (!result || !selectedProduct) return null;

    const sqFt = customSqFt ? parseInt(customSqFt) : lawnSqFt;
    const rate = selectedRate === "low" ? result.lbsPer1000sqftLow : result.lbsPer1000sqftHigh;
    const totalLbsNeeded = Math.round((rate * sqFt) / 1000 * 10) / 10;

    let bagsNeeded: number | undefined;
    if (selectedProduct.applicationRate.bagSize) {
      bagsNeeded = Math.ceil(totalLbsNeeded / selectedProduct.applicationRate.bagSize);
    }

    return {
      rate,
      totalLbsNeeded,
      bagsNeeded,
    };
  };

  const displayValues = getDisplayValues();

  // No spreader selected - prompt to set one
  if (!hasSpreader) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            No Spreader Selected
          </h1>
          <p className="text-neutral-600 mb-6">
            Please select your spreader type in your profile to use the spreader
            settings calculator.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors"
          >
            Go to Profile Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Spreader Settings Calculator
            </h1>
            <p className="text-neutral-600 mt-1">
              Using: <span className="font-medium">{userSpreader?.spreaderName}</span>
            </p>
          </div>
          <Link
            href="/profile"
            className="text-sm text-neutral-500 hover:text-neutral-700 underline"
          >
            Change spreader
          </Link>
        </div>
      </div>

      {/* Lawn Size Override */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">
              Lawn size:{" "}
              <span className="font-medium text-neutral-900">
                {customSqFt || lawnSqFt.toLocaleString()} sq ft
              </span>
              {!customSqFt && (
                <span className="text-neutral-400 ml-1">(from profile)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customSqFt}
              onChange={(e) => setCustomSqFt(e.target.value)}
              placeholder="Custom sq ft"
              className="w-32 px-3 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400"
            />
            {customSqFt && (
              <button
                onClick={() => setCustomSqFt("")}
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "result" && result ? (
        /* Result View */
        <div className="space-y-6">
          {/* Main Result Card */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-500 uppercase tracking-wide mb-4">
                {userSpreader?.spreaderName} Settings
              </p>

              {/* Low/High Rate Display */}
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                {/* Low Rate */}
                <button
                  onClick={() => setSelectedRate("low")}
                  className={`bg-[#f0f4ed] rounded-xl p-6 transition-all ${
                    selectedRate === "low"
                      ? "border-2 border-[#7a8b6e] ring-2 ring-[#7a8b6e]/20 shadow-lg"
                      : "border border-[#7a8b6e]/30 hover:border-[#7a8b6e]/50"
                  }`}
                >
                  <p className="text-sm font-medium text-[#7a8b6e] uppercase tracking-wide mb-2">
                    Low Rate
                  </p>
                  <div className="text-5xl font-bold text-[#5a6950] mb-2">
                    {result.spreaderSettingLow}
                  </div>
                  <p className="text-sm text-[#7a8b6e]">
                    {result.lbsPer1000sqftLow} lbs/1000 sq ft
                  </p>
                  {selectedRate === "low" && (
                    <p className="text-xs text-[#5a6950] font-medium mt-2">✓ Selected</p>
                  )}
                </button>

                {/* High Rate */}
                <button
                  onClick={() => setSelectedRate("high")}
                  className={`bg-[#fdf6f3] rounded-xl p-6 transition-all ${
                    selectedRate === "high"
                      ? "border-2 border-[#c17f59] ring-2 ring-[#c17f59]/20 shadow-lg"
                      : "border border-[#c17f59]/30 hover:border-[#c17f59]/50"
                  }`}
                >
                  <p className="text-sm font-medium text-[#c17f59] uppercase tracking-wide mb-2">
                    High Rate
                  </p>
                  <div className="text-5xl font-bold text-[#a3674a] mb-2">
                    {result.spreaderSettingHigh}
                  </div>
                  <p className="text-sm text-[#c17f59]">
                    {result.lbsPer1000sqftHigh} lbs/1000 sq ft
                  </p>
                  {selectedRate === "high" && (
                    <p className="text-xs text-[#a3674a] font-medium mt-2">✓ Selected</p>
                  )}
                </button>
              </div>

              {/* Guidance */}
              <p className="text-xs text-neutral-500 mt-4 max-w-sm mx-auto">
                Use <span className="text-[#7a8b6e] font-medium">Low</span> for light feeding or sensitive turf.
                Use <span className="text-[#c17f59] font-medium">High</span> for heavy feeding or established lawns.
              </p>

              {result.confidence !== "exact" && (
                <p className="text-sm text-neutral-500 mt-3">
                  {result.confidence === "interpolated"
                    ? "Settings interpolated from spreader chart"
                    : "Settings estimated"}
                </p>
              )}
            </div>

            {/* Product Info */}
            <div className="border-t border-neutral-200 pt-6 text-center">
              <h3 className="font-medium text-neutral-900 mb-4">
                {selectedProduct?.name}
              </h3>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <p className="text-neutral-500">
                    {selectedRate === "low" ? "Low" : "High"} Rate
                  </p>
                  <p className={`font-medium ${
                    selectedRate === "low" ? "text-[#5a6950]" : "text-[#a3674a]"
                  }`}>
                    {displayValues?.rate} lbs/1000 sq ft
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">Total Needed</p>
                  <p className={`font-medium ${
                    selectedRate === "low" ? "text-[#5a6950]" : "text-[#a3674a]"
                  }`}>
                    {displayValues?.totalLbsNeeded} lbs
                  </p>
                </div>
                {displayValues?.bagsNeeded && (
                  <div>
                    <p className="text-neutral-500">Bags to Buy</p>
                    <p className={`font-medium ${
                      selectedRate === "low" ? "text-[#5a6950]" : "text-[#a3674a]"
                    }`}>
                      {displayValues.bagsNeeded} bag{displayValues.bagsNeeded > 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                {selectedProduct?.npk && (
                  <div>
                    <p className="text-neutral-500">NPK</p>
                    <p className="font-medium text-neutral-900">
                      {selectedProduct.npk}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-6">
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Another
            </button>
            {selectedProduct?.source === "user" && (
              <button
                onClick={handleSaveProduct}
                className="px-8 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg transition-colors"
              >
                Save to My Products
              </button>
            )}
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white font-medium rounded-lg transition-colors text-center"
            >
              Log Activity
            </Link>
          </div>
        </div>
      ) : (
        /* Search/Manual Entry View */
        <div className="space-y-6">
          {/* Tab Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("search")}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                viewMode === "search"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Search Products
            </button>
            <button
              onClick={() => setViewMode("manual")}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                viewMode === "manual"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Manual Entry
            </button>
          </div>

          {viewMode === "search" ? (
            /* Search View */
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products (e.g., Milorganite, Scotts Turf Builder...)"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                  autoFocus
                />
              </div>

              {/* Search Results */}
              {searchQuery && searchResults.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="w-full p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-left transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-neutral-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {product.brand}
                            {product.npk && ` - ${product.npk}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-700">
                            {product.applicationRate.lbsPer1000sqft} lbs/1000 sq ft
                          </p>
                          {product.source === "user" && (
                            <span className="text-xs text-neutral-400">
                              My Product
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <p className="text-center text-neutral-500 py-8">
                  No products found. Try{" "}
                  <button
                    onClick={() => setViewMode("manual")}
                    className="text-neutral-900 underline"
                  >
                    manual entry
                  </button>
                  .
                </p>
              ) : (
                /* Browse Popular Products */
                <div>
                  <p className="text-sm text-neutral-500 mb-3">
                    Popular products:
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {allProducts.slice(0, 15).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="w-full p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-left transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-neutral-900 text-sm">
                              {product.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {product.brand}
                            </p>
                          </div>
                          <p className="text-xs text-neutral-500">
                            {product.applicationRate.lbsPer1000sqft} lbs/1000 sq ft
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Manual Entry View */
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
              <p className="text-sm text-neutral-600 mb-4">
                Enter the application rate from your product label.
              </p>

              <div className="space-y-4">
                {/* Rate (Required) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Application Rate (lbs per 1,000 sq ft) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualRate}
                    onChange={(e) => setManualRate(e.target.value)}
                    placeholder="e.g., 3.5"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Find this on your product bag under &quot;Application Rate&quot; or &quot;Coverage&quot;
                  </p>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={manualBrand}
                      onChange={(e) => setManualBrand(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Bag Size (lbs)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={manualBagSize}
                      onChange={(e) => setManualBagSize(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      NPK Ratio
                    </label>
                    <input
                      type="text"
                      value={manualNpk}
                      onChange={(e) => setManualNpk(e.target.value)}
                      placeholder="e.g., 32-0-4"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) =>
                      setManualCategory(e.target.value as LawnProduct["category"])
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 outline-none focus:border-neutral-900"
                  >
                    <option value="fertilizer">Fertilizer</option>
                    <option value="seed">Grass Seed</option>
                    <option value="weedControl">Weed Control</option>
                    <option value="pestControl">Pest Control</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  onClick={handleManualCalculate}
                  disabled={!manualRate || parseFloat(manualRate) <= 0}
                  className="w-full px-6 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-medium rounded-lg transition-colors"
                >
                  Calculate Setting
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
