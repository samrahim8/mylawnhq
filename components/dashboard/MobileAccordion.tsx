"use client";

import { useState, ReactNode } from "react";

interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  addButton?: boolean;
  onAdd?: () => void;
}

interface MobileAccordionProps {
  items: AccordionItem[];
  defaultExpandedId?: string;
}

export default function MobileAccordion({ items, defaultExpandedId }: MobileAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId || null);

  const toggleItem = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden"
          >
            {/* Header - always visible */}
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-center p-3 text-center"
            >
              {/* Left side: add button (if exists) */}
              <div className="w-10 flex justify-start flex-shrink-0">
                {item.addButton && item.onAdd ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onAdd?.();
                    }}
                    className="p-1.5 bg-[#7a8b6e] hover:bg-[#6a7b5e] rounded-lg text-white transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ) : (
                  <span />
                )}
              </div>

              {/* Center: icon, title, subtitle */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <span className="flex-shrink-0 text-[#7a8b6e]">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#1a1a1a]">
                    {item.title}
                  </span>
                </div>
                {item.subtitle && (
                  <span className="text-[10px] text-[#a3a3a3] mt-0.5">
                    {item.subtitle}
                  </span>
                )}
              </div>

              {/* Right side: chevron */}
              <div className="w-10 flex justify-end flex-shrink-0">
                <svg
                  className={`w-4 h-4 text-[#a3a3a3] transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Content - collapsible */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-3 pb-3 border-t border-[#e5e5e5]">
                {item.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
