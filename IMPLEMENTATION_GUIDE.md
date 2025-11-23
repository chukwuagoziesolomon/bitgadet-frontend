# BitGadgets Frontend Implementation Guide

## JWT-Based Cart System & Pay with Transfer Payment

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Cart System Implementation](#cart-system-implementation)
3. [Checkout & Payment Flow](#checkout--payment-flow)
4. [Component Integration](#component-integration)
5. [API Reference](#api-reference)
6. [Error Handling](#error-handling)
7. [Testing Checklist](#testing-checklist)

---

## Quick Start

### Installation

All required services and utilities have been created. No additional npm packages needed.

### Files Created

**Services:**
- `src/services/cartService.ts` - JWT cart management (NO credentials: 'include')
- `src/services/checkoutService.ts` - Checkout and order management
- `src/services/paymentService.ts` - Payment verification and polling

**Utilities:**
- `src/utils/tokenUtils.ts` - UUID generation, token management
- `src/utils/paymentUtils.ts` - Payment validation, formatting, helpers

**Components:**
- `src/components/PaymentPage.tsx` - Bank transfer payment display
- `src/components/OrderSuccess.tsx` - Order confirmation page

**Styling:**
- `src/components/PaymentPage.css`
- `src/components/OrderSuccess.module.css`

---

## Cart System Implementation

### Initialize Cart on App Load

```typescript
// App.tsx
import { initializeCartToken } from './utils/tokenUtils';
import { cartService } from './services/cartService';

useEffect(() => {
  // Initialize cart token on app load
  initializeCartToken();
  
  // Update cart summary in header
  cartService.getCartSummary().catch(console.error);
}, []);
```

### Add Product to Cart

```typescript
// ProductDetails.tsx or ProductCard.tsx
import { cartService } from '../services/cartService';
import { useToast } from '../hooks/useToast';

const handleAddToCart = async (productId: number, quantity: number = 1) => {
  try {
    const result = await cartService.addToCart(productId, quantity);
    showSuccess('Added to cart', `Total items: ${result.total_items}`);
    updateCartBadge();
  } catch (error: any) {
    showError('Failed to add to cart', error.message);
  }
};

<button onClick={() => handleAddToCart(product.id, 1)}>
  Add to Cart
</button>
```

**Important:** Cart service automatically handles:
- ✅ Generating UUID if no cart token exists
- ✅ Storing cart_token in localStorage
- ✅ Sending cart_token with every request
- ✅ Removing `credentials: 'include'` (moved to JWT)

### Update Cart Badge

```typescript
// Navbar.tsx
import { cartService } from '../services/cartService';

useEffect(() => {
  const updateBadge = async () => {
    try {
      const summary = await cartService.getCartSummary();
      setCartCount(summary.total_items || 0);
    } catch (error) {
      console.error('Failed to update cart badge:', error);
    }
  };

  // Update on mount
  updateBadge();
  
  // Refresh every 30 seconds
  const interval = setInterval(updateBadge, 30000);
  
  // Listen for cart updates
  window.addEventListener('cart:updated', updateBadge);
  
  return () => {
    clearInterval(interval);
    window.removeEventListener('cart:updated', updateBadge);
  };
}, []);

// In your JSX
<div className="cart-badge">{cartCount}</div>
```

### Display Shopping Cart

```typescript
// ShoppingCart.tsx
import { cartService } from '../services/cartService';

useEffect(() => {
  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCartItems(data.products || []);
      setTotal(data.total_amount || 0);
    } catch (error) {
      showError('Failed to load cart', error.message);
    }
  };
  
  loadCart();
}, []);

// Update quantity
const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
  if (newQuantity < 1) {
    return handleRemoveItem(productId);
  }
  
  try {
    await cartService.updateCart(productId, newQuantity);
    dispatchEvent(new Event('cart:updated'));
    loadCart();
  } catch (error) {
    showError('Failed to update quantity', error.message);
  }
};

// Remove item
const handleRemoveItem = async (productId: number) => {
  try {
    await cartService.removeFromCart(productId);
    dispatchEvent(new Event('cart:updated'));
    loadCart();
  } catch (error) {
    showError('Failed to remove item', error.message);
  }
};
```

---

## Checkout & Payment Flow

### Step 1: Checkout Form

```typescript
// Checkout.tsx or new CheckoutForm.tsx
import { checkoutService, CheckoutFormData } from '../services/checkoutService';
import { validateCheckoutForm } from '../utils/paymentUtils';
import { cartService } from '../services/cartService';

const [formData, setFormData] = useState<CheckoutFormData>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'Nigeria',
  postal_code: '',
  payment_method: 'bank_transfer',
  shipping_method: 'standard',
  coupon_code: null,
  cart_token: null
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form
  const { valid, errors } = validateCheckoutForm(formData);
  if (!valid) {
    Object.entries(errors).forEach(([field, message]) => {
      showError(field, message);
    });
    return;
  }
  
  // Add cart token
  const cartToken = cartService.getCartToken();
  const checkoutData: CheckoutFormData = {
    ...formData,
    cart_token: cartToken
  };
  
  try {
    setIsSubmitting(true);
    const response = await checkoutService.createOrder(checkoutData);
    
    if (response.success) {
      // Save data for payment page
      checkoutService.saveCheckoutData('current_order', response.order);
      checkoutService.saveCheckoutData('payment_info', response.payment_info);
      
      // Route based on payment method
      if (formData.payment_method === 'bank_transfer') {
        navigate('/payment', { state: { method: 'bank_transfer' } });
      } else if (formData.payment_method === 'paystack') {
        // Initialize Paystack payment
        initializePaystackPayment(response.payment_info);
      }
    }
  } catch (error: any) {
    showError('Checkout failed', error.message);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Step 2: Bank Transfer Payment Page

```typescript
// PaymentPage.tsx - Already created!
// This component handles:
// ✅ Display bank transfer details
// ✅ Copy-to-clipboard functionality
// ✅ Polling for payment verification
// ✅ Time countdown timer
// ✅ Manual status check button

import PaymentPage from './PaymentPage';

// Route this component at: /payment
```

### Step 3: Order Success Page

```typescript
// OrderSuccess.tsx - Already created!
// This component handles:
// ✅ Display order confirmation
// ✅ Order details and tracking info
// ✅ Bank transfer reference (if applicable)
// ✅ Account information
// ✅ Next steps for customer

import OrderSuccess from './OrderSuccess';

// Route this component at: /order-success?order_id=ORD-2025-001&email=user@example.com
```

### Step 4: Paystack Card Payment

```typescript
// For card payments with Paystack
const initializePaystackPayment = async (paymentInfo: any) => {
  // Get Paystack public key (should be in env or from backend)
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  
  if (!window.PaystackPop) {
    // Load Paystack script if not loaded
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    document.body.appendChild(script);
  }
  
  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: paymentInfo.email,
    amount: Math.round(paymentInfo.amount_to_pay * 100), // Convert to kobo
    ref: paymentInfo.reference,
    onClose: () => {
      showError('Payment cancelled', 'You closed the payment window');
    },
    onSuccess: (response: any) => {
      // Verify payment on backend
      verifyPaystackPayment(response.reference);
    }
  });
  
  handler.openIframe();
};

const verifyPaystackPayment = async (reference: string) => {
  try {
    const response = await paymentService.verifyPaystackPayment(reference);
    
    if (response.success) {
      clearCartToken();
      showSuccess('Payment confirmed!', 'Redirecting...');
      setTimeout(() => {
        navigate(`/order-success?order_id=${orderId}`);
      }, 2000);
    } else {
      showError('Payment verification failed', response.error);
    }
  } catch (error: any) {
    showError('Verification error', error.message);
  }
};
```

---

## Component Integration

### Update LoginPage

**Before (old session-based):**
```typescript
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login/', {
    method: 'POST',
    credentials: 'include', // Old Django session
    body: JSON.stringify({ email, password })
  });
};
```

**After (JWT + cart_token):**
```typescript
import { cartService } from '../services/cartService';
import { getAuthToken, saveAuthToken } from '../utils/tokenUtils';

const handleLogin = async (email: string, password: string) => {
  const cartToken = cartService.getCartToken();
  
  try {
    const response = await fetch(buildApiUrl('/api/auth/login/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        cart_token: cartToken // ← IMPORTANT: Send for cart merge
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.token) {
      // Save auth token
      saveAuthToken(data.token);
      
      // Cart token may be updated on merge
      if (data.cart_token) {
        cartService.setCartToken(data.cart_token);
      }
      
      showSuccess('Login successful!');
      navigate('/dashboard');
    } else {
      showError('Login failed', data.error || 'Invalid credentials');
    }
  } catch (error) {
    showError('Login error', error.message);
  }
};
```

### Update ProductDetails Component

```typescript
import { cartService } from '../services/cartService';
import { useToast } from '../hooks/useToast';

const ProductDetails: React.FC<{ slug: string }> = ({ slug }) => {
  const [quantity, setQuantity] = useState(1);
  const { showSuccess, showError } = useToast();
  
  const handleAddToCart = async () => {
    try {
      const result = await cartService.addToCart(product.id, quantity);
      showSuccess(
        'Added to cart!',
        `${result.total_items} items in your cart`
      );
      
      // Dispatch event to update cart badge
      window.dispatchEvent(new CustomEvent('cart:updated'));
      
      // Optional: Show cart drawer
      // setShowCartDrawer(true);
    } catch (error: any) {
      showError('Failed to add to cart', error.message);
    }
  };
  
  return (
    <div>
      {/* Product details */}
      <div className="quantity-selector">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <input type="number" value={quantity} readOnly />
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
      
      <button onClick={handleAddToCart} className="btn-add-to-cart">
        Add to Cart
      </button>
    </div>
  );
};
```

### Update Navbar Cart Icon

```typescript
import { cartService } from '../services/cartService';

const Navbar: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    // Initial load
    updateCartBadge();
    
    // Listen for cart updates
    window.addEventListener('cart:updated', updateCartBadge);
    
    return () => {
      window.removeEventListener('cart:updated', updateCartBadge);
    };
  }, []);
  
  const updateCartBadge = async () => {
    try {
      const summary = await cartService.getCartSummary();
      setCartCount(summary.total_items || 0);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };
  
  return (
    <nav className="navbar">
      {/* Other navbar items */}
      <Link to="/cart" className="cart-link">
        <ShoppingBag />
        {cartCount > 0 && <span className="badge">{cartCount}</span>}
      </Link>
    </nav>
  );
};
```

---

## API Reference

### Cart Endpoints (No credentials: 'include')

All cart endpoints automatically include `cart_token` via cartService.

```typescript
// Add to cart
await cartService.addToCart(productId, quantity);
// POST /api/cart/add/
// Body: { product_id, quantity, cart_token }

// Get cart
await cartService.getCart();
// GET /api/cart/?cart_token=...

// Update quantity
await cartService.updateCart(productId, newQuantity);
// POST /api/cart/update/
// Body: { product_id, quantity, cart_token }

// Remove item
await cartService.removeFromCart(productId);
// POST /api/cart/remove/
// Body: { product_id, cart_token }

// Get summary
await cartService.getCartSummary();
// GET /api/cart/summary/?cart_token=...

// Clear cart
await cartService.clearCart();
// POST /api/cart/clear/
// Body: { cart_token }
```

### Checkout Endpoints

```typescript
// Create order
await checkoutService.createOrder(formData);
// POST /api/checkout/create/
// Body: CheckoutFormData with cart_token

// Get order status
await checkoutService.getOrderStatus(orderId, email);
// GET /api/checkout/{order_id}/status/?email=...

// Apply coupon
await checkoutService.applyCoupon(code, cartToken);
// POST /api/coupons/apply/
// Body: { coupon_code, cart_token }
```

### Payment Endpoints

```typescript
// Verify Paystack payment
await paymentService.verifyPaystackPayment(reference);
// GET /api/payments/paystack/{reference}/verify/

// Check crypto payment
await paymentService.checkCryptoPaymentStatus(paymentId);
// GET /api/crypto/payments/{payment_id}/status/

// Verify bank transfer
await paymentService.verifyBankTransfer(orderId);
// GET /api/payments/dva/{order_id}/verify/

// Polling for payment verification
const pollingId = paymentService.startPolling('bank', orderId, {
  interval: 30000, // 30 seconds
  maxAttempts: 960, // 8 hours
  onUpdate: (result) => { /* handle update */ },
  onComplete: (result) => { /* handle completion */ },
  onError: (error) => { /* handle error */ }
});

// Stop polling
paymentService.stopPolling(pollingId);
```

---

## Error Handling

### Cart Errors

```typescript
try {
  await cartService.addToCart(productId, quantity);
} catch (error: any) {
  // Possible errors:
  // - "Product matching query does not exist"
  // - "quantity must be at least 1"
  // - "product_id is required"
  showError('Add to cart failed', error.message);
}
```

### Checkout Errors

```typescript
try {
  await checkoutService.createOrder(formData);
} catch (error: any) {
  // Possible errors:
  // - "Invalid email format"
  // - "Requested quantity exceeds available stock"
  // - "Failed to create bank transfer charge"
  showError('Checkout failed', error.message);
}
```

### Global Error Handler

```typescript
// Add to main App.tsx
window.addEventListener('auth:token-invalid', () => {
  // Token expired or invalid
  clearAuthToken();
  navigate('/login');
  showError('Session expired', 'Please login again');
});
```

---

## Testing Checklist

### Cart System
- [ ] Cart persists after page refresh
- [ ] Cart works on different browsers (Chrome, Safari, Firefox, Edge)
- [ ] Cart works on mobile devices
- [ ] Add to cart creates new token if needed
- [ ] Add to cart accumulates quantities (not replaces)
- [ ] Update quantity works correctly
- [ ] Remove item removes from cart
- [ ] Clear cart removes all items
- [ ] Cart badge updates in header
- [ ] Cart items display correctly on cart page

### Checkout & Payment
- [ ] Form validates before submission
- [ ] All required fields are checked
- [ ] Phone number validation works (Nigerian format)
- [ ] Email validation works
- [ ] Coupon code applies correctly
- [ ] Order is created with correct total
- [ ] Bank transfer details display correctly
- [ ] Copy to clipboard works for all fields
- [ ] Time countdown timer updates correctly
- [ ] Manual status check button works

### Payment Verification
- [ ] Payment polling starts automatically
- [ ] Status updates every 30 seconds
- [ ] Success redirects to order confirmation
- [ ] Failed payment shows error message
- [ ] Manual check status works correctly
- [ ] Payment verification works for bank transfer
- [ ] Payment verification works for Paystack card
- [ ] Polling stops after successful/failed payment

### Login & Cart Merge
- [ ] Login with cart_token sends it to backend
- [ ] Cart merges correctly on login
- [ ] Cart token updates if different after merge
- [ ] User can access merged cart after login
- [ ] Logout clears auth token but keeps cart_token

### Order Confirmation
- [ ] Order success page loads correctly
- [ ] Order details display correctly
- [ ] Order ID is shown
- [ ] Customer information is correct
- [ ] Shipping information is displayed
- [ ] Next steps are clear
- [ ] Bank transfer reference shown (if applicable)
- [ ] Action buttons work correctly
- [ ] Can navigate to track order

---

## Key Differences from Old System

| Feature | Old (Django Sessions) | New (JWT + Cart Token) |
|---------|----------------------|----------------------|
| Cart Storage | Django sessions | JWT token in localStorage |
| Cookie Dependency | Yes (`credentials: 'include'`) | No (JWT token) |
| Browser Support | Limited (issues on Safari iOS) | ✅ All browsers |
| Mobile Support | Limited | ✅ All devices |
| Cart Persistence | 30 days (session) | 30 days (backend) |
| Cart Merge on Login | Manual | ✅ Automatic |
| CSRF Token | Required for all requests | Only for authenticated endpoints |

---

## Environment Variables

```bash
# .env file
REACT_APP_API_URL=http://localhost:8000
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx...
```

---

## Support

For issues or questions:
- Email: support@bitgadgets.com
- Documentation: `/docs/IMPLEMENTATION_GUIDE.md`
- GitHub Issues: https://github.com/chukwuagoziesolomon/bitgadet-frontend/issues

---

**Last Updated:** November 22, 2025
**Version:** 1.0.0
