# API Error Handling Implementation Guide

## Overview

The application now has a comprehensive error handling system that displays exact error messages from the API to users. This ensures users understand what went wrong and what they need to do to fix it.

## Key Components

### 1. Error Extraction Function (`utils/errorHandler.ts`)

The `extractErrorMessage()` function handles all API error response formats:

```typescript
export const extractErrorMessage = (responseData: any): string
```

**Supported Error Formats:**
- ✅ `errors` object with `non_field_errors` (validation errors)
- ✅ Field-specific errors (e.g., `email: ['Already in use']`)
- ✅ Nested error objects
- ✅ `detail` field (common DRF format)
- ✅ `message` field
- ✅ `error` field
- ✅ Array error responses

**Example Error Responses Handled:**

```json
{
  "errors": {
    "non_field_errors": ["Current device and desired device cannot be the same"]
  }
}
```

```json
{
  "errors": {
    "email": ["This field is required"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

```json
{
  "detail": "User not found"
}
```

### 2. API Request Functions (`config/api.ts`)

Both `apiRequest()` and `publicApiRequest()` now use the enhanced error extractor:

```typescript
const errorMessage = responseData ? extractErrorMessage(responseData) : `HTTP error! status: ${response.status}`;
```

## Usage in Components

### Before (Manual Error Handling)

```typescript
catch (error: any) {
  let errorMessage = 'Something failed. Please try again.';
  if (error.message) {
    errorMessage = error.message;
  } else if (error.errors) {
    const errorMessages = Object.values(error.errors).flat().join(', ');
    errorMessage = errorMessages;
  }
  showError('Error', errorMessage);
}
```

### After (Using handleApiError)

```typescript
import { handleApiError } from '../utils/errorHandler';

catch (error: any) {
  const errorMessage = handleApiError(error, 'Context');
  showError('Error Title', errorMessage);
}
```

## Components Updated

The following components have been updated to use the new error handler:

1. ✅ **SignUpPage.tsx** - Registration error handling
2. ✅ **LoginPage.tsx** - Login error handling
3. ✅ **ProfileSettings.tsx** - Profile update, password change, account deletion
4. ✅ **Dashboard.tsx** - Stats, orders, wishlist loading
5. ✅ **UpdatedCheckout.tsx** - Coupon application, order creation
6. ✅ **Checkout.tsx** - Order submission, coupon validation
7. ✅ **PhoneSwapPage.tsx** - Phone swap submission
8. ✅ **PhoneTrackingPage.tsx** - Phone tracking submission
9. ✅ **Footer.tsx** - Waitlist subscription
10. ✅ **ContactPage.tsx** - Contact form submission

## Real-World Examples

### Example 1: Device Swap Validation Error

**API Response:**
```json
{
  "errors": {
    "non_field_errors": ["Current device and desired device cannot be the same"]
  }
}
```

**User Sees:**
```
Toast: "Submission Error"
"Current device and desired device cannot be the same"
```

### Example 2: Profile Update Multiple Errors

**API Response:**
```json
{
  "errors": {
    "email": ["This email is already in use"],
    "phone_number": ["Invalid phone number format"]
  }
}
```

**User Sees:**
```
Toast: "Profile update failed"
"This email is already in use, Invalid phone number format"
```

### Example 3: Sign Up Validation

**API Response:**
```json
{
  "errors": {
    "password": ["Password must be at least 8 characters"],
    "email": ["This field is required"]
  }
}
```

**User Sees:**
```
Toast: "Signup Failed"
"Password must be at least 8 characters, This field is required"
```

## Best Practices

### 1. Always Import the Handler

```typescript
import { handleApiError } from '../utils/errorHandler';
```

### 2. Provide Context for Debugging

```typescript
const errorMessage = handleApiError(error, 'PhoneSwap Submission');
```

### 3. Use Consistent Error Titles

```typescript
showError('Title', errorMessage);  // Good
showError('Error', errorMessage);  // Acceptable
showError('Something went wrong with processing your data please try again', errorMessage); // Too long
```

### 4. Always Log the Raw Error

```typescript
catch (error: any) {
  console.error('Failed to save:', error);  // For debugging
  const errorMessage = handleApiError(error, 'Save Operation');
  showError('Save Failed', errorMessage);
}
```

## Error Priority Order

When an API returns multiple error formats, the handler checks in this order:

1. `errors` object (validation errors)
2. `detail` field (DRF standard)
3. `message` field
4. `error` field
5. Array responses
6. Generic fallback message

This ensures the most specific error message is always shown.

## Testing the Error Handler

You can test error handling manually:

```typescript
// In browser console
const testError = {
  response: {
    data: {
      errors: {
        non_field_errors: ["Current device and desired device cannot be the same"]
      }
    }
  }
};
console.log(handleApiError(testError, 'Test'));
```

## Adding New Error Handling to Components

When adding API calls to new components:

1. Import the error handler
2. Use `handleApiError` in catch blocks
3. Pass appropriate context for debugging
4. Show user-friendly error messages via toast

Example:

```typescript
import { handleApiError } from '../utils/errorHandler';
import { useToast } from '../hooks/useToast';

const MyComponent = () => {
  const { showError } = useToast();
  
  const handleAction = async () => {
    try {
      const result = await apiRequest('/api/endpoint/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      // Success handling
    } catch (error: any) {
      console.error('Action failed:', error);
      const errorMessage = handleApiError(error, 'My Action');
      showError('Action Failed', errorMessage);
    }
  };
};
```

## API Configuration Impact

The error extraction function is integrated into `apiRequest()` and `publicApiRequest()` in `config/api.ts`, which means:

- All API calls automatically get detailed error messages
- Error objects have the enhanced message in `error.message`
- Response data is available in `error.response.data` for detailed inspection
- All existing error handlers automatically benefit from the improvement

## Troubleshooting

### Error Message Still Generic

**Problem:** User sees "An unexpected error occurred"

**Solution:** The API response doesn't match expected formats. Check:
1. API response structure in browser DevTools
2. Add the missing error format to `extractErrorMessage()`
3. Add logging: `console.error('Unexpected error format:', responseData)`

### Duplicate Error Messages

**Problem:** Error shown twice (in console and UI)

**Solution:** Remove the console.error call or keep it for debugging only

## Future Enhancements

Potential improvements to consider:

1. **Error Code System** - Map API error codes to specific user-friendly messages
2. **Retry Logic** - Auto-retry certain types of errors (network timeouts)
3. **Error Analytics** - Track common errors to improve UX
4. **Localization** - Translate error messages based on user locale
5. **Field-Level Errors** - Display validation errors per form field

---

**Last Updated:** November 2025  
**Implemented by:** AI Assistant
