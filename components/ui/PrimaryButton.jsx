'use client';

const PrimaryButton = ({ children, className = '', ...props }) => (
  <button
    {...props}
    style={{ backgroundColor: '#8B9D82' }}
    className={`
      py-3 px-4 rounded-xl
      text-white font-semibold
      shadow-lg hover:opacity-90
      transition-opacity
      ${className}
    `}
  >
    {children}
  </button>
);

export default PrimaryButton;
