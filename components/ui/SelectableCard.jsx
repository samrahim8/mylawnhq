'use client';

const SelectableCard = ({
  selected,
  onClick,
  icon: Icon,
  label,
  size = 'default' // 'default' | 'compact'
}) => {
  const colors = {
    sageGreen: '#8B9D82',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={selected ? { backgroundColor: colors.sageGreen } : {}}
      className={`
        rounded-xl transition-all duration-200 flex flex-col items-center
        ${size === 'default' ? 'p-3 gap-1.5' : 'p-3 gap-1'}
        ${selected
          ? 'border-2 border-transparent shadow-lg'
          : 'border-2 border-stone-300 hover:border-stone-400 bg-white'
        }
      `}
    >
      {Icon && (
        <Icon
          size={size === 'default' ? 28 : 24}
          strokeWidth={1.75}
          className={selected ? 'text-white' : 'text-stone-600'}
        />
      )}
      <span className={`
        text-xs font-semibold text-center leading-tight
        ${selected ? 'text-white' : 'text-stone-700'}
      `}>
        {label}
      </span>
    </button>
  );
};

export default SelectableCard;
