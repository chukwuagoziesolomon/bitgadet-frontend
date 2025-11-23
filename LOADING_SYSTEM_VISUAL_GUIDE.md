# 🎨 Loading System - Visual Reference Guide

Quick visual guide for using LoadingSpinner and loading hooks throughout your application.

---

## 🎯 Variant Selection Guide

### Choose Your Variant Based on Use Case

```
┌─────────────────────────────────────────────────────────────────┐
│                   ANIMATION VARIANTS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ DEFAULT ⭕              PULSE 📡               BOUNCE ⚽         │
│ Rotating circle         Expanding rings       Bouncing balls     │
│ ✅ Professional         ✅ Elegant            ✅ Playful        │
│ Use: General purpose    Use: Components       Use: Friendly UI  │
│                                                                   │
│ DOTS 🔵                GRADIENT ✨            SHIMMER 📝         │
│ Animated dots          Rotating gradient     Skeleton effect    │
│ ✅ Minimal             ✅ Eye-catching       ✅ Placeholders    │
│ Use: Compact UI        Use: Full screen      Use: Content load  │
│                        ⭐ Most Stunning!                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📏 Size Guide

```
SMALL (40x40px)              MEDIUM (60x60px)             LARGE (80x80px)
┌─────────────┐              ┌──────────────┐             ┌──────────────┐
│  [loader]   │              │   [loader]   │             │   [loader]   │
│  "Saving"   │              │  "Loading"   │             │  "Loading"   │
└─────────────┘              └──────────────┘             └──────────────┘

Use: Buttons,              Use: Components,           Use: Full screen,
inline elements            modals, cards              hero sections
```

---

## 🎯 Component Usage Patterns

### Pattern 1: Page Loading
```tsx
┌─────────────────────────────────────────────────┐
│                  Page Loading                    │
├─────────────────────────────────────────────────┤
│                                                  │
│         {isLoading && (                         │
│           <LoadingSpinner                       │
│             fullScreen                          │
│             overlay                             │
│             variant="gradient"                  │
│             text="Loading dashboard..."         │
│           />                                    │
│         )}                                      │
│                                                  │
│         {!isLoading && <Dashboard />}           │
│                                                  │
└─────────────────────────────────────────────────┘

✅ Use When:
- Initial page load
- Route transition
- Major content refresh
- Switching between views

✅ Variant: gradient
✅ Size: large
✅ fullScreen: true
✅ overlay: true
```

### Pattern 2: Component Loading
```tsx
┌─────────────────────────────────────────────────┐
│              Component Loading                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  <div className="product-list">                 │
│    {isLoading ? (                               │
│      <LoadingSpinner                            │
│        variant="pulse"                          │
│        size="medium"                            │
│        text="Loading products..."               │
│      />                                         │
│    ) : (                                        │
│      <ProductsList products={data} />           │
│    )}                                           │
│  </div>                                         │
│                                                  │
└─────────────────────────────────────────────────┘

✅ Use When:
- Component data loading
- Modal content loading
- Card loading
- List items loading

✅ Variant: pulse
✅ Size: medium
✅ fullScreen: false
```

### Pattern 3: Button/Form Loading
```tsx
┌─────────────────────────────────────────────────┐
│            Button/Form Loading                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  <button disabled={isSubmitting}>               │
│    {isSubmitting ? (                            │
│      <>                                         │
│        <LoadingSpinner                          │
│          size="small"                           │
│          text=""                                │
│        />                                       │
│        {' '}Submitting...                       │
│      </>                                        │
│    ) : (                                        │
│      'Submit'                                   │
│    )}                                           │
│  </button>                                      │
│                                                  │
└─────────────────────────────────────────────────┘

✅ Use When:
- Form submission
- Button action
- Inline state change
- Quick operations

✅ Variant: default or dots
✅ Size: small
✅ text: "" (empty)
```

### Pattern 4: Skeleton Loading
```tsx
┌─────────────────────────────────────────────────┐
│          Skeleton/Content Loading                │
├─────────────────────────────────────────────────┤
│                                                  │
│  <div className="content-wrapper">              │
│    {isLoading ? (                               │
│      <LoadingSpinner                            │
│        variant="shimmer"                        │
│        text="Building your page..."             │
│      />                                         │
│    ) : (                                        │
│      <PageContent data={data} />                │
│    )}                                           │
│  </div>                                         │
│                                                  │
└─────────────────────────────────────────────────┘

✅ Use When:
- Content placeholder
- Skeleton screens
- Dynamic content
- Data table loading

✅ Variant: shimmer
✅ Size: medium
```

---

## 🎣 Hooks Usage Patterns

### Hook 1: useLoading
```
┌─────────────────────────────────────────────────┐
│         Simple Loading State                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  const { isLoading, setLoading } = useLoading() │
│                                                  │
│  button onClick={() => {                        │
│    setLoading(true)                             │
│    doSomething().finally(                       │
│      () => setLoading(false)                    │
│    )                                            │
│  }                                              │
│                                                  │
│  ✅ Simple operations                           │
│  ✅ Custom logic                                │
│  ❌ Error handling                              │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Hook 2: useAsync
```
┌─────────────────────────────────────────────────┐
│      Async Operations with Auto Loading         │
├─────────────────────────────────────────────────┤
│                                                  │
│  const { isLoading, error, execute } =          │
│    useAsync(asyncFunction)                      │
│                                                  │
│  button onClick={execute}                       │
│                                                  │
│  ✅ Async functions                             │
│  ✅ Error handling                              │
│  ✅ Automatic loading state                     │
│  ❌ Multiple parallel operations                │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Hook 3: useMultiLoading
```
┌─────────────────────────────────────────────────┐
│    Multiple Independent Loading States          │
├─────────────────────────────────────────────────┤
│                                                  │
│  const { loadingStates, setLoading } =          │
│    useMultiLoading(['form', 'upload', 'data'])  │
│                                                  │
│  {loadingStates.form && <Loader />}             │
│  {loadingStates.upload && <Loader />}           │
│  {loadingStates.data && <Loader />}             │
│                                                  │
│  ✅ Multiple parallel loads                     │
│  ✅ Independent control                         │
│  ✅ Track each separately                       │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Hook 4: useFetch
```
┌─────────────────────────────────────────────────┐
│      Complete Data Fetching Solution            │
├─────────────────────────────────────────────────┤
│                                                  │
│  const { data, isLoading, error, refetch } =    │
│    useFetch('/api/products')                    │
│                                                  │
│  {isLoading && <Loader />}                      │
│  {error && <Error />}                           │
│  {data && <Content data={data} />}              │
│  <button onClick={refetch}>Refresh</button>     │
│                                                  │
│  ✅ Automatic fetching                          │
│  ✅ Error handling                              │
│  ✅ Refetch capability                          │
│  ✅ Dependency management                       │
│  ✅ Request cancellation                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 📝 Code Snippet Reference

### Quick Copy-Paste Examples

#### Full Screen Loading
```tsx
<LoadingSpinner fullScreen overlay variant="gradient" text="Loading..." />
```

#### Component Loading
```tsx
{isLoading ? <LoadingSpinner variant="pulse" /> : <Content />}
```

#### Button Loading
```tsx
<button disabled={isLoading}>
  {isLoading ? <LoadingSpinner size="small" text="" /> : 'Click'}
</button>
```

#### Fetch Data
```tsx
const { data, isLoading } = useFetch('/api/products');
return isLoading ? <LoadingSpinner /> : <List data={data} />;
```

#### Async Operation
```tsx
const { isLoading, execute } = useAsync(myAsyncFunction);
return <button onClick={execute}>Action</button>;
```

---

## 🎯 Decision Tree

```
                          Need Loading?
                               |
                    ┌──────────┴──────────┐
                    |                     |
                  YES                    NO
                    |              (Don't use)
                    |
         What kind of loading?
                    |
        ┌───────────┼───────────┐
        |           |           |
     Data       Button/Form   Component
     Load       Submit        Content
        |           |           |
        ▼           ▼           ▼
    useFetch   useAsync     useLoading
        |           |           |
        ▼           ▼           ▼
   Full Page?   Inline?    Overlay?
    /modal?    /Quick?      /Modal?
        |           |           |
        ▼           ▼           ▼
    gradient      dots       pulse
   fullScreen    size=small  size=md
```

---

## 📊 Comparison Table

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   Feature    │   Pattern    │   Variant    │    Hook      │
├──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │              │
│ Page load    │ Full screen  │ gradient     │ useFetch/    │
│              │ overlay      │ (large)      │ useAsync     │
│              │              │              │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │              │
│ List load    │ Centered     │ pulse        │ useFetch     │
│              │ component    │ (medium)     │              │
│              │              │              │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │              │
│ Form submit  │ Button       │ default      │ useAsync     │
│              │ with text    │ (small)      │              │
│              │              │              │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │              │
│ Skeleton     │ Centered     │ shimmer      │ useFetch     │
│              │ component    │ (medium)     │              │
│              │              │              │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│              │              │              │              │
│ Quick action │ Replace text │ dots         │ useAsync     │
│              │ / inline     │ (small)      │              │
│              │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## ✅ Checklist Before Using

Before adding LoadingSpinner to a component:

- [ ] Choose appropriate variant (check guide)
- [ ] Choose appropriate size (small/medium/large)
- [ ] Decide: fullScreen or inline?
- [ ] Decide: with or without overlay?
- [ ] Write meaningful loading text
- [ ] Choose appropriate hook (useLoading/useAsync/useFetch)
- [ ] Handle errors gracefully
- [ ] Test on mobile view
- [ ] Verify animations smooth
- [ ] Test loading text is clear

---

## 🚀 Implementation Steps

```
Step 1: Choose Pattern
  ├─ Page load? → Pattern 1
  ├─ Component? → Pattern 2
  ├─ Button?    → Pattern 3
  └─ Skeleton?  → Pattern 4

Step 2: Pick Variant & Size
  ├─ Full screen → gradient (large)
  ├─ Component   → pulse (medium)
  ├─ Button      → default/dots (small)
  └─ Skeleton    → shimmer (medium)

Step 3: Select Hook
  ├─ Data load  → useFetch
  ├─ Form sub   → useAsync
  ├─ Custom     → useLoading
  └─ Multiple   → useMultiLoading

Step 4: Implement
  ├─ Import component/hook
  ├─ Add JSX
  ├─ Set loading states
  └─ Test

Step 5: Verify
  ├─ Loader shows
  ├─ Animations smooth
  ├─ Mobile works
  └─ Text is clear
```

---

## 🎓 Learning Path

```
Beginner Path:
1. View demo: /loading-demo
2. Read: LOADING_SPINNER_INTEGRATION.md (5 min)
3. Copy: Pattern 2 (component loading)
4. Test: In your component
5. Adapt: Other patterns

Intermediate Path:
1. Read: LOADING_SPINNER_GUIDE.md (15 min)
2. Learn: All 6 variants
3. Learn: useFetch hook
4. Implement: Page loading
5. Implement: Form submission

Advanced Path:
1. Read: LOADING_HOOKS_GUIDE.md (20 min)
2. Master: All 5 hooks
3. Implement: useAsync with error handling
4. Implement: useMultiLoading for complex flows
5. Implement: Custom loading orchestration
```

---

## 📞 Quick Help

**Q: Which variant is most eye-catching?**
A: `gradient` - perfect for full screen loading

**Q: How do I fetch data easily?**
A: Use `useFetch('/api/endpoint')` hook

**Q: What about errors?**
A: All hooks return `error` property - check it!

**Q: Is it mobile friendly?**
A: Yes - fully responsive

**Q: Can I customize it?**
A: Yes - update LoadingSpinner.css

**Q: Performance concerns?**
A: No - CSS animations are GPU accelerated

---

**Remember:** 
- Simple page load → `<LoadingSpinner fullScreen overlay variant="gradient" />`
- Fetch data → `const { data, isLoading } = useFetch('/api/data')`
- Async action → `const { isLoading, execute } = useAsync(action)`

---

**Created:** November 22, 2025  
**Version:** 1.0.0  
**Type:** Visual Reference Guide
