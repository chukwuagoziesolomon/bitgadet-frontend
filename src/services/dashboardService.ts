import { conditionalApiRequest } from '../config/api';

export interface OrderSummaryStats {
  total_orders: number;
  total_revenue: number;
  total_shipping_fee: number;
  average_order_value: number;
  currency: string;
  cart_token?: string;
  note?: string;
  auth_type?: string;
}

/**
 * Dashboard Service - Handles fetching order and commerce statistics
 */
export const dashboardService = {
  /**
   * Fetch order summary statistics
   * Works for both authenticated users and guests
   * Returns aggregate stats like total_orders, total_revenue, average_order_value
   */
  async getOrderSummaryStats(): Promise<OrderSummaryStats> {
    try {
      const response = await conditionalApiRequest<OrderSummaryStats>('/api/orders/summary/');
      return response;
    } catch (error) {
      console.error('Failed to fetch order summary stats:', error);
      throw error;
    }
  },

  /**
   * Format currency value
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    });
    return formatter.format(amount);
  }
};
