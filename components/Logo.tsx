export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mow stripes - clean, confident, parallel */}
      <rect x="5" y="6" width="5" height="20" rx="2.5" fill="#4A6741" />
      <rect x="13.5" y="6" width="5" height="20" rx="2.5" fill="#4A6741" />
      <rect x="22" y="6" width="5" height="20" rx="2.5" fill="#4A6741" />
    </svg>
  );
}

// Test: Lawnmower icon in same minimal style
export function LogoIconMower({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body */}
      <rect x="4" y="12" width="18" height="9" rx="2" fill="#4A6741" />
      {/* Handle */}
      <rect x="22" y="8" width="4" height="10" rx="2" fill="#4A6741" />
      {/* Wheels */}
      <circle cx="9" cy="24" r="4" fill="#4A6741" />
      <circle cx="22" cy="24" r="3" fill="#4A6741" />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      Lawn<span className="text-lawn">HQ</span>
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon className="w-7 h-7" />
      <LogoWordmark className="text-xl text-deep-brown" />
    </div>
  );
}
