import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { conditionalApiRequest, apiRequest } from '../config/api';
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

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cartData = await conditionalApiRequest<any>('/api/cart/');
      const products = cartData.products || [];

      const transformedProducts = products.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.current_price) || 0,
        quantity: product.quantity || 1,
        item_total: product.quantity ? (parseFloat(product.current_price) || 0) * product.quantity : undefined,
        brand: product.brand,
        image: product.main_image,
        usdPrice: parseFloat(product.current_price_usdt) || undefined,
        discount: product.discount_percentage || undefined,
      }));

      setCartItems(transformedProducts);
      setItemCount(transformedProducts.length);

      try {
        const summaryData = await conditionalApiRequest<any>('/api/cart/summary/');
        setOrderSummary(summaryData);
      } catch (summaryError) {
        console.error('Failed to fetch cart summary:', summaryError);
        setOrderSummary({});
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await apiRequest<any>('/api/cart/update/', {
        method: 'POST',
        body: JSON.stringify({ product_id: id, quantity: newQuantity }),
      });
      fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await apiRequest<any>('/api/cart/remove/', {
        method: 'POST',
        body: JSON.stringify({ product_id: id }),
      });
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
            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>{formatNaira(orderSummary?.subtotal || 0)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatNaira(orderSummary?.shipping || 0)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>{formatNaira(orderSummary?.tax || 0)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <div className="total-amount">
                <div className="total-naira">{formatNaira(orderSummary?.total || 0)}</div>
                <div className="total-usd">{formatUSD(orderSummary?.total_usdt || 0)}</div>
              </div>
            </div>
          </div>
          
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
          
          <button className="whatsapp-btn">
            Get help via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;