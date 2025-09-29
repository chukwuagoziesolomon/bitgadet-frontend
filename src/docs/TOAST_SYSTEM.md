# Toast Notification System

The application includes a comprehensive toast notification system for displaying success messages, errors, warnings, and info messages to users.

## Features

- ✅ **Success notifications** - Green toasts for successful actions
- ❌ **Error notifications** - Red toasts for errors and failures  
- ⚠️ **Warning notifications** - Yellow toasts for warnings
- ℹ️ **Info notifications** - Blue toasts for informational messages
- 🎨 **Responsive design** - Works on desktop, tablet, and mobile
- ⏰ **Auto-dismiss** - Toasts automatically disappear after 5 seconds
- 🖱️ **Manual dismiss** - Users can close toasts manually
- 📱 **Mobile-friendly** - Optimized for small screens

## Usage

### Basic Usage

```tsx
import { useToast } from '../hooks/useToast';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleAction = async () => {
    try {
      await apiCall();
      showSuccess('Success!', 'Action completed successfully');
    } catch (error) {
      showError('Error!', 'Something went wrong');
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
};
```

### API Error Handling

```tsx
const handleApiCall = async () => {
  try {
    const response = await apiRequest('/api/endpoint/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    showSuccess('Success', 'Data saved successfully');
  } catch (error: any) {
    // Handle validation errors from API
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      
      // Handle non_field_errors specifically
      if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
        const nonFieldErrors = errors.non_field_errors.join(', ');
        showError('Validation Error', nonFieldErrors);
      } else {
        // Handle field-specific errors
        const errorMessages = Object.values(errors).flat().join(', ');
        showError('Validation Error', errorMessages);
      }
    } else if (error.response?.data?.message) {
      showError('Error', error.response.data.message);
    } else {
      showError('Error', 'An unexpected error occurred. Please try again.');
    }
  }
};
```

### Using the Error Handler Utility

```tsx
import { handleApiError } from '../utils/errorHandler';

const handleApiCall = async () => {
  try {
    await apiRequest('/api/endpoint/');
    showSuccess('Success', 'Operation completed');
  } catch (error) {
    const errorMessage = handleApiError(error, 'API Call');
    showError('Error', errorMessage);
  }
};
```

## Toast Types

### Success Toast
```tsx
showSuccess('Success!', 'Your action was completed successfully');
```

### Error Toast
```tsx
showError('Error!', 'Something went wrong. Please try again.');
```

### Warning Toast
```tsx
showWarning('Warning!', 'Please check your input before proceeding.');
```

### Info Toast
```tsx
showInfo('Info', 'Here is some helpful information.');
```

## Implementation Details

### Components

1. **Toast.tsx** - Individual toast component
2. **ToastContainer.tsx** - Container for managing multiple toasts
3. **useToast.tsx** - React hook for toast management
4. **Toast.css** - Styling for toast notifications

### Integration

The toast system is integrated at the app level in `App.tsx`:

```tsx
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
```

### Styling

Toasts are positioned in the top-right corner on desktop and adapt to mobile screens. They include:

- Smooth slide-in animations
- Color-coded backgrounds and borders
- Icons for each toast type
- Hover effects and transitions
- Responsive design for mobile devices

## Demo

Visit `/toast-demo` to see all toast types in action and get code examples.

## Best Practices

1. **Use appropriate toast types** - Success for positive actions, Error for failures, Warning for caution, Info for general information
2. **Keep messages concise** - Toast messages should be brief and clear
3. **Provide actionable information** - Tell users what they can do next
4. **Handle API errors gracefully** - Use the error handler utility for consistent error messaging
5. **Don't overuse toasts** - Too many toasts can overwhelm users

## Examples in the Codebase

- **AllProductsPage.tsx** - Shows success/error toasts for cart and wishlist actions
- **ContactPage.tsx** - Shows success/error toasts for form submission
- **PhoneTrackingPage.tsx** - Shows error toasts for form validation
- **PhoneSwapPage.tsx** - Shows error toasts for API failures
- **Checkout.tsx** - Shows error toasts for order processing

## Customization

To customize toast appearance, modify the CSS classes in `Toast.css`:

- `.toast-success` - Success toast styling
- `.toast-error` - Error toast styling  
- `.toast-warning` - Warning toast styling
- `.toast-info` - Info toast styling
