# 🎣 Loading Hooks Guide

Complete set of custom React hooks for managing loading states throughout your application.

---

## 📚 Available Hooks

### 1. `useLoading()` - Simple Loading State
Most basic hook for managing loading state with delay and minimum duration options.

```tsx
import { useLoading } from './hooks/useLoading';

function MyComponent() {
  const { isLoading, setLoading, startLoading, stopLoading } = useLoading({
    delay: 300,           // Delay before showing loader
    minDuration: 500,     // Minimum time to show loader
  });

  const handleClick = async () => {
    startLoading();
    try {
      await someAsync();
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <button onClick={handleClick}>Load</button>
    </>
  );
}
```

#### Methods
- `setLoading(boolean)` - Set loading state
- `startLoading()` - Start loading
- `stopLoading()` - Stop loading
- `cleanup()` - Clean up timeouts

#### Options
- `delay` - Delay before showing loader (default: 0)
- `minDuration` - Minimum time to show loader (default: 0)

---

### 2. `useAsync()` - Async Operations
Perfect for handling async functions with automatic loading state.

```tsx
import { useAsync } from './hooks/useLoading';
import LoadingSpinner from './components/LoadingSpinner';

function ProductsPage() {
  const { isLoading, error, execute } = useAsync(
    () => fetch('/api/products').then(r => r.json()),
    {
      delay: 300,
      minDuration: 500,
      onSuccess: (data) => console.log('Loaded:', data),
      onError: (error) => console.error('Failed:', error),
    }
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render content */}</div>;
}
```

#### Methods
- `execute()` - Execute the async function
- `clearError()` - Clear error state

#### Options
- `onSuccess` - Callback on success
- `onError` - Callback on error
- `delay` - Delay before showing loader
- `minDuration` - Minimum time to show loader

---

### 3. `useMultiLoading()` - Multiple Loading States
Manage multiple independent loading states at once.

```tsx
import { useMultiLoading } from './hooks/useLoading';
import LoadingSpinner from './components/LoadingSpinner';

function Dashboard() {
  const { isLoading, isLoadingAny, isLoadingAll, loadingStates, setLoading } = 
    useMultiLoading(['sidebar', 'content', 'widgets']);

  useEffect(() => {
    // Load sidebar
    setLoading('sidebar', true);
    fetchSidebar().finally(() => setLoading('sidebar', false));

    // Load content
    setLoading('content', true);
    fetchContent().finally(() => setLoading('content', false));

    // Load widgets
    setLoading('widgets', true);
    fetchWidgets().finally(() => setLoading('widgets', false));
  }, [setLoading]);

  return (
    <div>
      {loadingStates.sidebar && <LoadingSpinner size="small" />}
      {loadingStates.content && <LoadingSpinner />}
      {loadingStates.widgets && <LoadingSpinner />}

      {/* Show overlay if any is loading */}
      {isLoadingAny(['content', 'widgets']) && (
        <LoadingSpinner fullScreen overlay variant="gradient" />
      )}
    </div>
  );
}
```

#### Methods
- `setLoading(key, boolean)` - Set specific loading state
- `setAllLoading(boolean)` - Set all loading states
- `startAll()` - Start all loading states
- `stopAll()` - Stop all loading states
- `isLoadingAny(keys)` - Check if any of given keys are loading
- `isLoadingAll(keys)` - Check if all of given keys are loading

#### Properties
- `isLoading` - True if any loading state is true
- `loadingStates` - Object with all loading states
- `isLoadingAny(keys)` - Function to check multiple states
- `isLoadingAll(keys)` - Function to check all states

---

### 4. `useAbortController()` - Request Cancellation
Cancel fetch requests on component unmount or manually.

```tsx
import { useAbortController } from './hooks/useLoading';

function CancelableRequest() {
  const { signal, abort, cleanup } = useAbortController();

  useEffect(() => {
    const controller = new AbortController();
    
    fetch('/api/long-running', { signal })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Request cancelled');
        }
      });

    return () => {
      abort(); // Cancel on unmount
      cleanup(); // Reset controller
    };
  }, [signal, abort, cleanup]);

  return <div>Loading...</div>;
}
```

#### Methods
- `abort()` - Abort current request
- `cleanup()` - Cleanup and reset controller

#### Properties
- `signal` - AbortSignal to pass to fetch

---

### 5. `useFetch()` - Complete Data Fetching
All-in-one hook combining loading state, error handling, and cancellation.

```tsx
import { useFetch } from './hooks/useLoading';
import LoadingSpinner from './components/LoadingSpinner';

function ProductsList() {
  const { data, isLoading, error, refetch } = useFetch(
    '/api/products',
    {
      delay: 300,
      minDuration: 500,
      dependencies: [productCategory], // Re-fetch on change
      onSuccess: (data) => console.log('Loaded:', data),
      onError: (error) => console.error('Failed:', error),
    }
  );

  if (isLoading) return <LoadingSpinner variant="pulse" />;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

#### Methods
- `refetch()` - Manually trigger refetch

#### Options
- `dependencies` - Array of dependencies for refetch
- `onSuccess` - Callback on success
- `onError` - Callback on error
- `delay` - Delay before showing loader
- `minDuration` - Minimum time to show loader

#### Properties
- `data` - Fetched data
- `isLoading` - Loading state
- `error` - Error object if any
- `refetch` - Function to manually refetch

---

## 💡 Real-World Examples

### Example 1: Product Page with Form Submission
```tsx
import { useState } from 'react';
import { useAsync } from './hooks/useLoading';
import LoadingSpinner from './components/LoadingSpinner';

function ProductForm() {
  const [formData, setFormData] = useState({});
  
  const { isLoading, error, execute } = useAsync(
    () => fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(formData),
    }).then(r => r.json()),
    {
      minDuration: 1000,
      onSuccess: () => alert('Product added!'),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        disabled={isLoading}
      />
      {error && <div className="error">{error.message}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? <LoadingSpinner size="small" text="" /> : 'Add Product'}
      </button>
    </form>
  );
}
```

### Example 2: Multi-Step Form with Independent Loaders
```tsx
import { useMultiLoading } from './hooks/useLoading';

function CheckoutFlow() {
  const { loadingStates, setLoading } = useMultiLoading([
    'validateEmail',
    'calculateShipping',
    'processPayment'
  ]);

  const handleEmailValidation = async (email: string) => {
    setLoading('validateEmail', true);
    try {
      await validateEmail(email);
    } finally {
      setLoading('validateEmail', false);
    }
  };

  return (
    <div>
      <div>
        Email validation: {loadingStates.validateEmail && <LoadingSpinner size="small" />}
      </div>
      <div>
        Shipping: {loadingStates.calculateShipping && <LoadingSpinner size="small" />}
      </div>
      <div>
        Payment: {loadingStates.processPayment && <LoadingSpinner size="small" />}
      </div>
    </div>
  );
}
```

### Example 3: Dynamic Data with Refetch
```tsx
import { useFetch } from './hooks/useLoading';

function Dashboard() {
  const [category, setCategory] = useState('all');
  
  const { data: products, isLoading, refetch } = useFetch(
    `/api/products?category=${category}`,
    {
      minDuration: 1000,
      dependencies: [category], // Refetch when category changes
    }
  );

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>All</option>
        <option>Electronics</option>
        <option>Clothing</option>
      </select>

      {isLoading && <LoadingSpinner variant="pulse" />}

      {products?.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}

      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Example 4: Infinite Scroll with useAsync
```tsx
import { useAsync } from './hooks/useLoading';
import { useEffect, useRef } from 'react';

function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);

  const { isLoading, execute } = useAsync(
    () => fetch(`/api/items?page=${page}`).then(r => r.json()),
    {
      onSuccess: (data) => setItems(prev => [...prev, ...data]),
    }
  );

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading) {
        setPage(p => p + 1);
        execute();
      }
    });

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isLoading, execute]);

  return (
    <div>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
      <div ref={observerTarget}>
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
}
```

---

## ✅ Best Practices

### 1. Always Use Cleanup
```tsx
useEffect(() => {
  // ...
  return cleanup; // Important for abort controller
}, [cleanup]);
```

### 2. Set Appropriate Delays
```tsx
// For quick operations
const { isLoading } = useLoading({ minDuration: 300 });

// For longer operations
const { isLoading } = useLoading({ delay: 500, minDuration: 1000 });
```

### 3. Handle Errors Gracefully
```tsx
const { isLoading, error, execute } = useAsync(fetchFn, {
  onError: (error) => {
    // Show toast, log to Sentry, etc.
    toast.error(error.message);
  },
});
```

### 4. Use Correct Hook for Scenario
- Simple: `useLoading`
- Async: `useAsync`
- Multiple: `useMultiLoading`
- Cancellable: `useAbortController`
- Data fetching: `useFetch`

---

## 🧪 Testing

```tsx
import { renderHook, act } from '@testing-library/react';
import { useLoading } from './hooks/useLoading';

test('useLoading starts and stops', () => {
  const { result } = renderHook(() => useLoading());

  act(() => result.current.startLoading());
  expect(result.current.isLoading).toBe(true);

  act(() => result.current.stopLoading());
  expect(result.current.isLoading).toBe(false);
});
```

---

## 📊 Performance Tips

1. **Use dependencies carefully**
   ```tsx
   const { data } = useFetch(url, {
     dependencies: [filter], // Only refetch when filter changes
   });
   ```

2. **Cancel requests on unmount**
   ```tsx
   useEffect(() => {
     return cleanup; // Automatically cancels pending requests
   }, [cleanup]);
   ```

3. **Avoid unnecessary re-renders**
   ```tsx
   // ✅ Good
   const { isLoading } = useLoading();

   // ❌ Bad - causes re-renders
   const [isLoading, setIsLoading] = useState(false);
   ```

---

**Version:** 1.0.0  
**Last Updated:** November 22, 2025
