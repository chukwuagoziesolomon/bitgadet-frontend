/**
 * Payment utility functions for frontend
 */

/**
 * Bank Transfer Account Details
 */
export interface BankAccountDetails {
  account_number: string;
  account_name: string;
  bank_name: string;
  amount_to_pay: number;
  instructions: string;
  expires_at: string;
  expires_in: string;
  provider: string;
  reference: string;
}

/**
 * Calculate time remaining until expiry
 */
export const calculateTimeRemaining = (expiresAt: string): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  expired: boolean;
} => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const difference = expiry.getTime() - now.getTime();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, expired: true };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalSeconds, expired: false };
};

/**
 * Format time remaining as human-readable string
 */
export const formatTimeRemaining = (expiresAt: string): string => {
  const { hours, minutes, seconds, expired } = calculateTimeRemaining(expiresAt);

  if (expired) {
    return 'Expired';
  }

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || 'Expiring...';
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('✅ Copied to clipboard:', text);
    return true;
  } catch (error) {
    console.error('❌ Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Validate Nigerian phone number
 */
export const isValidNigerianPhone = (phone: string): boolean => {
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's a valid Nigerian number
  // Nigeria country code: 234, or local format: 070x-0913
  return /^(234|0)\d{10}$/.test(cleaned);
};

/**
 * Format Nigerian phone number
 */
export const formatNigerianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('234')) {
    // International format: 234xxxxxxxxxx -> +234 xxx xxx xxxx
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  if (cleaned.startsWith('0')) {
    // Local format: 0xxxxxxxxxx -> 070x xxx xxxx
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate form data
 */
export const validateCheckoutForm = (formData: any): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!formData.first_name?.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!isValidEmail(formData.email)) {
    errors.email = 'Valid email is required';
  }

  if (!isValidNigerianPhone(formData.phone)) {
    errors.phone = 'Valid Nigerian phone number is required';
  }

  if (!formData.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!formData.country?.trim()) {
    errors.country = 'Country is required';
  }

  if (!formData.payment_method) {
    errors.payment_method = 'Payment method is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get payment method display name
 */
export const getPaymentMethodName = (method: string): string => {
  const names: Record<string, string> = {
    paystack: 'Credit/Debit Card',
    bank_transfer: 'Bank Transfer (Pay with Transfer)',
    crypto: 'Cryptocurrency'
  };
  return names[method] || method;
};

/**
 * Get payment method description
 */
export const getPaymentMethodDescription = (method: string): string => {
  const descriptions: Record<string, string> = {
    paystack: 'Pay securely with your credit or debit card via Paystack',
    bank_transfer: 'Receive temporary bank account details for payment. Valid for 8 hours.',
    crypto: 'Pay with Bitcoin or Ethereum. Instant confirmation.'
  };
  return descriptions[method] || '';
};

/**
 * Format order ID for display
 */
export const formatOrderId = (orderId: string): string => {
  return `Order #${orderId}`;
};

/**
 * Get order status badge class
 */
export const getOrderStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'badge-warning',
    processing: 'badge-info',
    paid: 'badge-success',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  };
  return classes[status] || 'badge-secondary';
};

/**
 * Get order status display text
 */
export const getOrderStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: 'Pending Payment',
    processing: 'Processing',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return texts[status] || status;
};

/**
 * Check if order payment is pending
 */
export const isPaymentPending = (status: string): boolean => {
  return status === 'pending';
};

/**
 * Check if order is completed
 */
export const isOrderCompleted = (status: string): boolean => {
  return ['delivered', 'paid'].includes(status);
};

/**
 * Get shipping options
 */
export const SHIPPING_OPTIONS = [
  {
    value: 'standard',
    label: 'Standard Shipping',
    price: 2500,
    estimatedDays: '3-5',
    description: 'Delivery in 3-5 business days'
  },
  {
    value: 'express',
    label: 'Express Shipping',
    price: 5000,
    estimatedDays: '1-2',
    description: 'Delivery in 1-2 business days'
  }
];

/**
 * Format currency to Naira
 */
export const formatNaira = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '₦0';
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format currency to USDT
 */
export const formatUSDT = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '$0.00';
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Get Nigerian states
 */
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara', 'FCT'
];
