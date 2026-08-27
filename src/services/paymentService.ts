import { publicApiRequest } from '../config/api';
import { API_CONFIG } from '../config/api';

export interface PaymentVerificationResult {
  success: boolean;
  status: string;
  data?: any;
  error?: string;
}

export interface PollingOptions {
  interval: number; // in milliseconds
  maxAttempts?: number;
  onUpdate?: (result: PaymentVerificationResult) => void;
  onComplete?: (result: PaymentVerificationResult) => void;
  onError?: (error: any) => void;
}

class PaymentService {
  private activePollings: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Verify Paystack payment (single verification, no polling)
   */
  async verifyPaystackPayment(reference: string): Promise<PaymentVerificationResult> {
    try {
      console.log('🔍 Verifying Paystack payment with reference:', reference);
      const endpoint = API_CONFIG.ENDPOINTS.PAYMENT_PAYSTACK_VERIFY.replace('{reference}', reference);
      const data = await publicApiRequest<any>(endpoint);

      console.log('✅ Paystack verification response:', data);

      const result: PaymentVerificationResult = {
        success: data.status === 'success' && data.transaction_status === 'success',
        status: data.transaction_status || data.status,
        data: data
      };

      return result;
    } catch (error: any) {
      console.error('❌ Paystack verification failed:', error);
      return {
        success: false,
        status: 'error',
        error: error.message || 'Paystack verification failed'
      };
    }
  }

  /**
   * Verify bank transfer (DVA) payment
   */
  async verifyBankTransfer(orderId: string): Promise<PaymentVerificationResult> {
    try {
      console.log('🔍 Verifying bank transfer for order ID:', orderId);
      const endpoint = API_CONFIG.ENDPOINTS.PAYMENT_DVA_VERIFY.replace('{order_id}', orderId);
      const data = await publicApiRequest<any>(endpoint);

      console.log('✅ Bank transfer verification response:', data);

      const isCompleted = data.payment_status === 'completed';
      const isError = data.status === 'error';

      return {
        success: isCompleted,
        status: isError ? 'error' : data.payment_status,
        data: data,
        error: isError ? data.message : undefined
      };
    } catch (error: any) {
      console.error('❌ Bank transfer verification failed:', error);
      return {
        success: false,
        status: 'error',
        error: error.message || 'Bank transfer verification failed'
      };
    }
  }

  /**
   * Start polling for payment verification
   */
  startPolling(
    paymentMethod: 'paystack' | 'bank',
    identifier: string,
    options: PollingOptions
  ): string {
    const pollingId = `${paymentMethod}_${identifier}_${Date.now()}`;

    console.log(`🚀 Starting ${paymentMethod} polling for ${identifier} with ID: ${pollingId}`);

    let attempts = 0;
    const maxAttempts = options.maxAttempts || 100; // Default to 100 attempts

    const poll = async () => {
      attempts++;

      console.log(`🔄 Polling attempt ${attempts}/${maxAttempts} for ${pollingId}`);

      let result: PaymentVerificationResult;

      try {
        switch (paymentMethod) {
          case 'paystack':
            result = await this.verifyPaystackPayment(identifier);
            break;
          case 'bank':
            result = await this.verifyBankTransfer(identifier);
            break;
          default:
            throw new Error(`Unknown payment method: ${paymentMethod}`);
        }

        // Call update callback
        if (options.onUpdate) {
          options.onUpdate(result);
        }

        // Check if polling should stop
        const shouldStop = this.shouldStopPolling(paymentMethod, result);

        if (shouldStop || attempts >= maxAttempts) {
          console.log(`🛑 Stopping polling for ${pollingId}. Reason: ${shouldStop ? 'Condition met' : 'Max attempts reached'}`);
          this.stopPolling(pollingId);

          if (options.onComplete) {
            options.onComplete(result);
          }
        }

      } catch (error) {
        console.error(`❌ Polling error for ${pollingId}:`, error);

        if (options.onError) {
          options.onError(error);
        }

        // Stop polling on error
        this.stopPolling(pollingId);
      }
    };

    // Start polling
    const intervalId = setInterval(poll, options.interval);
    this.activePollings.set(pollingId, intervalId);

    // Execute first poll immediately
    poll();

    return pollingId;
  }

  /**
   * Stop polling by ID
   */
  stopPolling(pollingId: string): void {
    const intervalId = this.activePollings.get(pollingId);
    if (intervalId) {
      console.log(`🛑 Stopping polling with ID: ${pollingId}`);
      clearInterval(intervalId);
      this.activePollings.delete(pollingId);
    }
  }

  /**
   * Stop all active polling
   */
  stopAllPolling(): void {
    console.log('🛑 Stopping all active polling');
    this.activePollings.forEach((intervalId, pollingId) => {
      clearInterval(intervalId);
    });
    this.activePollings.clear();
  }

  /**
   * Determine if polling should stop based on payment method and result
   */
  private shouldStopPolling(paymentMethod: string, result: PaymentVerificationResult): boolean {
    switch (paymentMethod) {
      case 'paystack':
        return true;
      case 'bank':
        return result.status === 'completed' || result.status === 'error';
      default:
        return true;
    }
  }

  /**
   * Get polling intervals for each payment method
   */
  getPollingInterval(paymentMethod: string): number {
    switch (paymentMethod) {
      case 'bank':
        return 30000; // 30 seconds
      case 'paystack':
      default:
        return 0; // No polling
    }
  }
}

export const paymentService = new PaymentService();