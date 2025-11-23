# 🎨 Loading Spinner Component - Complete Guide

A beautiful, reusable loading animation system with 6 stunning variants and full customization support.

---

## 📦 Quick Start

### Basic Usage
```tsx
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  return <LoadingSpinner />;
}
```

### Full Screen Loading
```tsx
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          fullScreen
          overlay
          variant="gradient"
          text="Loading your awesome content..."
        />
      )}
      {/* Your content */}
    </>
  );
}
```

---

## 🎯 Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the spinner |
| `fullScreen` | `boolean` | `false` | Make spinner full screen overlay |
| `overlay` | `boolean` | `true` | Add dark backdrop (only with fullScreen) |
| `text` | `string` | `'Loading...'` | Loading text to display |
| `variant` | `'default' \| 'pulse' \| 'bounce' \| 'dots' \| 'gradient' \| 'shimmer'` | `'default'` | Animation style |

---

## 🎨 Animation Variants

### 1. **Default** - Classic Spinning Circle
```tsx
<LoadingSpinner variant="default" text="Loading..." />
```
- **Best for:** General purpose, professional applications
- **Style:** Rotating circular border with glow effect
- **Performance:** Excellent
- **Accessibility:** ✅ Supported

### 2. **Pulse** - Expanding Rings
```tsx
<LoadingSpinner variant="pulse" text="Please wait..." />
```
- **Best for:** Elegant, calming UX
- **Style:** Three expanding concentric rings
- **Performance:** Excellent
- **Accessibility:** ✅ Supported

### 3. **Bounce** - Bouncing Balls
```tsx
<LoadingSpinner variant="bounce" text="Fetching data..." />
```
- **Best for:** Playful, friendly applications
- **Style:** Three balls bouncing up and down
- **Performance:** Excellent
- **Accessibility:** ✅ Supported

### 4. **Dots** - Animated Dots
```tsx
<LoadingSpinner variant="dots" text="Processing..." />
```
- **Best for:** Minimal, compact UI
- **Style:** Three dots with scale animation
- **Performance:** Excellent
- **Accessibility:** ✅ Supported

### 5. **Gradient** - Rotating Gradient (⭐ Most Stunning)
```tsx
<LoadingSpinner variant="gradient" text="Almost there..." />
```
- **Best for:** Eye-catching full screen loading
- **Style:** Rotating gradient border with emoji indicator
- **Performance:** Excellent
- **Accessibility:** ✅ Supported
- **Recommended:** Perfect for page transitions

### 6. **Shimmer** - Skeleton Loading
```tsx
<LoadingSpinner variant="shimmer" text="Building your page..." />
```
- **Best for:** Content placeholder, skeleton screens
- **Style:** Animated shimmer bars
- **Performance:** Excellent
- **Accessibility:** ✅ Supported

---

## 📏 Size Options

### Small
```tsx
<LoadingSpinner size="small" />
```
- **Use case:** Inline buttons, small containers
- **Dimensions:** 40x40px (circle), 10x10px (dots)

### Medium (Default)
```tsx
<LoadingSpinner size="medium" />
```
- **Use case:** Components, modal loading states
- **Dimensions:** 60x60px (circle), 12x12px (dots)

### Large
```tsx
<LoadingSpinner size="large" />
```
- **Use case:** Full screen, hero sections
- **Dimensions:** 80x80px (circle), 18x18px (dots)

---

## 💡 Real-World Examples

### 1. Page Load with Gradient Spinner
```tsx
import { useEffect, useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import HomePage from './pages/HomePage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/home');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        overlay
        variant="gradient"
        text="Loading your dashboard..."
      />
    );
  }

  return <HomePage data={data} />;
}
```

### 2. Button Loading State
```tsx
import { useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

export default function SubmitButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner size="small" text="" />;
  }

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### 3. Data Fetching with Overlay
```tsx
import { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import ProductsList from './ProductsList';

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {isLoading && (
        <LoadingSpinner
          fullScreen={false}
          overlay={false}
          variant="shimmer"
          size="medium"
        />
      )}
      {!isLoading && <ProductsList products={products} />}
    </div>
  );
}
```

### 4. Modal Loading
```tsx
import { useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

export default function Modal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal">
      {isLoading ? (
        <LoadingSpinner
          variant="pulse"
          text="Loading modal content..."
        />
      ) : (
        <div className="modal-content">
          {/* Modal content */}
        </div>
      )}
    </div>
  );
}
```

### 5. Infinite Scroll Loading
```tsx
import { useEffect, useRef, useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

export default function InfiniteScroll() {
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);
          // Load more items...
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <div>
      {/* Items list */}
      <div ref={observerTarget}>
        {isLoading && <LoadingSpinner size="small" variant="dots" />}
      </div>
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Choose the Right Variant
- **Professional**: Use `default` or `pulse`
- **Playful**: Use `bounce`
- **Modern**: Use `gradient` (especially for full screen)
- **Minimal**: Use `dots` for small spaces
- **Skeleton screens**: Use `shimmer`

### 2. Overlay Usage
```tsx
// Don't use overlay for inline loaders
<LoadingSpinner overlay={false} />

// Use overlay for full screen loaders to dim background
<LoadingSpinner fullScreen overlay text="Processing..." />
```

### 3. Loading Text
```tsx
// Use meaningful text
<LoadingSpinner text="Uploading files..." />

// Empty text for buttons/inline use
<LoadingSpinner text="" size="small" />

// Descriptive text for full screen
<LoadingSpinner fullScreen text="Syncing your data across devices..." />
```

### 4. Size Selection
```tsx
// Small: For buttons and inline elements
<LoadingSpinner size="small" />

// Medium: For components and modals
<LoadingSpinner size="medium" fullScreen />

// Large: For full screen and hero sections
<LoadingSpinner size="large" fullScreen />
```

### 5. Accessibility
- Component respects `prefers-reduced-motion` for users who prefer animations
- Always include `text` prop for context (except when size is "small")
- Use semantic loading messages that describe what's happening

---

## 🚀 Performance Tips

1. **Only render when needed**: Always conditionally render the spinner
   ```tsx
   {isLoading && <LoadingSpinner ... />}
   ```

2. **Use CSS animations**: All animations are GPU-accelerated
   - Smooth performance even on low-end devices
   - No JavaScript re-renders

3. **Cleanup properly**: Remove spinner once data is loaded
   ```tsx
   useEffect(() => {
     setIsLoading(false);
   }, [data]);
   ```

4. **Variant performance**: All variants have similar performance
   - Choose based on design preference, not performance

---

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## ♿ Accessibility Features

- ✅ Respects `prefers-reduced-motion` media query
- ✅ Semantic loading text
- ✅ High contrast colors (WCAG AA compliant)
- ✅ Works with screen readers (via loading text)

---

## 📝 Custom Styling

To override default colors, add to your CSS:

```css
/* Change primary color */
:root {
  --loading-color: #your-color;
}

/* Or target the class directly */
.spinner-circle {
  border-top-color: #your-color;
}
```

---

## 🔗 Integration Checklist

- [ ] Copy `LoadingSpinner.tsx` and `LoadingSpinner.css` to `src/components/`
- [ ] Import in your component: `import LoadingSpinner from './components/LoadingSpinner';`
- [ ] Wrap with loading state: `{isLoading && <LoadingSpinner ... />}`
- [ ] Choose appropriate variant for your use case
- [ ] Set meaningful loading text
- [ ] Test on mobile devices
- [ ] Verify animation smoothness
- [ ] Check accessibility with screen reader

---

## 🎓 Demo

Run the demo component to see all variants in action:

```tsx
import LoadingDemo from './components/LoadingDemo';

export default function DemoPage() {
  return <LoadingDemo />;
}
```

---

## 📞 Support

For issues or feature requests, refer to the component source code with JSDoc comments.

---

**Created:** November 22, 2025  
**Version:** 1.0.0  
**License:** MIT
