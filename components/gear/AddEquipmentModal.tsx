"use client";

import { useState, useRef } from "react";
import { Equipment, EquipmentIdentificationResult, EQUIPMENT_TYPES, ChatImage } from "@/types";

type Step = "method" | "capture" | "manual" | "processing" | "confirm";
type Method = "equipment_photo" | "sticker_photo" | "manual";

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => void;
}

export default function AddEquipmentModal({
  isOpen,
  onClose,
  onSave,
}: AddEquipmentModalProps) {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<Method | null>(null);
  const [image, setImage] = useState<ChatImage | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<EquipmentIdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Manual entry form state
  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualType, setManualType] = useState<string>(EQUIPMENT_TYPES[0]);
  const [manualUrl, setManualUrl] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState<number | "">(24);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resetModal = () => {
    setStep("method");
    setMethod(null);
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setManualBrand("");
    setManualModel("");
    setManualType(EQUIPMENT_TYPES[0] as string);
    setManualUrl("");
    setSerialNumber("");
    setPurchaseDate("");
    setWarrantyMonths(24);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const selectMethod = (m: Method) => {
    setMethod(m);
    if (m === "manual") {
      setStep("manual");
    } else {
      setStep("capture");
    }
  };

  const processImage = async (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, GIF, or WebP image.");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image must be under 5MB.");
      return;
    }

    setError(null);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const chatImage: ChatImage = {
        id: `img-${Date.now()}`,
        data: base64,
        mimeType: file.type as ChatImage["mimeType"],
      };
      setImage(chatImage);
      setStep("processing");

      // Call API to identify equipment
      try {
        const response = await fetch("/api/equipment/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: chatImage,
            method: method,
          }),
        });

        const data = await response.json();

        if (data.success && data.result) {
          setResult(data.result);
          setStep("confirm");
        } else {
          setError(data.error || "Failed to identify equipment. Please try again.");
          setStep("capture");
        }
      } catch {
        setError("Failed to connect to server. Please try again.");
        setStep("capture");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleConfirm = () => {
    if (result) {
      onSave({
        brand: result.brand,
        model: result.model,
        type: result.type,
        manualUrl: result.manualUrl,
        serialNumber: serialNumber.trim() || undefined,
        purchaseDate: purchaseDate || undefined,
        warrantyMonths: typeof warrantyMonths === "number" ? warrantyMonths : (result.warrantyMonths || undefined),
      });
      handleClose();
    }
  };

  const handleManualSave = () => {
    if (!manualBrand.trim() || !manualModel.trim()) {
      setError("Brand and model are required.");
      return;
    }

    onSave({
      brand: manualBrand.trim(),
      model: manualModel.trim(),
      type: manualType,
      manualUrl: manualUrl.trim() || null,
      serialNumber: serialNumber.trim() || undefined,
      purchaseDate: purchaseDate || undefined,
      warrantyMonths: typeof warrantyMonths === "number" ? warrantyMonths : undefined,
    });
    handleClose();
  };

  const handleRetry = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setStep("capture");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden mx-2">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:p-6 border-b border-[#e5e5e5] flex-shrink-0">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-[#1a1a1a]">
              Add Your Gear
            </h2>
            {step === "method" && (
              <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
                Snap a photo and we&apos;ll figure out what you&apos;ve got.
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Step: Method Selection */}
          {step === "method" && (
            <div className="space-y-3">
              <button
                onClick={() => selectMethod("equipment_photo")}
                className="w-full p-4 bg-white border border-[#e5e5e5] rounded-lg hover:border-[#7a8b6e] hover:bg-[#f8f6f3] transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#f0f4ed] group-hover:bg-[#e8ebe5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a1a1a]">Snap the whole thing</h3>
                    <p className="text-sm text-[#737373] mt-0.5">
                      Get the whole piece of equipment in frame — bonus points if the brand logo is visible!
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => selectMethod("sticker_photo")}
                className="w-full p-4 bg-white border border-[#e5e5e5] rounded-lg hover:border-[#7a8b6e] hover:bg-[#f8f6f3] transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#f0f4ed] group-hover:bg-[#e8ebe5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6M9 17h3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a1a1a]">Snap the model sticker</h3>
                    <p className="text-sm text-[#737373] mt-0.5">
                      Usually on the deck or near the engine. Look for something like &quot;HRX217VKA&quot;.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => selectMethod("manual")}
                className="w-full p-4 bg-white border border-[#e5e5e5] rounded-lg hover:border-[#7a8b6e] hover:bg-[#f8f6f3] transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#f0f4ed] group-hover:bg-[#e8ebe5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a1a1a]">I&apos;ll type it myself</h3>
                    <p className="text-sm text-[#737373] mt-0.5">
                      Old school works too — enter the details manually.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Step: Image Capture */}
          {step === "capture" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("method")}
                className="inline-flex items-center gap-1 text-sm text-[#7a8b6e] hover:text-[#5a6950]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#f0f4ed] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-[#1a1a1a] mb-1">
                  {method === "sticker_photo" ? "Snap the model sticker" : "Snap your equipment"}
                </h3>
                <p className="text-sm text-[#737373] mb-6">
                  {method === "sticker_photo"
                    ? "Get a clear shot of the model number sticker."
                    : "Try to capture the whole thing with the brand visible."}
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    Take Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#e5e5e5] hover:bg-[#f8f6f3] text-[#525252] rounded-lg font-medium text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="text-center py-12">
              {imagePreview && (
                <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden border border-[#e5e5e5]">
                  <img src={imagePreview} alt="Equipment" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="animate-spin w-8 h-8 border-3 border-[#7a8b6e] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[#525252] font-medium">Identifying your equipment...</p>
              <p className="text-sm text-[#737373] mt-1">This&apos;ll just take a sec</p>
            </div>
          )}

          {/* Step: Confirmation */}
          {step === "confirm" && result && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f0f4ed] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-lg">Got it!</h3>
                <p className="text-sm text-[#737373]">Is this what you&apos;ve got?</p>
              </div>

              {imagePreview && (
                <div className="w-full h-40 rounded-lg overflow-hidden border border-[#e5e5e5]">
                  <img src={imagePreview} alt="Equipment" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-[#f8f6f3] rounded-lg p-4">
                <div className="font-semibold text-[#1a1a1a] text-lg">
                  {result.brand} {result.model}
                </div>
                <div className="text-sm text-[#737373] mt-1">{result.type}</div>
                {result.manualUrl && (
                  <a
                    href={result.manualUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#7a8b6e] hover:text-[#5a6950] mt-2"
                  >
                    Owner&apos;s Manual
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {result.confidence !== "high" && (
                  <p className="text-xs text-[#a3a3a3] mt-2">
                    Confidence: {result.confidence}
                  </p>
                )}
              </div>

              {/* Additional Details for AI-identified equipment */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wide">
                  Add your details
                </p>
                <div>
                  <label className="block text-sm font-medium text-[#525252] mb-1.5">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g., MZCG-8677291"
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-1.5">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#525252] mb-1.5">
                      Warranty (months)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={warrantyMonths === "" ? "" : (warrantyMonths || result.warrantyMonths || 24)}
                      onChange={(e) => setWarrantyMonths(e.target.value === "" ? "" : parseInt(e.target.value))}
                      placeholder="24"
                      className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                    />
                    {result.warrantyMonths && warrantyMonths === 24 && (
                      <p className="text-xs text-[#7a8b6e] mt-1">
                        Typical for {result.brand}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#525252] text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
                >
                  Not Quite — Try Again
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Yep, That&apos;s It!
                </button>
              </div>
            </div>
          )}

          {/* Step: Manual Entry */}
          {step === "manual" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("method")}
                className="inline-flex items-center gap-1 text-sm text-[#7a8b6e] hover:text-[#5a6950]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1.5">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={manualBrand}
                  onChange={(e) => setManualBrand(e.target.value)}
                  placeholder="e.g., Honda, Toro, John Deere"
                  className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1.5">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={manualModel}
                  onChange={(e) => setManualModel(e.target.value)}
                  placeholder="e.g., HRX217VKA"
                  className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1.5">
                  Equipment Type
                </label>
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                >
                  {EQUIPMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1.5">
                  Owner&apos;s Manual URL (optional)
                </label>
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                />
              </div>

              {/* Divider */}
              <div className="border-t border-[#e5e5e5] pt-4 mt-4">
                <p className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wide mb-3">
                  Additional Details (optional)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1.5">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g., MZCG-8677291"
                  className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#525252] mb-1.5">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#525252] mb-1.5">
                    Warranty (months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(e.target.value === "" ? "" : parseInt(e.target.value))}
                    placeholder="24"
                    className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#525252] text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="flex-1 px-4 py-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add Gear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
