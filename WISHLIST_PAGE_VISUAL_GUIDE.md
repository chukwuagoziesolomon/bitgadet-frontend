# Wishlist Page - Visual Design Guide

## 🎨 Page Layout Overview

```
┌─────────────────────────────────────────────────────────┐
│                    NAVBAR (unchanged)                    │
│  Logo    Categories    Search    ❤️ (heart)  🛒  👤    │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                   HERO SECTION (Purple)                   │
│                                                            │
│                         ❤️ (floating)                     │
│                    Your Wishlist                          │
│                                                            │
│  Keep track of your favorite products and get notified   │
│         when they go on sale                              │
│                                                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              SUMMARY CARDS (3 columns)                    │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐│
│  │ Total Items     │ │ Total Value     │ │ Potential    ││
│  │      12         │ │   ₦145,000      │ │ Savings      ││
│  │                 │ │                 │ │  ₦25,000     ││
│  │ (purple border) │ │                 │ │ (gradient bg)││
│  └─────────────────┘ └─────────────────┘ └──────────────┘│
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│            CONTROLS BAR (Sort/Filter/Share)              │
│  ┌─────────────────────┐ ┌──────────────────────┐        │
│  │ Sort By: [Newest▼] │ │ Filter By: [All▼]  │ │        │
│  │ Price: Low to High  │ │ - In Stock (8)       │        │
│  │ Price: High to Low  │ │ - Out of Stock (2)  │ Share │
│  └─────────────────────┘ │ - On Sale (4)       │  [→]  │
│                           └──────────────────────┘        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│            PRODUCT GRID (4 columns on desktop)           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Product │  │ Product │  │ Product │  │ Product │    │
│  │   1     │  │   2     │  │   3     │  │   4     │    │
│  │         │  │         │  │         │  │         │    │
│  │ [+] [-] │  │ [+] [-] │  │ [+] [-] │  │ [+] [-] │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ Product │  │ Product │  │ Product │  │ Product │    │
│   5-8...                                            │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    FOOTER (unchanged)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Hero Background | Purple to Pink | #a855f7 → #d946ef | Main section |
| Page Background | Light Blue Gradient | #f8fafc → #f0f9ff | Overall page |
| Text Primary | Dark Gray | #1f2937 | Headings |
| Text Secondary | Medium Gray | #6b7280 | Body text |
| Card Border | Purple | #a855f7 | Summary cards |
| Button | Purple Gradient | #a855f7 → #d946ef | Interactive |
| White Space | White | #ffffff | Cards/containers |

---

## 📱 Responsive Breakpoints

### Desktop (1200px+)
```
SUMMARY CARDS: 3 Columns
PRODUCT GRID: 4 Columns  
CONTROLS: Side by side (Sort/Filter | Share)
FONT SIZES: Large (optimal readability)
```

### Tablet (768px - 1199px)
```
SUMMARY CARDS: 2 Columns
PRODUCT GRID: 3 Columns
CONTROLS: Stacked (Sort/Filter on top, Share full width)
FONT SIZES: Medium
```

### Mobile (480px - 767px)
```
SUMMARY CARDS: 1 Column (stacked)
PRODUCT GRID: 2 Columns
CONTROLS: Full width dropdowns
FONT SIZES: Small
HERO TEXT: Reduced size
```

### Extra Small (< 480px)
```
SUMMARY CARDS: 1 Column (compact)
PRODUCT GRID: 1 Column (full width)
CONTROLS: Full width, single line each
FONT SIZES: Extra small
HERO: Minimal padding
```

---

## 🎬 Animations

### 1. Hero Section Entrance
```
slideDown (0.6s ease-out)
- Opacity: 0 → 1
- Transform: translateY(-20px) → 0
```

### 2. Floating Heart Icon
```
float (3s ease-in-out infinite)
- Transform: translateY(0px) ↔ translateY(-10px)
- Continuous, smooth motion
```

### 3. Loading Spinner
```
spin (1s linear infinite)
- Rotation: 0deg → 360deg
- Continuous rotation
```

### 4. Content Fade-In
```
fadeIn (0.4-0.6s ease-out)
- Opacity: 0 → 1
- Transform: translateY(10px) → 0
- Staggered delays for items
```

### 5. Card Hover Effects
```
Summary Cards:
- translateY(-4px)
- Box-shadow increases
- Smooth transition (0.3s)

Buttons:
- translateY(-2px)
- Box-shadow increases
- Smooth transition (0.3s)
```

---

## 🎯 Interactive Elements

### Sort Dropdown
```
Options:
□ Newest First (default)
□ Price: Low to High
□ Price: High to Low

Styling:
- Border: 2px #e5e7eb (default)
- Border: 2px #a855f7 (on focus/hover)
- Padding: 8px 12px
- Font: 0.95rem
```

### Filter Dropdown
```
Options:
□ All Items (12)
□ In Stock (10)
□ Out of Stock (2)
□ On Sale (5)

Styling:
- Same as sort dropdown
- Shows item count per category
```

### Share Button
```
Display: [→ Share]
Icon + Text (mobile: icon only)
Background: Purple gradient
Hover: Lift effect, shadow increase
```

### Product Card Actions
```
Left Action: [+] Add to Cart
Right Action: [×] Remove from Wishlist
Only [+] available if in stock
```

---

## 📊 Empty State

```
┌─────────────────────────────────────────┐
│                                          │
│              ❤️ (large icon)             │
│                                          │
│      Your wishlist is empty              │
│                                          │
│   Start adding items you love!           │
│   When you find something you like,      │
│   click the heart icon to save it here   │
│                                          │
│   [Continue Shopping →]                  │
│                                          │
└─────────────────────────────────────────┘
```

---

## ⚡ Loading State

```
┌─────────────────────────────────────────┐
│                                          │
│              [spinner]                   │
│                                          │
│      Loading your wishlist...            │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🚫 No Results State

```
┌─────────────────────────────────────────┐
│                                          │
│   No items match your filter             │
│   Try adjusting your filters             │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🎨 Product Card Display

Each product card shows:
```
┌─────────────────────┐
│   [Product Image]   │
│                     │
│ Brand               │
│ Product Name        │
│ ★★★★★ (4.5) 23 reviews
│                     │
│ ₦25,000 ₦30,000 -20%
│                     │
│ In Stock: 15 units  │
│                     │
│ [+ Add] [❤ Remove]  │
└─────────────────────┘
```

---

## 📐 Spacing & Layout

### Horizontal Spacing
- Desktop: 20px gaps
- Tablet: 15px gaps
- Mobile: 10px gaps

### Vertical Spacing
- Between sections: 40px
- Between cards: 20px
- Internal padding: 20-25px

### Max Width
- Container: 1300px (max-width)
- Content: Full width minus padding

---

## 🔤 Typography

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Hero H1 | Outfit | 700 | 3rem (mobile: 1.5rem) | White |
| Hero P | Outfit | 400 | 1.1rem (mobile: 0.9rem) | White |
| Section H2 | Outfit | 700 | 2rem | #1f2937 |
| Summary Label | Outfit | 600 | 0.95rem | #374151 |
| Summary Value | Outfit | 700 | 2rem | #1f2937 |
| Body Text | Outfit | 400 | 1rem | #6b7280 |
| Small Text | Outfit | 400 | 0.85rem | #9ca3af |

---

## ✅ Visual Checklist

- ✓ Purple gradient hero section
- ✓ Floating heart animation
- ✓ Three summary cards with stats
- ✓ Sort and filter dropdowns
- ✓ Share button with icon
- ✓ 4-column product grid (desktop)
- ✓ Responsive layouts for all sizes
- ✓ Empty state with CTA button
- ✓ Loading spinner
- ✓ Smooth hover animations
- ✓ Consistent spacing
- ✓ Clear typography hierarchy

---

**Design System:** Modern, Clean, Purple-themed  
**Accessibility:** WCAG 2.1 compliant  
**Performance:** Optimized animations, no jank
