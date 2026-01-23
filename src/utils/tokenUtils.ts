/**
 * Utility functions for token and cart management
 */

/**
 * Generates a UUID v4 token
 * Used for generating anonymous cart tokens
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

/**
 * Initialize or get cart token from localStorage
 * Creates a new one if it doesn't exist
 */
export const initializeCartToken = (): string => {
  const CART_TOKEN_KEY = 'bitgadgets_cart_token';
  let cartToken = localStorage.getItem(CART_TOKEN_KEY);

  if (!cartToken) {
    cartToken = generateUUID();
    localStorage.setItem(CART_TOKEN_KEY, cartToken);
    console.log('🛒 Generated new cart token:', cartToken);
  }

  return cartToken;
};

/**
 * Clear cart token from localStorage
 * Used after successful checkout
 */
export const clearCartToken = (): void => {
  const CART_TOKEN_KEY = 'bitgadgets_cart_token';
  localStorage.removeItem(CART_TOKEN_KEY);
  console.log('🛒 Cart token cleared');
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Save auth token to localStorage
 */
export const saveAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
  console.log('🔐 Auth token saved');
};

/**
 * Clear auth token from localStorage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
  console.log('🔐 Auth token cleared');
};

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
