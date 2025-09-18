import React from 'react';
import ProductCard from './ProductCard';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
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
      rating: 4.7,
      reviews: 203,
      badges: ['New', 'Bestseller'],
      inStock: true
    }
  ];

  const handleAddToCart = (productId: number) => {
    console.log(`Adding product ${productId} to cart`);
    // Add your cart logic here
    alert(`Product ${productId} added to cart!`);
  };

  const handleToggleWishlist = (productId: number) => {
    console.log(`Toggling wishlist for product ${productId}`);
    // Add your wishlist logic here
    alert(`Product ${productId} wishlist toggled!`);
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
              rating={product.rating}
              reviews={product.reviews}
              badges={product.badges}
              inStock={product.inStock}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
      </div>
        </div>
    </div>
  );
};

export default ProductsPage;
