import { buildApiUrl } from '../config/api';

/**
 * Checkout Order Interface
 */
export interface CheckoutFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  payment_method: 'paystack' | 'bank_transfer';
  shipping_method?: string;
  coupon_code?: string | null;
  cart_token: string | null;
}

/**
 * Checkout Response Interface
 */
export interface CheckoutResponse {
  success: boolean;
  message: string;
  order: {
    id: number;
    order_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    total_amount: number;
    // Optional fields persisted by backend
    discount_amount?: number;
    coupon_code?: string | null;
    payment_method: string;
    status: string;
    created_at: string;
  };
  payment_info?: {
    payment_type: string;
    account_details?: {
      account_number: string;
      account_name: string;
      bank_name: string;
      amount_to_pay: number;
      instructions: string;
      expires_at: string;
      expires_in: string;
      provider: string;
      reference: string;
    };
    message: string;
    instructions: string;
    amount_to_pay: number;
    expires_in: string;
    reference: string;
  };
  account_info?: {
    email: string;
    generated_password: string;
    message: string;
  };
  next_steps?: string[];
}

/**
 * Order Status Response
 */
export interface OrderStatusResponse {
  id: number;
  order_id: string;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  total_amount: number;
  // Optional fields for backwards-compatibility
  discount_amount?: number;
  coupon_code?: string | null;
  created_at: string;
  updated_at: string;
  payment_reference?: string;
  bank_transfer_account_number?: string;
  bank_transfer_account_name?: string;
  bank_transfer_bank_name?: string;
  bank_transfer_expires_at?: string;
}

class CheckoutService {
  /**
   * Create checkout order
   */
  async createOrder(formData: CheckoutFormData): Promise<CheckoutResponse> {
    const response = await fetch(buildApiUrl('/api/v1/checkout/create/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log('📋 Checkout response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout order');
    }

    return data;
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string, email?: string): Promise<OrderStatusResponse> {
    let url = buildApiUrl(`/api/v1/checkout/${orderId}/status/`);
    if (email) {
      url += `?email=${encodeURIComponent(email)}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    console.log('📊 Order status:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get order status');
    }

    return data;
  }

  /**
   * Apply coupon code
   */
  async applyCoupon(couponCode: string, cartToken: string | null): Promise<any> {
    const response = await fetch(buildApiUrl('/api/v1/coupons/apply/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coupon_code: couponCode,
        cart_token: cartToken
      })
    });

    const data = await response.json();
    console.log('🎟️ Coupon response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to apply coupon');
    }

    return data;
  }

  /**
   * Remove coupon
   */
  async removeCoupon(cartToken: string | null): Promise<any> {
    const response = await fetch(buildApiUrl('/api/v1/coupons/remove/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_token: cartToken
      })
    });

    const data = await response.json();
    console.log('🎟️ Coupon removed:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove coupon');
    }

    return data;
  }

  /**
   * Validate email before checkout
   */
  async validateEmail(email: string): Promise<{ valid: boolean; message?: string }> {
    const response = await fetch(buildApiUrl('/api/v1/checkout/validate-email/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    console.log('✉️ Email validation:', data);

    return data;
  }

  /**
   * Store checkout data in session storage for later reference
   */
  saveCheckoutData(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
    console.log(`💾 Saved checkout data: ${key}`);
  }

  /**
   * Retrieve checkout data from session storage
   */
  getCheckoutData(key: string): any {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Clear checkout data from session storage
   */
  clearCheckoutData(): void {
    sessionStorage.removeItem('current_order');
    sessionStorage.removeItem('payment_info');
    sessionStorage.removeItem('account_info');
    console.log('🗑️ Cleared checkout data');
  }
}

// Export singleton instance
export const checkoutService = new CheckoutService();
