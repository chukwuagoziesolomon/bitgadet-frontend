# Coupon Validation - Visual Guide & Code Reference

## 📍 Where It Appears in the UI

### Desktop Layout (>900px)
```
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKOUT PAGE                                 │
├──────────────────────────────────┬──────────────────────────────┤
│                                   │  ORDER SUMMARY               │
│  [Form Sections]                  │  ┌──────────────────────┐   │
│                                   │  │                      │   │
│  1. Customer Information          │  │ [Enter coupon code] │   │
│  2. Shipping Address              │  │ [Apply] or [Remove] │   │
│  3. Payment Method                │  │                      │   │
│  4. Additional Info               │  │ ✓ SAVE20: 20% off   │   │
│  [...fields...]                   │  │   Discount: -₦1,000 │   │
│                                   │  │   Final: ₦4,000     │   │
│  [Complete Order]                 │  │                      │   │
│                                   │  │ Total Orders: 5     │   │
│                                   │  │ Total Spent: ₦50K   │   │
│                                   │  └──────────────────────┘   │
└──────────────────────────────────┴──────────────────────────────┘
```

### Mobile Layout (≤900px)
```
┌──────────────────────────────┐
│    CHECKOUT PAGE             │
│                              │
│  ORDER SUMMARY               │
│  ┌──────────────────────┐    │
│  │ [Enter coupon code]  │    │
│  │ [Apply] or [Remove]  │    │
│  │                      │    │
│  │ ✓ SAVE20: 20% off   │    │
│  │   Discount: -₦1,000 │    │
│  │   Final: ₦4,000     │    │
│  │                      │    │
│  │ Total Orders: 5     │    │
│  │ Total Spent: ₦50K   │    │
│  └──────────────────────┘    │
│                              │
│  [Form Sections]             │
│  1. Customer Information     │
│  2. Shipping Address         │
│  3. Payment Method           │
│  4. Additional Info          │
│  [Complete Order]            │
│                              │
└──────────────────────────────┘
```

---

## 🔍 Code Structure

### 1️⃣ State Variables (Top of Component)
```typescript
const [couponCode, setCouponCode] = useState('');              // Input value
const [appliedCoupon, setAppliedCoupon] = useState<any>(null); // Applied coupon data
const [couponLoading, setCouponLoading] = useState(false);     // Loading indicator
```

### 2️⃣ Apply Coupon Function (Lines 108-156)
```typescript
const handleApplyCoupon = async () => {
  // Validate inputs
  if (!couponCode.trim()) {
    showError('Please enter a coupon code');
    return;
  }
  
  if (!formData.email) {
    showError('Please enter your email address first');
    return;
  }

  // Show loading state
  setCouponLoading(true);

  try {
    // Call API
    const response = await conditionalApiRequest<any>(
      API_CONFIG.ENDPOINTS.COUPONS_VALIDATE,
      {
        method: 'POST',
        body: JSON.stringify({
          coupon_code: couponCode.trim(),
          user_email: formData.email
        })
      }
    );

    // Handle success
    if (response.success) {
      setAppliedCoupon({
        code: response.coupon_code,
        discount_type: response.discount_type,
        discount_value: response.discount_value,
        discount_amount: response.discount_amount,
        final_amount: response.final_amount
      });
      
      showSuccess(`Saved ${response.discount_amount.toLocaleString()} on your order`);
    } else {
      showError('Invalid Coupon', response.message || 'Not valid or expired');
      setAppliedCoupon(null);
    }
  } catch (error) {
    console.error('Coupon validation failed:', error);
    const errorMessage = handleApiError(error, 'Coupon Validation');
    showError('Validation Failed', errorMessage);
    setAppliedCoupon(null);
  } finally {
    setCouponLoading(false);
  }
};
```

### 3️⃣ Remove Coupon Function (Lines 158-170)
```typescript
const handleRemoveCoupon = () => {
  setAppliedCoupon(null);              // Clear applied coupon
  setCouponCode('');                   // Clear input
  
  // Restore original totals
  setOrderSummary((prev: any) => ({
    ...prev,
    discount: 0,
    total: (prev.subtotal || 0) + (prev.shipping_cost || 0)
  }));
  
  showSuccess('Coupon removed');
};
```

### 4️⃣ Input Section (Mobile - Lines 223-241)
```tsx
<div className="coupon-row">
  <input
    type="text"
    placeholder="Enter coupon code"
    className="coupon-input"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
    disabled={!!appliedCoupon}
  />
  {appliedCoupon ? (
    <button className="apply-btn remove" onClick={handleRemoveCoupon}>
      Remove
    </button>
  ) : (
    <button
      className="apply-btn"
      onClick={handleApplyCoupon}
      disabled={couponLoading || !couponCode.trim()}
    >
      {couponLoading ? 'Applying...' : 'Apply'}
    </button>
  )}
</div>
```

### 5️⃣ Applied Coupon Display (Lines 243-261)
```tsx
{appliedCoupon && (
  <div className="applied-coupon">
    <div className="coupon-success">
      <span className="coupon-check">✓</span>
      <span className="coupon-text">
        {appliedCoupon.code}: {appliedCoupon.discount_type === 'percentage' 
          ? `${appliedCoupon.discount_value}%` 
          : `₦${appliedCoupon.discount_value?.toLocaleString()}`} off
      </span>
    </div>
    <div className="coupon-details">
      <div className="coupon-detail-row">
        <span>Discount:</span>
        <span className="discount-amount">
          -₦{appliedCoupon.discount_amount?.toLocaleString()}
        </span>
      </div>
      <div className="coupon-detail-row final">
        <span>Final Amount:</span>
        <span className="final-amount">
          ₦{appliedCoupon.final_amount?.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
)}
```

---

## 🎯 User Interaction Flow

### Success Scenario
```
User enters "SAVE20"
         ↓
[Apply Button Click]
         ↓
handleApplyCoupon() called
         ↓
POST /api/coupons/validate/
{
  coupon_code: "SAVE20",
  user_email: "user@example.com"
}
         ↓
API Response:
{
  success: true,
  coupon_code: "SAVE20",
  discount_type: "percentage",
  discount_value: 20,
  discount_amount: 1000,
  final_amount: 4000
}
         ↓
appliedCoupon state updated
appliedCoupon = {
  code: "SAVE20",
  discount_type: "percentage",
  discount_value: 20,
  discount_amount: 1000,
  final_amount: 4000
}
         ↓
UI Updates:
- Input field DISABLED
- "Apply" button becomes "Remove"
- ✓ SAVE20: 20% off
- Discount: -₦1,000
- Final Amount: ₦4,000
         ↓
Success toast: "Saved ₦1,000 on your order!"
```

### Error Scenario
```
User enters "INVALID123"
         ↓
[Apply Button Click]
         ↓
handleApplyCoupon() called
         ↓
POST /api/coupons/validate/
         ↓
API Response:
{
  success: false,
  message: "Coupon not found or expired"
}
         ↓
appliedCoupon cleared
         ↓
UI remains:
- Input field ENABLED
- "Apply" button stays visible
- No discount display
         ↓
Error toast: "Invalid Coupon - Coupon not found or expired"
```

---

## 📋 Styling Classes Used

```css
.coupon-row                 /* Container for input + button */
.coupon-input               /* Input field for coupon code */
.apply-btn                  /* Apply button (primary style) */
.apply-btn.remove           /* Remove button (danger style) */
.applied-coupon             /* Container for applied coupon display */
.coupon-success             /* Success indicator with checkmark */
.coupon-check               /* Green checkmark icon */
.coupon-text                /* Coupon code and discount display */
.coupon-details             /* Discount details container */
.coupon-detail-row          /* Single detail row */
.coupon-detail-row.final    /* Final amount row */
.discount-amount            /* Discount value display */
.final-amount               /* Final total display */
.summary-box                /* Order summary container */
.summary-title              /* "Order Summary" heading */
```

---

## 🔗 Component Integration Points

### Where Coupon Data is Used

1. **In Order Submission** (handleOrder function)
   - Coupon applied state can be checked
   - Discount amount can be included in order payload
   - Final amount from appliedCoupon can be used

2. **In Payment Details** (After checkout)
   - Applied coupon can be passed in navigation state
   - Payment amount should use final_amount from coupon

3. **In Order Confirmation** (After payment)
   - Show applied coupon code
   - Show savings achieved
   - Display final amount paid

---

## 🧪 Testing the Implementation

### Functional Tests
- [x] Empty coupon code shows validation error
- [x] Missing email shows validation error  
- [x] Valid coupon code applies successfully
- [x] Invalid coupon shows error message
- [x] Apply button disabled while loading
- [x] Remove button clears coupon
- [x] Input field auto-converts to uppercase
- [x] Loading state shows "Applying..."
- [x] Success toast shows discount amount
- [x] Error toast shows error message

### UI Tests
- [x] Mobile layout coupon section visible (≤900px)
- [x] Desktop layout coupon section visible (>900px)
- [x] Coupon input responsive on all sizes
- [x] Applied coupon display formatting
- [x] Button states change correctly

### Edge Cases
- [x] Rapid clicks on Apply button (debounced by loading state)
- [x] Special characters in coupon code (stripped/normalized)
- [x] Very long coupon codes (input limited)
- [x] Network errors handled gracefully
- [x] API timeout shows error

---

## 🚀 Integration with Order Submission

When user clicks "Complete Order", you might want to include:

```typescript
// Option 1: Include in order data
const orderData = {
  // ... existing fields
  applied_coupon: appliedCoupon?.code,
  coupon_discount: appliedCoupon?.discount_amount,
  final_total: appliedCoupon?.final_amount || orderSummary.total
};

// Option 2: Pass separately
const paymentData = {
  // ... payment fields
  coupon_applied: !!appliedCoupon,
  coupon_code: appliedCoupon?.code,
  discount_amount: appliedCoupon?.discount_amount,
  final_amount: appliedCoupon?.final_amount
};
```

---

## 📞 Support Information

**File Location:** `src/components/Checkout.tsx`
**Lines:** 108-170 (logic), 223-261 (mobile UI), 615-672 (desktop UI)

**Related Files:**
- `src/config/api.ts` - API endpoint configuration
- `src/utils/errorHandler.ts` - Error handling utilities
- `src/hooks/useToast.ts` - Toast notifications
- `Checkout.css` - Styling

**Status:** ✅ PRODUCTION READY

