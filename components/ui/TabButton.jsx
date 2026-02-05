'use client';

const TabButton = ({
  active,
  onClick,
  icon: Icon,
  label,
  count
}) => {
  const colors = {
    sageGreen: '#8B9D82',
    burntOrange: '#C17F59',
  };

  return (
    <button
      onClick={onClick}
      style={active ? { backgroundColor: colors.burntOrange } : {}}
      className={`
        px-4 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 flex items-center gap-2
        ${active
          ? 'text-white shadow-lg'
          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        }
      `}
    >
      <Icon
        size={18}
        strokeWidth={2}
        className={active ? 'text-white' : 'text-stone-500'}
      />
      {label}
      {count !== null && count !== undefined && (
        <span
          style={!active ? { backgroundColor: colors.sageGreen } : {}}
          className={`
            text-xs font-bold px-2 py-0.5 rounded-full
            ${active ? 'bg-white/20 text-white' : 'text-white'}
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TabButton;
