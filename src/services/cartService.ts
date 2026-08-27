import { buildApiUrl } from '../config/api';
// ...existing code...
import { initializeCartToken } from '../utils/tokenUtils';

class CartService {
    private CART_TOKEN_KEY = 'bitgadgets_cart_token';

    private unwrapResponse(data: any): any {
        if (!data) return data;
        if (data?.data?.data !== undefined) return data.data.data;
        if (data?.data !== undefined) return data.data;
        return data;
    }

    // Get cart token from localStorage
    getCartToken(): string | null {
        return localStorage.getItem(this.CART_TOKEN_KEY);
    }

    // Save cart token to localStorage
    setCartToken(token: string | null): void {
        if (token) {
            localStorage.setItem(this.CART_TOKEN_KEY, token);
        }
    }

    // Clear cart token from localStorage (after successful checkout)
    clearCartToken(): void {
        localStorage.removeItem(this.CART_TOKEN_KEY);
        console.log('🛒 Cart token cleared from localStorage');
    }

    // Add to cart
    async addToCart(productId: number, quantity: number = 1): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();
        
        console.log('CartService addToCart: authToken:', !!authToken, 'cartToken:', cartToken);

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Add authorization header for authenticated users
        if (authToken) {
            headers['Authorization'] = `Token ${authToken}`;
        }

        const body: any = {
            product_id: productId,
            quantity: quantity,
        };

        // For guest users, ensure we have a cart token
        if (!authToken) {
            if (!cartToken) {
                cartToken = initializeCartToken();
            }
            body.cart_token = cartToken;
        }

        const response = await fetch(buildApiUrl('/api/v1/cart/add/'), {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        const json = await response.json();
        console.log('CartService addToCart: response data:', json);

        // Unwrap standard or nested envelope
        const data = this.unwrapResponse(json);

        // CRITICAL: Save the cart_token returned by the server (for guest users)
        if (data.cart_token) {
            this.setCartToken(data.cart_token);
            console.log('CartService addToCart: saved cart_token:', data.cart_token);
        } else {
            if (!authToken) {
                console.warn('CartService addToCart: WARNING — server did not return a cart_token for a guest add-to-cart.');
                console.warn('CartService addToCart: request body:', body);
                console.warn('CartService addToCart: response:', json);
            }
        }

        if (!response.ok) {
            throw new Error(data.error || json.message || 'Failed to add to cart');
        }

        return json;
    }

    // Get cart items
    async getCart(): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();
        console.log('CartService getCart: cartToken from localStorage:', cartToken);

        // For guest users, ensure we have a cart token
        if (!authToken && !cartToken) {
            cartToken = initializeCartToken();
        }

        const url = cartToken ? buildApiUrl(`/api/v1/cart/?cart_token=${cartToken}`) : buildApiUrl('/api/v1/cart/');
        console.log('CartService getCart: making request to:', url);

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        };

        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error('Failed to load cart');
        }

        const json = await response.json();
        console.log('CartService getCart: response data:', json);

        // Unwrap standard or nested envelope
        const data = this.unwrapResponse(json);

        // CRITICAL: Save the cart_token returned by the server
        if (data.cart_token) {
            this.setCartToken(data.cart_token);
            console.log('CartService getCart: saved cart_token:', data.cart_token);
        }

        return data;
    }

    // Update cart item
    async updateCart(productId: number, quantity: number): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();

        if (!cartToken) {
            cartToken = initializeCartToken();
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        };

        const response = await fetch(buildApiUrl('/api/v1/cart/update/'), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity,
                cart_token: cartToken
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update cart');
        }

        // Save cart_token if returned by server
        const unwrapped = this.unwrapResponse(data);
        if (unwrapped?.cart_token) {
            this.setCartToken(unwrapped.cart_token);
        }

        return data;
    }

    // Remove from cart
    async removeFromCart(productId: number): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();

        if (!cartToken) {
            cartToken = initializeCartToken();
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        };

        const response = await fetch(buildApiUrl('/api/v1/cart/remove/'), {
            method: 'POST',
            headers,
            body: JSON.stringify({
                product_id: productId,
                cart_token: cartToken
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to remove from cart');
        }

        // Save cart_token if returned by server
        const unwrapped = this.unwrapResponse(data);
        if (unwrapped?.cart_token) {
            this.setCartToken(unwrapped.cart_token);
        }

        return data;
    }

    // Get cart summary (before order creation)
    // API contract: GET /api/v1/cart/summary/ with X-Cart-Token header
    async getCartSummary(options?: { state?: string; coupon_code?: string; payment_method?: string }): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();

        // For guest users, ensure we have a cart token
        if (!authToken && !cartToken) {
            cartToken = initializeCartToken();
        }

        const params = new URLSearchParams();
        if (options?.state) params.append('state_to', options.state);
        if (options?.coupon_code) params.append('coupon_code', options.coupon_code);
        if (options?.payment_method) params.append('payment_method', options.payment_method);

        const endpoint = `/api/v1/cart/summary/${params.toString() ? `?${params.toString()}` : ''}`;
        const url = buildApiUrl(endpoint);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
                ...(cartToken ? { 'X-Cart-Token': cartToken } : {}),
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load cart summary');
        }

        const json = await response.json();

        // Unwrap standard or nested envelope
        const data = this.unwrapResponse(json);

        // CRITICAL: Save the cart_token returned by the server
        if (data.cart_token) {
            this.setCartToken(data.cart_token);
        }

        return data;
    }

    // Clear entire cart
    async clearCart(): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();

        if (!cartToken) {
            cartToken = initializeCartToken();
        }

        const response = await fetch(buildApiUrl('/api/v1/cart/clear/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
            },
            body: JSON.stringify({
                cart_token: cartToken
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to clear cart');
        }

        return data;
    }

    // Backward-compat alias used by older components
    async getOrderSummary(): Promise<any> {
        return this.getCartSummary();
    }

    // Get order summary after order creation
    // API contract: GET /api/v1/orders/summary/?order_id=<id>
    async getCreatedOrderSummary(orderId: string): Promise<any> {
        if (!orderId) {
            throw new Error('order_id is required');
        }

        const url = buildApiUrl(`/api/v1/orders/summary/?order_id=${encodeURIComponent(orderId)}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(json?.message || 'Failed to load created order summary');
        }

        return this.unwrapResponse(json);
    }
}

// Export singleton instance
export const cartService = new CartService();