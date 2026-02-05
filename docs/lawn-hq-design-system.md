# Lawn HQ Design System Update

## Overview
This document outlines the design system changes for Lawn HQ, including brand colors, icon replacements, typography, and component specifications.

---

## Brand Colors

```js
// colors.js or tailwind.config.js
const colors = {
  sageGreen: {
    DEFAULT: '#8B9D82',
    hover: '#7a8b71',
    light: '#8B9D8215', // 15% opacity for backgrounds
  },
  burntOrange: {
    DEFAULT: '#C17F59',
    hover: '#b06f4a',
  },
};
```

---

## Icon Replacements (Emoji → Lucide)

Replace all emoji icons with Lucide React icons using these mappings:

| Context | Old (Emoji) | New (Lucide) | Import |
|---------|-------------|--------------|--------|
| Mow | ✂️ | `Scissors` | `lucide-react` |
| Water | 💧 | `Droplet` | `lucide-react` |
| Fertilize | 🌱 | `Sprout` | `lucide-react` |
| Seed | 🌾 | `Wheat` | `lucide-react` |
| Weed Control | 🌼 | `Flower2` | `lucide-react` |
| Pest Control | 🐛 | `Bug` | `lucide-react` |
| Aerate | 🔄 | `Wind` | `lucide-react` |
| Other | 📝 | `MoreHorizontal` | `lucide-react` |
| Calendar | 📅 | `Calendar` | `lucide-react` |
| The Log | 🕐 | `Clock` | `lucide-react` |
| To Do | ✅ | `CheckSquare` | `lucide-react` |
| Weather | ☁️ | `Cloud` | `lucide-react` |
| Soil Temp | 🌡️ | `Thermometer` | `lucide-react` |
| Close/X | ✕ | `X` | `lucide-react` |

### Icon Specifications
```js
// Default icon props for consistency
const iconDefaults = {
  size: 32,        // For activity cards
  strokeWidth: 1.75,
  // Smaller contexts (tabs, buttons):
  // size: 18, strokeWidth: 2
};
```

---

## Typography

### Font Weights
- **Labels**: `font-semibold` (600)
- **Body text**: `font-medium` (500)
- **Buttons**: `font-semibold` (600)
- **Card titles**: `font-bold` (700)

### Font Sizes (optimized for 50+ users)
- **Labels**: `text-sm` (14px)
- **Card text**: `text-sm` (14px) with `font-semibold`
- **Headings**: `text-xl` (20px) with `font-bold`
- **Small/helper text**: `text-xs` (12px)

---

## Component Specifications

### Selectable Card (Activity Type, Area of Lawn)

```jsx
// SelectableCard.jsx
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
```

### Tab Button (Navigation Tabs)

```jsx
// TabButton.jsx
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
```

### Form Input

```jsx
// FormInput.jsx
const FormInput = ({ label, optional, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-stone-700 mb-2">
      {label}
      {optional && (
        <span className="font-normal text-stone-500"> (optional)</span>
      )}
    </label>
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
```

### Primary Button

```jsx
// PrimaryButton.jsx
const PrimaryButton = ({ children, ...props }) => (
  <button
    {...props}
    style={{ backgroundColor: '#8B9D82' }}
    className="
      py-3 px-4 rounded-xl
      text-white font-semibold
      shadow-lg hover:opacity-90
      transition-opacity
    "
  >
    {children}
  </button>
);
```

### Secondary Button

```jsx
// SecondaryButton.jsx
const SecondaryButton = ({ children, ...props }) => (
  <button
    {...props}
    className="
      py-3 px-4
      border-2 border-stone-300 rounded-xl
      text-stone-700 font-semibold
      hover:bg-stone-50
      transition-colors
    "
  >
    {children}
  </button>
);
```

---

## Border & Shadow Specs

```js
const borderRadius = {
  card: 'rounded-xl',      // 12px
  button: 'rounded-xl',    // 12px
  modal: 'rounded-2xl',    // 16px
  input: 'rounded-xl',     // 12px
};

const borders = {
  default: 'border-2 border-stone-300',
  selected: 'border-2 border-transparent',
  focus: 'border-stone-400',
};

const shadows = {
  selected: 'shadow-lg',
  card: 'shadow-sm',
  modal: 'shadow-xl',
};
```

---

## Migration Strategy

### Phase 1: Foundation
1. Add Lucide React dependency: `npm install lucide-react`
2. Create `/components/ui/` folder for shared components
3. Add color constants to theme/tailwind config

### Phase 2: Shared Components
1. Build `SelectableCard`, `TabButton`, `FormInput`, `PrimaryButton`, `SecondaryButton`
2. Test in isolation (Storybook if available)

### Phase 3: Incremental Rollout
Replace by feature area (one PR each):
1. Log Activity modal
2. Navigation tabs
3. Activity cards elsewhere in the app
4. Any remaining emoji instances

### Phase 4: Cleanup
1. Search codebase for remaining emojis
2. Remove unused emoji-related code
3. Update any inline styles to use design tokens

---

## Files Included

- `lawn-hq-tabs.jsx` — Navigation tabs component
- `lawn-hq-activity-icons.jsx` — Activity type selector
- `lawn-hq-log-activity.jsx` — Complete Log Activity modal
