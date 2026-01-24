import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cartService } from '../services/cartService';
import { publicApiRequest } from '../config/api';
import './ShoppingCart.css';

interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  item_total?: number;
  brand?: string;
  image?: string;
  usdPrice?: number;
  discount?: number;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const cartData = await cartService.getCart();
      const products = cartData.products || [];

      const transformedProducts = products.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.discounted_price || product.price) || 0,
        quantity: product.quantity || 1,
        item_total: product.subtotal || (parseFloat(product.discounted_price || product.price) || 0) * product.quantity,
        brand: product.brand_name || product.brand,
        image: product.main_image,
        usdPrice: parseFloat(product.price_usdt) || undefined,
        discount: product.discount_percentage || undefined,
      }));

      setCartItems(transformedProducts);
      setItemCount(cartData.total_items || 0);
      setOrderSummary({
        subtotal: cartData.total_amount || 0,
        total: cartData.total_amount || 0,
        total_usdt: cartData.total_amount_usdt || 0,
      });

      // Fetch enhanced order summary
      fetchOrderSummary();
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartItems([]);
      setItemCount(0);
      setOrderSummary({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fetch enhanced order summary with state-based shipping
  const fetchOrderSummary = async (state?: string) => {
    try {
      setSummaryLoading(true);
      const cartToken = cartService.getCartToken();
      if (!cartToken) {
        console.error('No cart token found');
        return;
      }

      let url = `/api/orders/summary/?cart_token=${cartToken}`;
      if (state) {
        url += `&state=${encodeURIComponent(state)}`;
      }

      const response = await publicApiRequest(url) as any;
      if (response.success) {
        setOrderSummary(response);
      }
    } catch (error) {
      console.error('Error fetching order summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };



  

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartService.updateCart(id, newQuantity);
      fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await cartService.removeFromCart(id);
      fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const formatNaira = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  const formatUSD = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '0 USDT';
    return `${amount.toLocaleString()} USDT`;
  };

  if (loading) {
    return (
      <div className="shopping-cart">
        <div className="loading">
          <h2>Loading your cart...</h2>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={80} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="shop-now-btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <Link to="/products" className="back-link">← Continue Shopping</Link>
        <h1>Shopping Cart</h1>
        <p>{itemCount} items in your cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="placeholder">📱</div>
                )}
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="brand">{item.brand || 'Unknown Brand'}</p>
                
                {item.discount && item.discount > 0 && (
                  <span className="discount-badge">{item.discount}% OFF</span>
                )}
                
                <div className="price">
                  <span className="price-naira">{formatNaira(item.price)}</span>
                  <span className="price-usd">{item.usdPrice ? formatUSD(item.usdPrice) : 'N/A USDT'}</span>
                </div>
              </div>
              
              <div className="item-controls">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <div className="subtotal">
                  Subtotal: {formatNaira(item.item_total || (item.price * item.quantity))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          

          
          <div className="summary-details">
            {summaryLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                Loading order summary...
              </div>
            ) : orderSummary ? (
              <>
                <div className="summary-row">
                  <span>Subtotal ({orderSummary.total_items} items)</span>
                  <span>
                    {orderSummary.subtotal_formatted}
                    <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                      ({orderSummary.subtotal_usdt?.toFixed(6)} USDT)
                    </small>
                  </span>
                </div>

                {orderSummary.coupon_applied && orderSummary.discount_amount > 0 && (
                  <div className="summary-row" style={{ color: '#10b981' }}>
                    <span>Discount</span>
                    <span>
                      {orderSummary.discount_formatted}
                      <small style={{ display: 'block', color: '#10b981', fontSize: '12px' }}>
                        ({orderSummary.discount_amount_secondary?.toFixed(6)} USDT)
                      </small>
                    </span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Tax</span>
                  <span>
                    {orderSummary.tax_formatted}
                    <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                      ({orderSummary.tax_amount_usdt?.toFixed(6)} USDT)
                    </small>
                  </span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>
                    {orderSummary.shipping_cost_formatted}
                    <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                      ({orderSummary.shipping_cost_usdt?.toFixed(6)} USDT)
                    </small>
                    {orderSummary.shipping_note && (
                      <small style={{ display: 'block', color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
                        {orderSummary.shipping_note}
                      </small>
                    )}
                  </span>
                </div>

                {!orderSummary.is_free_shipping && orderSummary.free_shipping_remaining && (
                  <div style={{ fontSize: '12px', color: '#f59e0b', fontStyle: 'italic', marginTop: '8px', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '4px' }}>
                    Add ₦{orderSummary.free_shipping_remaining?.toLocaleString()} more for FREE SHIPPING!
                  </div>
                )}

                <div className="summary-total">
                  <span>Total</span>
                  <div className="total-amount">
                    <div className="total-naira">{orderSummary.total_formatted}</div>
                    <div className="total-usd">({orderSummary.total_usdt?.toFixed(6)} USDT)</div>
                  </div>
                </div>

                {orderSummary.shipping_info && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    Delivery: {orderSummary.state?.toLowerCase() === 'lagos' ? orderSummary.shipping_info.lagos_days : orderSummary.shipping_info.other_states_days}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="summary-row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatNaira(orderSummary?.subtotal || 0)}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <div className="total-amount">
                    <div className="total-naira">{formatNaira(orderSummary?.total || 0)}</div>
                    <div className="total-usd">{formatUSD(orderSummary?.total_usdt || 0)}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
          
          <a href="https://wa.me/2349138666111" target="_blank" rel="noopener noreferrer">
            <button className="whatsapp-btn">
              Get help via WhatsApp
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;