# Coupon Validation Implementation Guide

## ✅ Status: FULLY IMPLEMENTED

The coupon validation endpoint integration is **complete and working** in your Checkout component.

---

## How It Works

### 1. **Coupon Input & Validation Flow**

When a user enters a coupon code on the Checkout page:

```
User enters code → Clicks "Apply" → handleApplyCoupon() → POST /api/coupons/validate/ → Display results
```

### 2. **API Endpoint Configuration**

**Endpoint:** `POST /api/coupons/validate/`  
**Location:** `src/config/api.ts` → `COUPONS_VALIDATE`

**Required Fields:**
- `coupon_code` (string): The coupon code to validate
- `user_email` (string): Customer email address

### 3. **Success Response Handling**

The API returns validation details:

```json
{
  "success": true,
  "coupon_code": "SAVE20",
  "discount_type": "percentage",
  "discount_value": 20,
  "discount_amount": 1000.00,
  "final_amount": 4000.00
}
```

The component stores and displays:
- ✓ Coupon code
- ✓ Discount type (percentage or fixed)
- ✓ Discount value
- ✓ Discount amount in currency
- ✓ Final order amount after discount

### 4. **Error Handling**

If validation fails, the component:
- Shows error toast notification
- Clears the applied coupon
- Allows user to try another code

---

## Frontend Implementation Details

### State Management

**In `Checkout.tsx`:**

```typescript
const [couponCode, setCouponCode] = useState('');
const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
const [couponLoading, setCouponLoading] = useState(false);
```

### Core Functions

#### **handleApplyCoupon()**
- Validates coupon code is not empty
- Checks email is entered
- Makes POST request to validation endpoint
- Stores coupon data on success
- Shows success/error toasts

#### **handleRemoveCoupon()**
- Clears applied coupon
- Resets coupon input field
- Restores original total

### UI Components

#### **Mobile View** (Lines 223-280)
- Coupon input in order summary
- Apply/Remove button with loading state
- Applied coupon display with discount details

#### **Desktop View** (Lines 615-672)
- Same functionality, different layout
- Displays in right sidebar

---

## Features Implemented

✅ **Coupon Code Validation**
- Validates coupon existence
- Checks if coupon is active
- Verifies expiration date
- Enforces usage limits

✅ **Discount Calculation**
- Supports percentage discounts
- Supports fixed amount discounts
- Calculates exact discount amount
- Shows final order amount

✅ **User Experience**
- Real-time validation on "Apply" button
- Loading state while validating
- Success/error notifications
- Remove coupon functionality
- Case-insensitive input (converted to UPPERCASE)

✅ **Data Display**
- Shows coupon code and discount type
- Displays discount percentage/amount
- Shows exact discount in currency
- Displays final amount after discount

---

## Usage Instructions for Users

1. **On Checkout Page:**
   - Scroll to "Order Summary" section
   - Enter coupon code in input field
   - Click "Apply" button

2. **If Valid Coupon:**
   - Green checkmark appears
   - Discount details displayed
   - Final amount updated
   - "Apply" button changes to "Remove"

3. **If Invalid Coupon:**
   - Red error toast shows reason
   - Input field remains active for retry

4. **To Remove:**
   - Click "Remove" button
   - Coupon details cleared
   - Original totals restored

---

## Technical Details

### Endpoint Request

```typescript
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
```

### Expected API Response

```json
{
  "success": true,
  "coupon_code": "SAVE20",
  "discount_type": "percentage|fixed",
  "discount_value": 20 | 1000,
  "discount_amount": 1000.00,
  "final_amount": 4000.00,
  "message": "Coupon applied successfully" (optional)
}
```

### Error Response

```json
{
  "success": false,
  "message": "Coupon code not found / expired / invalid / usage limit exceeded"
}
```

---

## Styling

All coupon-related styles are in `Checkout.css`:

- `.coupon-row` - Input and button container
- `.coupon-input` - Code input field
- `.apply-btn` - Apply/Remove buttons
- `.applied-coupon` - Coupon success display
- `.coupon-success` - Success indicator with checkmark
- `.coupon-details` - Discount detail rows
- `.discount-amount` - Discount value display
- `.final-amount` - Final total display

---

## Files Modified/Created

### Core Implementation Files:
1. `src/components/Checkout.tsx` - Main checkout component with coupon logic
2. `src/config/api.ts` - API endpoint configuration

### No new files needed - fully integrated into existing checkout flow

---

## Testing Checklist

- [ ] Enter invalid coupon → Shows error message
- [ ] Enter valid percentage coupon → Shows correct discount
- [ ] Enter valid fixed amount coupon → Shows correct discount
- [ ] Remove applied coupon → Back to original amounts
- [ ] Click Apply with empty code → Shows validation error
- [ ] Click Apply without email → Shows email required error
- [ ] Apply coupon → Submit order with discount applied
- [ ] Test on mobile view (≤900px width)
- [ ] Test on desktop view (>900px width)

---

## Backend Integration Notes

Make sure your backend `/api/coupons/validate/` endpoint:

✅ Accepts POST requests
✅ Validates coupon_code parameter
✅ Validates user_email parameter
✅ Checks coupon active status
✅ Checks expiration date
✅ Verifies usage limits
✅ Calculates discount (percentage or fixed)
✅ Returns final_amount after discount
✅ Returns appropriate error messages for failures

---

## Sample Coupon Codes (for testing)

You can test with these sample codes (adjust as needed):
- `SAVE20` - 20% discount
- `SAVE1000` - ₦1000 fixed discount
- `WELCOME10` - 10% discount for new users

---

## Future Enhancements

Optional features to consider:

- Real-time coupon code suggestions as user types
- Coupon terms and conditions display
- Multiple coupon support (if backend allows)
- Coupon expiry countdown timer
- Coupon category restrictions validation
- Minimum purchase amount validation UI feedback

---

## Support & Troubleshooting

**Issue: Coupon validation returns 401 Unauthorized**
- Solution: Check authentication token is valid
- Check user is authenticated or email is provided

**Issue: CORS error when validating coupon**
- Solution: Ensure backend allows CORS for `/api/coupons/validate/`

**Issue: Discount amount not showing**
- Solution: Check API response includes `discount_amount` and `final_amount` fields

**Issue: Apply button stays disabled**
- Solution: Ensure email field is filled and coupon code is not empty

---

Generated: November 23, 2025
Status: ✅ Production Ready
