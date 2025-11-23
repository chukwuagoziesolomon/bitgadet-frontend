# Quick Reference Guide - JWT Cart & Payment System

## 🚀 Quick Start (5 Minutes)

### 1. Import Required Services

```typescript
import { cartService } from '../services/cartService';
import { checkoutService } from '../services/checkoutService';
import { paymentService } from '../services/paymentService';
```

### 2. Initialize Cart on App Load

```typescript
// App.tsx
useEffect(() => {
  const token = initializeCartToken();
  console.log('Cart initialized with token:', token);
}, []);
```

### 3. Add to Cart

```typescript
await cartService.addToCart(productId, quantity);
```

---

## 📋 Common Tasks

### Display Cart Badge (Header)

```typescript
const [count, setCount] = useState(0);

useEffect(() => {
  cartService.getCartSummary()
    .then(data => setCount(data.total_items))
    .catch(console.error);
    
  window.addEventListener('cart:updated', updateBadge);
  return () => window.removeEventListener('cart:updated', updateBadge);
}, []);

// In JSX
<span className="badge">{count}</span>
```

### Update Quantity

```typescript
await cartService.updateCart(productId, newQuantity);
window.dispatchEvent(new Event('cart:updated'));
```

### Remove Item

```typescript
await cartService.removeFromCart(productId);
window.dispatchEvent(new Event('cart:updated'));
```

### Get Full Cart

```typescript
const cart = await cartService.getCart();
// Returns: { cart_token, products: [...], total_items, total_amount }
```

---

## 💳 Checkout Flow

### Simple Checkout Form

```typescript
import { UpdatedCheckout } from '../components/UpdatedCheckout';

// Add to router
<Route path="/checkout" element={<UpdatedCheckout />} />
```

### Create Order

```typescript
const response = await checkoutService.createOrder({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+2348012345678',
  address: '123 Main St',
  city: 'Lagos',
  state: 'Lagos',
  country: 'Nigeria',
  postal_code: '100001',
  payment_method: 'bank_transfer', // or 'paystack'
  shipping_method: 'standard', // or 'express'
  coupon_code: 'SAVE10' // or null
  cart_token: cartService.getCartToken()
});

// Save for payment page
checkoutService.saveCheckoutData('current_order', response.order);
checkoutService.saveCheckoutData('payment_info', response.payment_info);
```

### Bank Transfer Payment

```typescript
import PaymentPage from '../components/PaymentPage';

// This component handles:
// - Display bank details
// - Copy to clipboard
// - Poll for payment
// - Show time remaining
```

### Order Success

```typescript
import OrderSuccess from '../components/OrderSuccess';

// Route: /order-success?order_id=ORD-2025-001&email=user@example.com
// This component handles:
// - Display order details
// - Show shipping address
// - Bank transfer reference
// - Account information
```

---

## 🔐 Login with Cart Merge

```typescript
const cartToken = cartService.getCartToken();

const response = await fetch('/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    password,
    cart_token: cartToken // ← IMPORTANT!
  })
});

const data = await response.json();

if (data.token) {
  saveAuthToken(data.token);
  
  // Cart token may be updated
  if (data.cart_token) {
    cartService.setCartToken(data.cart_token);
  }
  
  navigate('/dashboard');
}
```

---

## 🎫 Apply Coupon

```typescript
try {
  const result = await checkoutService.applyCoupon(
    'SAVE10',
    cartService.getCartToken()
  );
  console.log('Discount:', result.discount_percentage);
} catch (error) {
  console.error('Invalid coupon:', error.message);
}
```

---

## ✅ Validation

### Validate Email

```typescript
import { isValidEmail } from '../utils/paymentUtils';

if (!isValidEmail(email)) {
  showError('Invalid email');
}
```

### Validate Phone

```typescript
import { isValidNigerianPhone, formatNigerianPhone } from '../utils/paymentUtils';

if (!isValidNigerianPhone(phone)) {
  showError('Invalid Nigerian phone number');
}

const formatted = formatNigerianPhone(phone);
```

### Validate Checkout Form

```typescript
import { validateCheckoutForm } from '../utils/paymentUtils';

const { valid, errors } = validateCheckoutForm(formData);

if (!valid) {
  // Show errors for each field
  Object.entries(errors).forEach(([field, message]) => {
    console.log(`${field}: ${message}`);
  });
}
```

---

## 📊 Payment Status

### Poll for Bank Transfer Payment

```typescript
const pollingId = paymentService.startPolling('bank', orderId, {
  interval: 30000, // Check every 30 seconds
  maxAttempts: 960, // 8 hours
  onUpdate: (result) => {
    console.log('Status:', result.status);
  },
  onComplete: (result) => {
    if (result.success) {
      navigate(`/order-success?order_id=${orderId}`);
    }
  },
  onError: (error) => {
    console.error('Polling error:', error);
  }
});

// Stop manually if needed
paymentService.stopPolling(pollingId);
```

### Check Payment Manually

```typescript
const status = await checkoutService.getOrderStatus(orderId, email);
// Returns: { status: 'pending' | 'paid' | 'shipped' | ... }
```

---

## 💾 Data Management

### Save Data to Session

```typescript
checkoutService.saveCheckoutData('key', data);
```

### Retrieve Data from Session

```typescript
const data = checkoutService.getCheckoutData('key');
```

### Clear Session Data

```typescript
checkoutService.clearCheckoutData();
```

### Clear Cart

```typescript
await cartService.clearCart();
clearCartToken();
```

---

## 🎨 Format Helpers

### Format Currency

```typescript
import { formatNaira, formatUSDT } from '../utils/paymentUtils';

formatNaira(150000);   // "₦150,000.00"
formatUSDT(100.50);    // "$100.50"
```

### Format Time Remaining

```typescript
import { formatTimeRemaining } from '../utils/paymentUtils';

const time = formatTimeRemaining(expiresAt);
// Returns: "1h 30m 45s"
```

### Copy to Clipboard

```typescript
import { copyToClipboard } from '../utils/paymentUtils';

await copyToClipboard('text to copy');
// Returns: true/false
```

---

## 🚨 Error Handling

### Try-Catch Pattern

```typescript
try {
  const result = await cartService.addToCart(productId, quantity);
} catch (error: any) {
  console.error('Error:', error.message);
  showError('Failed to add to cart', error.message);
}
```

### Global Error Handler

```typescript
window.addEventListener('auth:token-invalid', () => {
  clearAuthToken();
  navigate('/login');
  showError('Session expired');
});
```

---

## 🧪 Testing

### Test Add to Cart

```typescript
// 1. Open product page
// 2. Click "Add to Cart"
// 3. Check: Cart badge updates ✓
// 4. Refresh page
// 5. Check: Cart persists ✓
// 6. Check: localStorage has cartToken ✓
```

### Test Checkout

```typescript
// 1. Go to /checkout
// 2. Fill form and submit
// 3. Check: Form validates required fields ✓
// 4. Check: Order created on backend ✓
// 5. Redirect to payment page ✓
```

### Test Bank Transfer

```typescript
// 1. Go to /payment
// 2. Check: Bank details display ✓
// 3. Check: Copy buttons work ✓
// 4. Check: Timer counts down ✓
// 5. Check: Manual status check works ✓
// 6. Simulate payment
// 7. Check: Auto-detects payment ✓
// 8. Redirect to success page ✓
```

---

## 📁 File Structure

```
src/
├── services/
│   ├── cartService.ts          ← Cart management
│   ├── checkoutService.ts      ← Order creation
│   └── paymentService.ts       ← Payment verification
├── utils/
│   ├── tokenUtils.ts           ← UUID, tokens
│   └── paymentUtils.ts         ← Validation, formatting
├── components/
│   ├── UpdatedCheckout.tsx     ← Checkout form
│   ├── PaymentPage.tsx         ← Bank transfer UI
│   ├── OrderSuccess.tsx        ← Order confirmation
│   └── Navbar.tsx              ← Cart badge
└── config/
    └── api.ts                  ← API config (NO credentials)
```

---

## 🔗 Routes Setup

```typescript
// App.tsx
import UpdatedCheckout from './components/UpdatedCheckout';
import PaymentPage from './components/PaymentPage';
import OrderSuccess from './components/OrderSuccess';

<Routes>
  <Route path="/checkout" element={<UpdatedCheckout />} />
  <Route path="/payment" element={<PaymentPage />} />
  <Route path="/order-success" element={<OrderSuccess />} />
</Routes>
```

---

## 🔑 Environment Variables

```bash
# .env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
```

---

## ⚡ Key Points

1. **No `credentials: 'include'`** - Cart system uses JWT tokens instead
2. **Automatic cart_token handling** - cartService manages it automatically
3. **Cart merges on login** - Send cart_token in login request
4. **Polling is automatic** - PaymentPage handles payment polling
5. **Data persists** - Cart lasts 30 days, orders tracked by ID

---

## 📞 Support

- 📧 Email: support@bitgadgets.com
- 📖 Full Guide: `/IMPLEMENTATION_GUIDE.md`
- 🐛 Issues: GitHub Issues
- 💬 Questions: Check comments in source files

---

**Last Updated:** November 22, 2025
