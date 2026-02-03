"use client";

import { useState, useRef, useCallback } from "react";
import { LawnPhoto } from "@/types";

interface YardArea {
  id: string;
  label: string;
  description: string;
}

const YARD_AREAS: YardArea[] = [
  { id: "front", label: "Front Yard", description: "Take a photo of your front lawn" },
  { id: "back", label: "Back Yard", description: "Take a photo of your back lawn" },
  { id: "left-side", label: "Left Side", description: "Take a photo of the left side" },
  { id: "right-side", label: "Right Side", description: "Take a photo of the right side" },
];

interface YardPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (photo: Omit<LawnPhoto, "id">) => Promise<LawnPhoto>;
  existingPhotos: LawnPhoto[];
}

export default function YardPhotoModal({
  isOpen,
  onClose,
  onAddPhoto,
  existingPhotos,
}: YardPhotoModalProps) {
  const [capturedPhotos, setCapturedPhotos] = useState<Record<string, string>>({});
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Check which areas already have photos
  const getExistingPhotoForArea = (areaId: string) => {
    return existingPhotos.find((p) => p.area === areaId);
  };

  const handleFileChange = useCallback(
    async (areaId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsCapturing(true);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const url = event.target?.result as string;
        setCapturedPhotos((prev) => ({ ...prev, [areaId]: url }));
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);

      // Reset the input
      if (fileInputRefs.current[areaId]) {
        fileInputRefs.current[areaId]!.value = "";
      }
    },
    []
  );

  const handleSavePhotos = useCallback(async () => {
    // Save all newly captured photos
    for (const [areaId, url] of Object.entries(capturedPhotos)) {
      await onAddPhoto({
        url,
        date: new Date().toISOString(),
        area: areaId,
      });
    }
    setCapturedPhotos({});
    onClose();
  }, [capturedPhotos, onAddPhoto, onClose]);

  const handleSkip = () => {
    setCapturedPhotos({});
    onClose();
  };

  const handleRemovePhoto = (areaId: string) => {
    setCapturedPhotos((prev) => {
      const updated = { ...prev };
      delete updated[areaId];
      return updated;
    });
  };

  const completedCount =
    YARD_AREAS.filter(
      (area) => capturedPhotos[area.id] || getExistingPhotoForArea(area.id)
    ).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e5e5e5]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Add Yard Photos</h2>
              <p className="text-sm text-[#525252] mt-0.5">
                {completedCount}/4 photos added
              </p>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="p-2 hover:bg-[#f8f6f3] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3">
            {YARD_AREAS.map((area) => {
              const existingPhoto = getExistingPhotoForArea(area.id);
              const capturedUrl = capturedPhotos[area.id];
              const hasPhoto = existingPhoto || capturedUrl;

              return (
                <div key={area.id} className="relative">
                  <input
                    ref={(el) => {
                      fileInputRefs.current[area.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileChange(area.id, e)}
                    className="hidden"
                  />

                  {hasPhoto ? (
                    // Photo captured/exists
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#7a8b6e]">
                      <img
                        src={capturedUrl || existingPhoto?.thumbnail || existingPhoto?.url}
                        alt={area.label}
                        className="w-full h-full object-cover"
                      />
                      {/* Checkmark badge */}
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#7a8b6e] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {/* Label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs font-medium text-white">{area.label}</p>
                      </div>
                      {/* Retake button (only for newly captured) */}
                      {capturedUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(area.id)}
                          className="absolute top-2 left-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    // Empty slot
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[area.id]?.click()}
                      disabled={isCapturing}
                      className="w-full aspect-square rounded-xl border-2 border-dashed border-[#d4d4d4] bg-[#f8f6f3] hover:border-[#7a8b6e] hover:bg-[#f0ece5] transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#7a8b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-[#525252]">{area.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#a3a3a3] text-center mt-4">
            Tap each area to take a photo of that part of your yard
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#e5e5e5] flex gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-[#525252] hover:text-[#1a1a1a] hover:bg-[#f8f6f3] rounded-lg transition-colors"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleSavePhotos}
            disabled={Object.keys(capturedPhotos).length === 0}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Photos
          </button>
        </div>
      </div>
    </div>
  );
}
