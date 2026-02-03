"use client";

import { useState, useEffect } from "react";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string) => void;
}

const quickSuggestions = [
  "Mow the lawn",
  "Apply fertilizer",
  "Water grass",
  "Check for pests",
  "Edge borders",
  "Rake leaves",
  "Trim hedges",
  "Weed flower beds",
];

export default function TodoModal({ isOpen, onClose, onAdd }: TodoModalProps) {
  const [todoText, setTodoText] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTodoText("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todoText.trim()) {
      onAdd(todoText.trim());
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAdd(suggestion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Add Task</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Task Input */}
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Task Description
            </label>
            <input
              type="text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#7a8b6e] focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-sm bg-[#f5f5f5] hover:bg-[#e8ebe5] hover:text-[#7a8b6e] rounded-full text-[#525252] transition-colors border border-[#e5e5e5]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#525252] font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!todoText.trim()}
              className="flex-1 px-4 py-2.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] disabled:bg-[#a3a3a3] disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
