import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductsPage.css';
import { apiRequest, publicApiRequest, conditionalApiRequest, API_CONFIG } from '../config/api';
import { cartService } from '../services/cartService';

const ProductsPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});

  // Fetch wishlist and cart on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const cartToken = cartService.getCartToken();

    if (!token && !cartToken) {
      setWishlist([]);
      setCart({});
      return;
    }

    const fetchWishlistAndCart = async () => {
      try {
        const wishlistUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.WISHLIST_ALL}?cart_token=${cartToken}` : '/api/wishlist/';
        const wishlistRes = token
          ? await conditionalApiRequest<any>(wishlistUrl)
          : await publicApiRequest<any>(wishlistUrl);
        setWishlist(wishlistRes.wishlist || []);
      } catch (error: any) {
        if (token) console.error('Failed to fetch wishlist:', error);
      }

      try {
        const cartUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.CART_GET}?cart_token=${cartToken}` : '/api/cart/';
        const cartRes = token
          ? await conditionalApiRequest<any>(cartUrl)
          : await publicApiRequest<any>(cartUrl);
        setCart(cartRes.cart || {});
      } catch (error: any) {
        if (token) console.error('Failed to fetch cart:', error);
      }
    };

    fetchWishlistAndCart();
  }, []);

  // Sample products data
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      image: '/phone1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      originalUsdtPrice: '740 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF', 'New', 'Bestseller'],
      inStock: true
    },
    {
      id: 2,
      name: 'Play Station (PS) 5 Console',
      brand: 'SONY',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      originalUsdtPrice: '740 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-14%', 'out of stock'],
      inStock: false
    },
    {
      id: 3,
      name: 'Laptop Dell XPS 13 9360',
      brand: 'DELL',
      image: '/laptop1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      originalUsdtPrice: '740 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 4,
      name: 'Sony Smartwatch 15',
      brand: 'SONY',
      image: '/phonewatch2.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      originalUsdtPrice: '740 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['New', 'Bestseller'],
      inStock: true
    },
    {
      id: 5,
      name: 'Galaxy S25 Ultra',
      brand: 'Samsung',
      image: '/phone1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      originalUsdtPrice: '740 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF'],
      inStock: true
    },
    {
      id: 6,
      name: 'MacBook Pro M3',
      brand: 'Apple',
      image: '/laptop1.png',
      price: 2500000,
      originalPrice: 2800000,
      usdtPrice: '850 USDT',
      originalUsdtPrice: '950 USDT',
      rating: 4.8,
      reviews: 156,
      badges: ['New', 'Premium'],
      inStock: true
    },
    {
      id: 7,
      name: 'AirPods Pro 2',
      brand: 'Apple',
      image: '/headphone.png',
      price: 450000,
      originalPrice: 500000,
      usdtPrice: '150 USDT',
      originalUsdtPrice: '170 USDT',
      rating: 4.6,
      reviews: 89,
      badges: ['Sale', 'Popular'],
      inStock: true
    },
    {
      id: 8,
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      image: '/tablet.png',
      price: 1200000,
      originalPrice: 1350000,
      usdtPrice: '400 USDT',
      originalUsdtPrice: '450 USDT',
      rating: 4.7,
      reviews: 203,
      badges: ['New', 'Bestseller'],
      inStock: true
    }
  ];

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('authToken');
    console.log('🛒 Attempting to add product to cart:', productId, 'User logged in:', !!token);

    // Optimistic update
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));

    try {
      const res = await (token ? apiRequest : publicApiRequest)<any>('/api/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      console.log('✅ Add to cart API response:', res);
      setCart(res.cart || {});
      console.log('🛒 Updated cart state:', res.cart || {});
    } catch (error: any) {
      console.error('❌ Add to cart failed:', error);
      // Revert optimistic update
      setCart(prev => {
        const newCart = { ...prev };
        if (newCart[productId] > 1) {
          newCart[productId]--;
        } else {
          delete newCart[productId];
        }
        return newCart;
      });
      if (token) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  const handleToggleWishlist = async (productId: number, willBeInWishlist?: boolean) => {
    const token = localStorage.getItem('authToken');
    const endpoint = willBeInWishlist ? '/api/wishlist/add/' : '/api/wishlist/remove/';

    // Optimistic update
    setWishlist(prev => willBeInWishlist ? [...prev, productId] : prev.filter(id => id !== productId));

    try {
      const res = await conditionalApiRequest<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
      setWishlist(res.wishlist || []);
    } catch (error: any) {
      console.error('❌ Wishlist update failed:', error);
      // Revert optimistic update
      setWishlist(prev => willBeInWishlist ? prev.filter(id => id !== productId) : [...prev, productId]);
      if (token) {
        console.error('Failed to update wishlist:', error);
      }
    }
  };

  return (
    <div className="products-page">
      <div className="products-page-container">
        <div className="products-page-header">
          <h1>Our Products</h1>
          <p>Discover our wide range of premium gadgets and accessories</p>
      </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              image={product.image}
              price={product.price}
              originalPrice={product.originalPrice}
              usdtPrice={product.usdtPrice}
              originalUsdtPrice={product.originalUsdtPrice}
              rating={product.rating}
              reviews={product.reviews}
              badges={product.badges}
              inStock={product.inStock}
              onAddToCart={handleAddToCart}
              isInCart={cart[product.id] > 0}
              isInWishlist={wishlist.includes(product.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
      </div>
        </div>
    </div>
  );
};

export default ProductsPage;
