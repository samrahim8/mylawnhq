"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { LawnPhoto } from "@/types";

interface PhotoCarouselProps {
  photos: LawnPhoto[];
  onAddPhoto: (photo: Omit<LawnPhoto, "id">) => Promise<LawnPhoto>;
  onUpdatePhoto: (id: string, updates: Partial<LawnPhoto>) => void;
  onDeletePhoto: (id: string) => void;
}

export default function PhotoCarousel({
  photos,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto,
}: PhotoCarouselProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<LawnPhoto | null>(null);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  }, []);

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [checkScrollability, photos]);

  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const url = event.target?.result as string;
        await onAddPhoto({
          url,
          date: new Date().toISOString(),
        });
        setIsUploading(false);
        setTimeout(checkScrollability, 100);
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onAddPhoto, checkScrollability]
  );

  const handlePhotoClick = useCallback((photo: LawnPhoto) => {
    setSelectedPhoto(photo);
    setEditingNote(false);
  }, []);

  const handleEditNote = useCallback(() => {
    setNoteText(selectedPhoto?.note || "");
    setEditingNote(true);
  }, [selectedPhoto]);

  const handleSaveNote = useCallback(() => {
    if (selectedPhoto) {
      onUpdatePhoto(selectedPhoto.id, { note: noteText });
      setSelectedPhoto({ ...selectedPhoto, note: noteText });
    }
    setEditingNote(false);
  }, [selectedPhoto, noteText, onUpdatePhoto]);

  const handleCancelNote = useCallback(() => {
    setEditingNote(false);
    setNoteText("");
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedPhoto) {
      onDeletePhoto(selectedPhoto.id);
      setSelectedPhoto(null);
    }
    setShowDeleteConfirm(false);
  }, [selectedPhoto, onDeletePhoto]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#7a8b6e]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#1a1a1a]">
            Progress Photos
          </h2>
          {photos.length > 0 && (
            <span className="text-[11px] sm:text-xs text-[#a3a3a3]">
              {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isUploading && (
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#7a8b6e]">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading...
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg text-[11px] sm:text-xs font-medium transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
            Add Photo
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {photos.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-16 sm:h-20 lg:h-24 bg-[#f8f6f3] rounded-lg border-2 border-dashed border-[#e5e5e5] cursor-pointer hover:border-[#7a8b6e] transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-[#a3a3a3] mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[11px] sm:text-xs text-[#a3a3a3]">
            Click to upload your first progress photo
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white/90 hover:bg-white shadow-md rounded-full flex items-center justify-center transition-colors border border-[#e5e5e5]"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#525252]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Photos Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="flex-shrink-0 group relative cursor-pointer"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="relative w-24 h-16 sm:w-32 sm:h-20 lg:w-40 lg:h-28 bg-[#f5f5f5] rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt="Progress photo"
                    className="w-full h-full object-cover"
                  />
                  {/* Date Badge */}
                  <div className="absolute bottom-0.5 left-0.5 px-1 sm:px-1.5 py-0.5 bg-black/50 rounded text-[8px] sm:text-[9px] lg:text-[10px] text-white">
                    {formatDate(photo.date)}
                  </div>
                  {/* Note indicator */}
                  {photo.note && (
                    <div className="absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-[#7a8b6e] rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                {/* Note preview */}
                {photo.note && (
                  <p className="mt-0.5 text-[8px] sm:text-[9px] lg:text-[10px] text-[#525252] truncate w-24 sm:w-32 lg:w-40 px-0.5">
                    {photo.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              type="button"
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white/90 hover:bg-white shadow-md rounded-full flex items-center justify-center transition-colors border border-[#e5e5e5]"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#525252]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo */}
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt="Progress photo"
                className="w-full h-auto max-h-[400px] object-contain bg-[#f5f5f5]"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
                {formatDate(selectedPhoto.date)}
              </div>
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Note Section */}
            <div className="p-4">
              {editingNote ? (
                <div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note about this photo..."
                    className="w-full px-3 py-2 text-sm text-[#1a1a1a] bg-[#f8f6f3] border border-[#e5e5e5] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7a8b6e] focus:border-[#7a8b6e]"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      className="px-3 py-1.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelNote}
                      className="px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] rounded-lg text-xs font-medium transition-colors border border-[#e5e5e5]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {selectedPhoto.note ? (
                    <p className="text-sm text-[#525252] leading-relaxed whitespace-pre-wrap mb-3">
                      {selectedPhoto.note}
                    </p>
                  ) : (
                    <p className="text-sm text-[#a3a3a3] italic mb-3">No note</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleEditNote}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] rounded-lg text-xs font-medium transition-colors border border-[#e5e5e5]"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      {selectedPhoto.note ? "Edit note" : "Add note"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] rounded-lg text-xs font-medium transition-colors border border-[#e5e5e5]"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-4 max-w-sm mx-4 shadow-xl">
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-2">
              Delete Photo?
            </h3>
            <p className="text-xs text-[#525252] mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-[#f5f5f5] hover:bg-[#e8ebe5] text-[#525252] rounded-lg text-xs font-medium transition-colors border border-[#e5e5e5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
