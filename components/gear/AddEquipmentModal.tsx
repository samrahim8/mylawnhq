"use client";

import { useState, useRef, useEffect } from "react";
import { Equipment, EquipmentIdentificationResult, EQUIPMENT_TYPES, ChatImage } from "@/types";

type Step = "input" | "capture" | "processing" | "confirm";

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => void;
  prefillData?: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">> | null;
}

export default function AddEquipmentModal({
  isOpen,
  onClose,
  onSave,
  prefillData,
}: AddEquipmentModalProps) {
  const [step, setStep] = useState<Step>("input");
  const [identifier, setIdentifier] = useState("");
  const [result, setResult] = useState<EquipmentIdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Additional details (editable after lookup)
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState<number | "">("");

  // Photo capture refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle prefill data when modal opens
  useEffect(() => {
    if (isOpen && prefillData) {
      // If we have prefill data (from suggested equipment), set it as result
      if (prefillData.brand && prefillData.model) {
        setResult({
          brand: prefillData.brand,
          model: prefillData.model,
          type: prefillData.type || EQUIPMENT_TYPES[0],
          manualUrl: prefillData.manualUrl || null,
          confidence: "high",
          warrantyMonths: prefillData.warrantyMonths || 24,
        });
        setSerialNumber(prefillData.serialNumber || "");
        setPurchaseDate(prefillData.purchaseDate || "");
        setWarrantyMonths(prefillData.warrantyMonths ?? "");
        setStep("confirm");
      } else {
        // Just prefill what we have
        setIdentifier(prefillData.model || "");
      }
    }
  }, [isOpen, prefillData]);

  const resetModal = () => {
    setStep("input");
    setIdentifier("");
    setResult(null);
    setError(null);
    setIsLookingUp(false);
    setSerialNumber("");
    setPurchaseDate("");
    setWarrantyMonths("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Look up equipment by model/serial number
  const handleLookup = async () => {
    if (!identifier.trim()) {
      setError("Please enter a model or serial number");
      return;
    }

    setError(null);
    setIsLookingUp(true);

    try {
      const response = await fetch("/api/equipment/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        setResult(data.result);
        setWarrantyMonths(data.result.warrantyMonths || "");
        setStep("confirm");
      } else {
        setError(data.error || "Couldn't identify that equipment. Try a photo instead.");
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLookingUp(false);
    }
  };

  // Process photo for equipment identification
  const processImage = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, GIF, or WebP image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image must be under 5MB.");
      return;
    }

    setError(null);
    setStep("processing");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const chatImage: ChatImage = {
        id: `img-${Date.now()}`,
        data: base64,
        mimeType: file.type as ChatImage["mimeType"],
      };

      try {
        const response = await fetch("/api/equipment/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: chatImage,
            method: "sticker_photo",
          }),
        });

        const data = await response.json();

        if (data.success && data.result) {
          setResult(data.result);
          setWarrantyMonths(data.result.warrantyMonths || "");
          setStep("confirm");
        } else {
          setError(data.error || "Couldn't identify equipment. Please enter details manually.");
          setStep("input");
        }
      } catch {
        setError("Failed to connect. Please try again.");
        setStep("input");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
    e.target.value = "";
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

  const handleRetry = () => {
    setResult(null);
    setError(null);
    setStep("input");
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
            {step === "input" && (
              <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
                Enter the model or serial number
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
          {/* Step: Input */}
          {step === "input" && (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Model/Serial Input */}
              <div>
                <label className="block text-sm font-medium text-[#525252] mb-1.5">
                  Model or Serial Number
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  placeholder="e.g., HRX217VKA or MZCG-8677291"
                  className="w-full px-3 py-3 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent text-base"
                  autoFocus
                />
                <p className="text-xs text-[#a3a3a3] mt-1.5">
                  We&apos;ll find the brand, warranty info, and owner&apos;s manual
                </p>
              </div>

              {/* Lookup Button */}
              <button
                onClick={handleLookup}
                disabled={isLookingUp || !identifier.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#8B9D82] hover:bg-[#7a8b71] disabled:bg-[#a3a3a3] text-white rounded-lg font-medium transition-colors"
              >
                {isLookingUp ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Look Up Equipment
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5e5e5]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-[#a3a3a3]">or snap a photo</span>
                </div>
              </div>

              {/* Photo Options */}
              <div className="flex gap-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#e5e5e5] hover:bg-[#f8f6f3] rounded-lg text-[#525252] font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take Photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#e5e5e5] hover:bg-[#f8f6f3] rounded-lg text-[#525252] font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload
                </button>
              </div>

              <p className="text-xs text-[#a3a3a3] text-center">
                Take a photo of the model sticker for best results
              </p>

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
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="text-center py-12">
              <div className="animate-spin w-10 h-10 border-3 border-[#8B9D82] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[#525252] font-medium">Identifying your equipment...</p>
              <p className="text-sm text-[#737373] mt-1">This&apos;ll just take a sec</p>
            </div>
          )}

          {/* Step: Confirmation */}
          {step === "confirm" && result && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f0f4ed] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#8B9D82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-lg">Found it!</h3>
              </div>

              {/* Equipment Info Card */}
              <div className="bg-[#f8f6f3] rounded-lg p-4">
                <div className="font-semibold text-[#1a1a1a] text-lg">
                  {result.brand} {result.model}
                </div>
                <div className="text-sm text-[#737373] mt-1">{result.type}</div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#e5e5e5]">
                  {result.manualUrl && (
                    <a
                      href={result.manualUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#8B9D82] hover:text-[#6a7b5e]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Owner&apos;s Manual
                    </a>
                  )}
                  {result.warrantyMonths && (
                    <div className="inline-flex items-center gap-1 text-sm text-[#737373]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {result.warrantyMonths} mo. warranty
                    </div>
                  )}
                </div>
                {result.confidence !== "high" && (
                  <p className="text-xs text-[#a3a3a3] mt-2">
                    Confidence: {result.confidence}
                  </p>
                )}
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wide">
                  Add your details (optional)
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
                      value={warrantyMonths === "" ? "" : (warrantyMonths || result.warrantyMonths || "")}
                      onChange={(e) => setWarrantyMonths(e.target.value === "" ? "" : parseInt(e.target.value))}
                      placeholder={result.warrantyMonths?.toString() || ""}
                      className="w-full px-3 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#525252] text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
                >
                  Not Right — Try Again
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 bg-[#8B9D82] hover:bg-[#7a8b71] rounded-lg text-white text-sm font-medium transition-colors"
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
