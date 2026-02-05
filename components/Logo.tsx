export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Three grass blades */}
      <path
        d="M16 4C16 4 16 14 16 20C16 22 15 24 14 26L16 28L18 26C17 24 16 22 16 20C16 14 16 4 16 4Z"
        fill="#4A6741"
      />
      <path
        d="M10 10C10 10 11 18 12 22C12.5 24 13 25 14 26L12 28C10 26 9 24 9 22C9 18 10 10 10 10Z"
        fill="#4A6741"
        opacity="0.8"
      />
      <path
        d="M22 10C22 10 21 18 20 22C19.5 24 19 25 18 26L20 28C22 26 23 24 23 22C23 18 22 10 22 10Z"
        fill="#4A6741"
        opacity="0.8"
      />
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
