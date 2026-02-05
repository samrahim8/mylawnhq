'use client';

const SecondaryButton = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`
      py-3 px-4
      border-2 border-stone-300 rounded-xl
      text-stone-700 font-semibold
      hover:bg-stone-50
      transition-colors
      ${className}
    `}
  >
    {children}
  </button>
);

export default SecondaryButton;
