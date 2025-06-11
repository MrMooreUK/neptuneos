
# 🎨 NeptuneOS Design System

## Overview
This document defines the design system for NeptuneOS, ensuring consistency across all components and pages. The design follows aquatic themes with professional, modern aesthetics.

## 🎯 Design Principles

### 1. **Aquatic Inspiration**
- Ocean blues, seafoam greens, and coral accents
- Flowing, organic layouts with subtle animations
- Clean, modern aesthetic with marine undertones

### 2. **Professional & Clean**
- Minimalist approach with purposeful whitespace
- Clear visual hierarchy
- Consistent spacing and typography

### 3. **Accessibility First**
- High contrast ratios (WCAG 2.1 AA compliant)
- Multiple visual indicators beyond color
- Keyboard navigation support
- Screen reader compatibility

## 🎨 Color System

### Primary Colors
```css
/* Ocean Blues */
--ocean-blue: 210 100% 45%;        /* #2563eb */
--deep-blue: 210 100% 35%;         /* #1d4ed8 */
--light-blue: 210 100% 60%;        /* #3b82f6 */

/* Seafoam & Aqua */
--seafoam: 174 44% 51%;            /* #06b6d4 */
--light-aqua: 174 44% 80%;         /* #a5f3fc */
--cyan-accent: 180 100% 50%;       /* #00ffff */

/* Coral & Warm Accents */
--coral-warm: 14 91% 60%;          /* #f97316 */
--coral-danger: 0 84% 60%;         /* #ef4444 */
```

### Status Colors
```css
/* Temperature Indicators */
--temp-cold: 210 100% 50%;         /* Blue - Too Cold */
--temp-good: 142 76% 36%;          /* Green - Optimal */
--temp-hot: 0 84% 60%;             /* Red - Too Hot */

/* System Status */
--status-online: 142 76% 36%;      /* Green */
--status-warning: 45 93% 47%;      /* Yellow */
--status-error: 0 84% 60%;         /* Red */
--status-offline: 220 14% 46%;     /* Gray */
```

### Neutral Colors
```css
/* Light Theme */
--background: 206 100% 97%;        /* Very light blue */
--surface: 206 100% 99%;           /* Near white */
--border: 214 31% 91%;             /* Light gray */

/* Dark Theme */
--dark-background: 210 40% 8%;     /* Very dark blue */
--dark-surface: 210 40% 10%;       /* Dark blue */
--dark-border: 210 40% 20%;        /* Dark gray */
```

## 🖼️ Layout System

### Container Widths
- **Mobile**: Full width with 16px padding
- **Tablet**: Full width with 24px padding
- **Desktop**: Max 1280px with 32px padding
- **Large**: Max 1536px with 48px padding

### Grid System
```css
/* Standard Grid Breakpoints */
grid-cols-1           /* Mobile: Single column */
md:grid-cols-2        /* Tablet: Two columns */
lg:grid-cols-3        /* Desktop: Three columns */
xl:grid-cols-4        /* Large: Four columns */
```

### Spacing Scale
```css
/* Consistent spacing using Tailwind scale */
space-y-4    /* 16px vertical spacing */
space-y-6    /* 24px vertical spacing */
space-y-8    /* 32px vertical spacing */
gap-4        /* 16px grid gap */
gap-6        /* 24px grid gap */
gap-8        /* 32px grid gap */
```

## 🃏 Card Components

### Standard Card Structure
```tsx
<Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-blue-200/50 dark:border-blue-600/30">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-semibold flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-gray-900 dark:text-gray-100">Card Title</span>
      </div>
      <Badge variant="outline" className="text-xs">Status</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### Card Variants

#### **Status Cards** (4-grid layout)
- Background: `bg-white/90 dark:bg-slate-800/90`
- Border colors by category:
  - Green: `border-green-200/50 dark:border-green-600/30`
  - Blue: `border-blue-200/50 dark:border-blue-600/30`
  - Purple: `border-purple-200/50 dark:border-purple-600/30`
  - Orange: `border-orange-200/50 dark:border-orange-600/30`

#### **Feature Cards** (Full width)
- Background: `bg-white/90 dark:bg-slate-800/90`
- Border: `border border-[color]-200/50 dark:border-[color]-600/30`
- Icon containers: `p-2 bg-[color]-100 dark:bg-[color]-900/30 rounded-lg`

## 🎭 Icon System

### Icon Containers
```tsx
{/* Standard icon container */}
<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
</div>

{/* Status card icon container */}
<div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
  <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
</div>
```

### Icon Categories
- **System Icons**: Settings, Activity, Wifi, RefreshCw
- **Feature Icons**: Thermometer, Camera, Fish
- **Status Icons**: CheckCircle, AlertTriangle, XCircle
- **Navigation Icons**: ArrowLeft, ArrowRight, Menu

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile First**: Start with mobile layout
- **Progressive Enhancement**: Add features for larger screens
- **Touch Friendly**: 44px minimum touch targets
- **Flexible Grid**: Use CSS Grid with responsive columns

### Layout Patterns
```tsx
{/* Status grid - responsive columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

{/* Feature cards - responsive width */}
<Card className="lg:col-span-2 xl:col-span-3">

{/* Navigation - responsive visibility */}
<span className="hidden sm:inline">Desktop Text</span>
```

## ⚡ Animation & Interactions

### Hover Effects
```css
/* Card hover animation */
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px hsl(var(--primary) / 0.15);
}
```

### Loading States
```tsx
{/* Pulse animation for live indicators */}
<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

{/* Wave animation for fish icon */}
<Fish className="w-12 h-12 wave-animation text-blue-500" />
```

### Backdrop Effects
```css
/* Glassmorphism effect */
backdrop-blur-sm     /* Subtle blur */
backdrop-blur-lg     /* Strong blur */

/* Transparency levels */
bg-white/80          /* 80% opacity */
bg-white/90          /* 90% opacity */
```

## 🔤 Typography

### Text Hierarchy
```css
/* Headings */
text-2xl font-bold   /* Page titles */
text-xl font-semibold /* Section titles */
text-lg font-medium  /* Subsection titles */

/* Body Text */
text-sm font-medium  /* Labels */
text-base            /* Body text */
text-sm              /* Secondary text */
text-xs              /* Captions */
```

### Text Colors
```css
/* Primary text */
text-gray-900 dark:text-gray-100

/* Secondary text */
text-gray-600 dark:text-gray-400

/* Muted text */
text-gray-500 dark:text-gray-500

/* Accent colors */
text-blue-600 dark:text-blue-400
text-green-600 dark:text-green-400
```

## 🎯 Component Guidelines

### Button Styling
- Use shadcn/ui Button component
- Variants: `default`, `outline`, `ghost`
- Sizes: `sm`, `default`, `lg`
- Always include proper spacing and icons

### Badge Usage
- Status indicators: `variant="outline"`
- Version numbers: `variant="outline"`
- Live indicators: Custom green styling
- Size: Always use `text-xs`

### Form Elements
- Use shadcn/ui form components
- Consistent spacing with `space-y-4`
- Proper labels and accessibility
- Validation states with color coding

## 🌓 Dark Mode Support

### Implementation
- Use CSS custom properties for colors
- Leverage Tailwind's `dark:` prefix
- Test all components in both themes
- Maintain contrast ratios

### Color Mapping
```css
/* Light theme */
.light {
  --background: 206 100% 97%;
  --foreground: 210 40% 15%;
}

/* Dark theme */
.dark {
  --background: 210 40% 8%;
  --foreground: 210 40% 95%;
}
```

## ✅ Implementation Checklist

### For New Components
- [ ] Use semantic color tokens (no hardcoded colors)
- [ ] Implement dark mode support
- [ ] Add proper TypeScript types
- [ ] Include accessibility attributes
- [ ] Test responsive behavior
- [ ] Add hover/focus states
- [ ] Follow icon container patterns
- [ ] Use consistent spacing

### For Pages
- [ ] Use standard layout structure
- [ ] Implement responsive grid system
- [ ] Add proper page meta information
- [ ] Include loading states
- [ ] Test across all breakpoints
- [ ] Validate color contrast
- [ ] Add proper navigation

## 🔄 Maintenance

### Regular Reviews
- Monthly design system audit
- Accessibility testing
- Performance optimization
- Cross-browser testing

### Documentation Updates
- Update when adding new components
- Document any design pattern changes
- Maintain example code snippets
- Keep color palette current

---

*This design system ensures NeptuneOS maintains a consistent, professional, and accessible user experience across all features and future development.*
