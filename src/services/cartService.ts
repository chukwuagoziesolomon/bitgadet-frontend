import { API_CONFIG, buildApiUrl } from '../config/api';
import { initializeCartToken } from '../utils/tokenUtils';

class CartService {
    private CART_TOKEN_KEY = 'bitgadgets_cart_token';

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
            headers['Authorization'] = `Bearer ${authToken}`;
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

        const response = await fetch(buildApiUrl('/api/cart/add/'), {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log('CartService addToCart: response data:', data);

        // CRITICAL: Save the cart_token returned by the server (for guest users)
        if (data.cart_token) {
            this.setCartToken(data.cart_token);
            console.log('CartService addToCart: saved cart_token:', data.cart_token);
        } else {
            // If this is a guest user (no auth token) and server did not return a cart_token,
            // log a clear warning to help debug backend behavior. Do NOT overwrite existing token.
            if (!authToken) {
                console.warn('CartService addToCart: WARNING — server did not return a cart_token for a guest add-to-cart. This means the backend did not create/persist a guest cart token. Request body and response are logged for debugging.');
                console.warn('CartService addToCart: request body:', body);
                console.warn('CartService addToCart: response:', data);
            }
        }

        if (!response.ok) {
            throw new Error(data.error || 'Failed to add to cart');
        }

        return data;
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

        const url = cartToken ? buildApiUrl(`/api/cart/?cart_token=${cartToken}`) : buildApiUrl('/api/cart/');
        console.log('CartService getCart: making request to:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to load cart');
        }

        const data = await response.json();
        console.log('CartService getCart: response data:', data);

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

        // For guest users, ensure we have a cart token
        if (!authToken && !cartToken) {
            cartToken = initializeCartToken();
        }

        const response = await fetch(buildApiUrl('/api/cart/update/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

        return data;
    }

    // Remove from cart
    async removeFromCart(productId: number): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();

        // For guest users, ensure we have a cart token
        if (!authToken && !cartToken) {
            cartToken = initializeCartToken();
        }

        const response = await fetch(buildApiUrl('/api/cart/remove/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                cart_token: cartToken
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to remove from cart');
        }

        return data;
    }

    // Get cart summary (for cart icon badge)
    async getCartSummary(): Promise<any> {
        const authToken = localStorage.getItem('authToken');
        let cartToken = this.getCartToken();

        // For guest users, ensure we have a cart token
        if (!authToken && !cartToken) {
            cartToken = initializeCartToken();
        }

        const url = cartToken ? buildApiUrl(`/api/cart/summary/?cart_token=${cartToken}`) : buildApiUrl('/api/cart/summary/');

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to load cart summary');
        }

        const data = await response.json();

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

        // For guest users, ensure we have a cart token
        if (!authToken && !cartToken) {
            cartToken = initializeCartToken();
        }

        const response = await fetch(buildApiUrl('/api/cart/clear/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

    // Get order summary for checkout
    async getOrderSummary(): Promise<any> {
        const cartToken = this.getCartToken();
        console.log('CartService getOrderSummary: cartToken from localStorage:', cartToken);
        
        if (!cartToken) {
            console.warn('CartService getOrderSummary: No cart_token found in localStorage');
            throw new Error('No cart found. Please add items to cart first.');
        }
        
        // Build URL with cart_token as query parameter - use CART_SUMMARY instead of ORDER_SUMMARY
        const url = buildApiUrl(`/api/cart/summary/?cart_token=${cartToken}`);
        
        console.log('CartService getOrderSummary: making request to:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Do NOT include credentials for this public endpoint
        });

        if (!response.ok) {
            console.error(`CartService getOrderSummary: HTTP ${response.status} ${response.statusText}`);
            console.error('CartService getOrderSummary: Response headers:', {
                'Content-Type': response.headers.get('Content-Type'),
                'Authorization': response.headers.get('Authorization') ? 'Present' : 'Not Present',
            });
            
            const errorData = await response.json().catch(() => ({}));
            console.error('CartService getOrderSummary: Error response:', errorData);
            
            // Better error message for 401
            if (response.status === 401) {
                throw new Error('Authentication error: /api/cart/summary/ endpoint requires authentication. Please ensure cart_token is passed.');
            }
            
            throw new Error(errorData.message || `Failed to load order summary (HTTP ${response.status})`);
        }

        const data = await response.json();
        console.log('CartService getOrderSummary: response data:', data);

        // Check if response is an error array (e.g., ["Cart is empty"])
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
            const errorMessage = data[0];
            console.error('CartService getOrderSummary: Backend returned error array:', errorMessage);
            
            // Check if it's a "cart empty" error
            if (errorMessage.toLowerCase().includes('cart') && errorMessage.toLowerCase().includes('empty')) {
                throw new Error('Your cart is empty. Please add items to cart first.');
            }
            
            throw new Error(errorMessage);
        }

        // Check if response indicates empty cart
        if (data.message && (data.message.toLowerCase().includes('cart') && data.message.toLowerCase().includes('empty'))) {
            throw new Error('Your cart is empty. Please add items to cart first.');
        }

        // CRITICAL: Save the cart_token returned by the server if present
        if (data.cart_token) {
            this.setCartToken(data.cart_token);
            console.log('CartService getOrderSummary: saved cart_token:', data.cart_token);
        }

        // Transform API response to match UI expectations
        // API returns: total_items, total_amount
        // UI expects: item_count, total, subtotal
        const transformedData = {
            ...data,
            item_count: data.total_items || 0,
            total: data.total_amount || 0,
            subtotal: data.total_amount || 0, // Using total_amount as subtotal
            shipping: data.shipping || 0,
            tax: data.tax || 0,
            discount: data.discount || 0,
            currency_symbol: '₦',
            currency: 'NGN'
        };

        console.log('CartService getOrderSummary: transformed data:', transformedData);
        return transformedData;
    }
}

// Export singleton instance
export const cartService = new CartService();