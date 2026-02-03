"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Home",
    href: "/home",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    name: "Chat",
    href: "/chat",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    hasAdd: true,
  },
];

const resourceItems = [
  {
    name: "Spreader Settings",
    href: "/spreader",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Lawn Care Calendars",
    href: "/calendars",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const dashboardItems = [
  {
    name: "Profile Setup",
    href: "/profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    name: "Quick Tips",
    href: "/tips",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    name: "Export Data",
    href: "/export",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function SidebarContent({ isExpanded, onLinkClick }: { isExpanded: boolean; onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo */}
      <div className={`p-4 border-b border-[#e5e5e5] ${!isExpanded && "px-2"}`}>
        <Link href="/" className="flex items-center gap-2" onClick={onLinkClick}>
          <div className="w-8 h-8 bg-[#7a8b6e] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className={`font-display font-semibold text-base text-[#1a1a1a] whitespace-nowrap ${!isExpanded && "hidden"}`}>
            LawnHQ
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className={`flex-1 p-2 space-y-1 overflow-hidden ${!isExpanded && "px-1"}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#7a8b6e] text-white"
                  : "text-[#525252] hover:bg-[#f8f6f3] hover:text-[#1a1a1a]"
              } ${!isExpanded && "justify-center px-2"}`}
              title={!isExpanded ? item.name : undefined}
            >
              <div className={`flex items-center gap-2 ${!isExpanded && "gap-0"}`}>
                {item.icon}
                <span className={`font-medium text-sm whitespace-nowrap ${!isExpanded && "hidden"}`}>
                  {item.name}
                </span>
              </div>
              {item.hasAdd && isExpanded && (
                <button className={`p-1 rounded-lg ${isActive ? "hover:bg-[#6a7b5e]" : "hover:bg-[#e5e5e5]"}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
            </Link>
          );
        })}

        {/* Resources Section */}
        <div className="pt-4">
          <p className={`px-3 py-1 text-xs font-medium text-[#a3a3a3] uppercase tracking-wider ${!isExpanded && "hidden"}`}>
            Resources
          </p>
          {resourceItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#7a8b6e] text-white"
                    : "text-[#525252] hover:bg-[#f8f6f3] hover:text-[#1a1a1a]"
                } ${!isExpanded && "justify-center px-2"}`}
                title={!isExpanded ? item.name : undefined}
              >
                {item.icon}
                <span className={`font-medium text-sm whitespace-nowrap ${!isExpanded && "hidden"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="pt-4">
          <p className={`px-3 py-1 text-xs font-medium text-[#a3a3a3] uppercase tracking-wider ${!isExpanded && "hidden"}`}>
            Settings
          </p>
          {dashboardItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#7a8b6e] text-white"
                    : "text-[#525252] hover:bg-[#f8f6f3] hover:text-[#1a1a1a]"
                } ${!isExpanded && "justify-center px-2"}`}
                title={!isExpanded ? item.name : undefined}
              >
                {item.icon}
                <span className={`font-medium text-sm whitespace-nowrap ${!isExpanded && "hidden"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t border-[#e5e5e5] ${!isExpanded && "hidden"}`}>
        <p className="text-xs text-[#737373] text-center">© 2025 LawnHQ</p>
      </div>
    </>
  );
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile sidebar - fixed position, slides in/out */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-[#e5e5e5] flex flex-col z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0 w-56" : "-translate-x-full w-56"
        }`}
      >
        <SidebarContent isExpanded={true} onLinkClick={onToggle} />
      </aside>

      {/* Desktop sidebar - relative position, hover to expand */}
      <div className="hidden lg:block relative flex-shrink-0 group/sidebar">
        <aside className="relative h-screen bg-white border-r border-[#e5e5e5] flex flex-col transition-all duration-300 ease-in-out w-14 group-hover/sidebar:w-56 overflow-hidden">
          <div className="group-hover/sidebar:opacity-100 transition-opacity duration-300">
            <SidebarContent isExpanded={false} />
          </div>
          {/* Expanded content shown on hover */}
          <div className="absolute inset-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 bg-white">
            <div className="h-full flex flex-col">
              <SidebarContent isExpanded={true} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
