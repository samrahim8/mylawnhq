'use client';

const FormInput = ({ label, optional, className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-semibold text-stone-700 mb-2">
        {label}
        {optional && (
          <span className="font-normal text-stone-500"> (optional)</span>
        )}
      </label>
    )}
    <input
      {...props}
      className="
        w-full px-4 py-3
        border-2 border-stone-300 rounded-xl
        text-stone-800 placeholder-stone-400
        focus:outline-none focus:border-stone-400
        transition-colors
      "
    />
  </div>
);

export default FormInput;
