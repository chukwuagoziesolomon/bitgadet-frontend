# ⚡ Global Loading - Quick Start (5 Minutes)

Your entire app now has beautiful loading animations! Here's how to use it:

---

## 3 Seconds Setup

The setup is **already done**! The global provider is active in `App.tsx`.

---

## 2 Minute Implementation (Per Page)

### For Pages That Load Data

**Before:**
```tsx
const [loading, setLoading] = useState(true);
useEffect(() => {
  fetch('/api/data').then(...).finally(() => setLoading(false));
}, []);
```

**After (ONE LINE IMPORT + ONE HOOK CALL):**
```tsx
import { useGlobalFetch } from '../hooks/useGlobalLoadingIntegration';

const { data } = useGlobalFetch('/api/data', {
  loadingText: 'Loading your data...'
});
```

✅ Done! Beautiful loading appears automatically!

---

## Copy-Paste Examples

### Example 1: HomePage
```tsx
import { useGlobalFetch } from '../hooks/useGlobalLoadingIntegration';

export default function HomePage() {
  const { data: homeData } = useGlobalFetch('/api/home/', {
    loadingText: 'Loading amazing gadgets...'
  });

  if (!homeData) return null;
  return <div>{/* render homeData */}</div>;
}
```

### Example 2: Products Page
```tsx
import { useGlobalFetch } from '../hooks/useGlobalLoadingIntegration';

export default function ProductsPage() {
  const [category, setCategory] = useState('all');
  
  const { data: products } = useGlobalFetch(
    `/api/products/?category=${category}`,
    { 
      loadingText: 'Finding perfect products...',
      dependencies: [category]
    }
  );

  return (
    <div>
      {products?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### Example 3: Form Submission (Login)
```tsx
import { useGlobalAsync } from '../hooks/useGlobalLoadingIntegration';

export default function LoginPage() {
  const executeLogin = useGlobalAsync(
    async (email: string, password: string) => {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      return response.json();
    },
    'Logging you in...'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    
    try {
      const data = await executeLogin(email, password);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## What It Looks Like

```
User clicks "Load" or navigates to page
                ↓
        ✨ Gradient animation appears ✨
        
    [Beautiful rotating gradient circle]
    
        "Loading your products..."
        
        (Dark overlay background)
                ↓
            Data loads...
                ↓
        Animation disappears
                ↓
        Page displays perfectly 🎉
```

---

## Two Hooks to Know

### Hook 1: useGlobalFetch (Use This!)
```tsx
const { data, isLoading, error, refetch } = useGlobalFetch(
  '/api/endpoint',
  { loadingText: 'Loading...' }
);
```
**Best for:** Loading page data automatically

### Hook 2: useGlobalAsync
```tsx
const execute = useGlobalAsync(
  async () => { /* do something */ },
  'Loading...'
);
await execute();
```
**Best for:** Form submissions, button clicks

---

## Pages to Update (Checklist)

```
HomePage
├─ useGlobalFetch('/api/home/')

AllProductsPage
├─ useGlobalFetch('/api/products/')

ProductDetails
├─ useGlobalFetch(`/api/products/${slug}/`)

CategoriesPage
├─ useGlobalFetch('/api/categories/')

BrandsPage
├─ useGlobalFetch('/api/brands/')

SearchResultsPage
├─ useGlobalFetch(`/api/search/?q=${query}`)

LoginPage
├─ useGlobalAsync(login)

CheckoutPage
├─ useGlobalAsync(createOrder)

OrderHistory
├─ useGlobalFetch('/api/orders/')

Dashboard
├─ useGlobalFetch('/api/dashboard/')
```

---

## 5 Minute Challenge

Try updating one page now:

1. Pick a page (e.g., HomePage)
2. Open the file
3. Import: `import { useGlobalFetch } from '../hooks/useGlobalLoadingIntegration';`
4. Find the fetch call
5. Replace with: `const { data } = useGlobalFetch('/api/endpoint', { loadingText: 'Loading...' })`
6. Done! ✅

Save → Open browser → Navigate to page → See beautiful loading! 🎉

---

## Customization

### Loading Text Ideas
```tsx
'Loading amazing gadgets...'
'Finding perfect products...'
'Searching for items...'
'Processing your order...'
'Verifying credentials...'
'Preparing your dashboard...'
'Fetching order details...'
'Loading your wishlist...'
```

### Manual Control (If Needed)
```tsx
import { useGlobalLoading } from '../hooks/useGlobalLoading';

const { startLoading, stopLoading, setLoadingText } = useGlobalLoading();

startLoading();
setLoadingText('Custom message...');
// Do work...
stopLoading();
```

---

## Troubleshooting

**Q: Animation doesn't appear?**  
A: Make sure page uses `useGlobalFetch` or `useGlobalAsync`

**Q: Text doesn't show?**  
A: Add `loadingText` prop with your message

**Q: Not working on my page?**  
A: Check that `GlobalLoadingProvider` wraps your app (it does - in App.tsx)

**Q: Want different animation?**  
A: Edit `src/hooks/useGlobalLoading.tsx` line with `variant="gradient"` to `variant="pulse"` or other options

---

## 🎯 That's It!

Beautiful global loading is now live throughout your app!

**Next:** Update your pages one by one using the examples above.

**Result:** Professional, consistent, beautiful loading animations everywhere your users wait! 🌟

---

See full guide: `GLOBAL_LOADING_IMPLEMENTATION.md`
