import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  MessageCircle, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle,
  X
} from 'lucide-react';
import './ProductDetails.css';

interface ProductDetails {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  usdtPrice: number;
  rating: number;
  reviews: number;
  description: string;
  specifications: {
    [key: string]: string;
  };
  features: string[];
  inStock: boolean;
  stockCount: number;
  images: string[];
  category: string;
  badges: string[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState('green');
  const [selectedStorage, setSelectedStorage] = useState('256GB');
  const [selectedRAM, setSelectedRAM] = useState('12GB');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample product data - in a real app, this would come from an API
  const sampleProduct: ProductDetails = {
    id: parseInt(id || '1'),
    name: 'Samsung Galaxy A56',
    brand: 'Samsung',
    image: '/phone1.png',
    price: 902500,
    originalPrice: 950000,
    usdtPrice: 560,
    rating: 4.9,
    reviews: 128,
    description: 'The Samsung Galaxy A56 is a sleek mid-range smartphone offering reliable performance and a modern design. It\'s perfect for users who want a smooth user experience, long-term software support, and 5G connectivity without breaking the bank.',
    specifications: {
      'Display': '6.7-inch Super Retina XDR display',
      'Chip': 'A17 Pro chip with 6-core GPU',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Storage': '256GB, 512GB, 1TB',
      'Battery': 'Up to 29 hours video playback',
      'Connectivity': '5G, Wi-Fi 6E, Bluetooth 5.3',
      'Operating System': 'iOS 17',
      'Weight': '221 grams',
      'Colors': 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium'
    },
    features: [
      'Titanium design for durability',
      'A17 Pro chip for enhanced performance',
      'Advanced camera system with 5x Telephoto zoom',
      'Action Button for quick access',
      'USB-C connectivity',
      'Emergency SOS via satellite',
      'Crash Detection',
      'Face ID for secure authentication'
    ],
    inStock: true,
    stockCount: 34,
    images: [
      '/phone1.png',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Smartphones',
    badges: ['Best Seller', 'New Arrival']
  };

  useEffect(() => {
    // In a real app, fetch product data based on ID
    setProduct(sampleProduct);
  }, [id]);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!product) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [product]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={20} className="star filled" />);
      } else if (i - rating < 1) {
        stars.push(<Star key={i} size={20} className="star partial" />);
      } else {
        stars.push(<Star key={i} size={20} className="star" />);
      }
    }
    return stars;
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', { product: product?.id, quantity });
  };

  const handleWhatsAppEnquiry = () => {
    const message = `Hi, I'm interested in the ${product?.name}. Can you provide more information?`;
    const whatsappUrl = `https://wa.me/2347043567844?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!product) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="product-details">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/home" className="breadcrumb-link">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/products" className="breadcrumb-link">Products</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-details-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[currentImageIndex]} alt={product.name} />
            {product.badges.length > 0 && (
              <div className="product-badges">
                {product.badges.map((badge, index) => (
                  <span key={index} className={`badge ${
                    badge.includes('Best') ? 'bestseller' :
                    badge.includes('New') ? 'new-arrival' : 'default'
                  }`}>
                    {badge}
                  </span>
                ))}
              </div>
            )}
            
            {/* Navigation Arrows */}
            <button className="image-nav prev" onClick={prevImage}>
              <span>‹</span>
            </button>
            <button className="image-nav next" onClick={nextImage}>
              <span>›</span>
            </button>
            
            {/* Image Counter */}
            <div className="image-counter">
              {currentImageIndex + 1}/{product.images.length}
            </div>
          </div>
          
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => goToImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Container */}
        <div className="product-info-container">
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name} Features</h1>
              <button className="share-btn" onClick={handleShare}>
                <Share2 size={20} />
              </button>
            </div>

            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="product-pricing">
              <div className="price-main">
                <span className="current-price">{formatNaira(product.price)}</span>
                <span className="original-price">{formatNaira(product.originalPrice)}</span>
                <div className="discount-badge">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              </div>
              <div className="price-usdt">
                <span className="crypto-icon">₿</span>
                USDT: {product.usdtPrice}
              </div>
            </div>

            <div className="product-availability">
              <div className="stock-info">
                {product.inStock ? (
                  <div className="in-stock">
                    <div className="stock-dot"></div>
                    <span>In Stock</span>
                  </div>
                ) : (
                  <div className="out-of-stock">
                    <X size={16} />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="stock-warning">
                Hurry up! only {product.stockCount} product left in stock!
              </div>
            </div>

            {/* Product Options */}
            <div className="product-options">
              <div className="option-group">
                <label className="option-label">Color:</label>
                <div className="color-options">
                  <button 
                    className={`color-option ${selectedColor === 'blue' ? 'selected' : ''}`}
                    onClick={() => setSelectedColor('blue')}
                    style={{ backgroundColor: '#3b82f6' }}
                  ></button>
                  <button 
                    className={`color-option ${selectedColor === 'green' ? 'selected' : ''}`}
                    onClick={() => setSelectedColor('green')}
                    style={{ backgroundColor: '#10b981' }}
                  ></button>
                  <button 
                    className={`color-option ${selectedColor === 'black' ? 'selected' : ''}`}
                    onClick={() => setSelectedColor('black')}
                    style={{ backgroundColor: '#1f2937' }}
                  ></button>
                </div>
              </div>

              <div className="option-group">
                <label className="option-label">Storage:</label>
                <div className="storage-options">
                  {['64GB', '128GB', '256GB'].map((storage) => (
                    <button 
                      key={storage}
                      className={`storage-option ${selectedStorage === storage ? 'selected' : ''}`}
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label className="option-label">RAM:</label>
                <div className="ram-options">
                  {['6GB', '8GB', '12GB'].map((ram) => (
                    <button 
                      key={ram}
                      className={`ram-option ${selectedRAM === ram ? 'selected' : ''}`}
                      onClick={() => setSelectedRAM(ram)}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="quantity-section">
              <label className="option-label">Quantity:</label>
              <div className="quantity-selector">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stockCount}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="view-cart-btn">
                View Cart
              </button>
              <button className="checkout-btn">
                Checkout
              </button>
            </div>

            <div className="product-services">
              <div className="service-item">
                <Truck size={24} />
                <div>
                  <h4>Fast Delivery</h4>
                  <p>Delivery within 24 hours in Lagos, 2-5 days nationwide</p>
                </div>
              </div>
              <div className="service-item">
                <Shield size={24} />
                <div>
                  <h4>Authentic Products</h4>
                  <p>100% genuine products with manufacturer warranty</p>
                </div>
              </div>
              <div className="service-item">
                <span className="crypto-icon">₿</span>
                <div>
                  <h4>Crypto Payment</h4>
                  <p>Secure payment with Bitcoin and Ethereum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs-section">
        <div className="product-tabs-container">
          <div className="product-tabs">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specification' ? 'active' : ''}`}
              onClick={() => setActiveTab('specification')}
            >
              Specification
            </button>
            <button 
              className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              Review
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <h3>Samsung Galaxy A56 Overview</h3>
                <p>
                  The Samsung Galaxy A56 is a sleek mid-range smartphone offering reliable performance and a modern design. 
                  It's perfect for users who want a smooth user experience, long-term software support, and 5G connectivity 
                  without breaking the bank.
                </p>
                
                <h4>Durable Display</h4>
                <p>
                  Features a 6.7-inch display with a 110.2 cm³ screen area, 1080 x 2340 resolution, 19.5:9 aspect ratio, 
                  385 ppi density, and an ~86.9% screen-to-body ratio for an edge-to-edge design.
                </p>
                
                <h4>Revolutionary Camera System</h4>
                <p>
                  Equipped with a powerful triple-camera setup including a 50 MP main camera (f/1.8) with Phase Detection 
                  Autofocus (PDAF) and Optical Image Stabilization (OIS), a 12 MP ultra-wide lens with a 123° field of view, 
                  and a 5 MP macro lens (f/2.4) for close-up photography.
                </p>
              </div>
            )}

            {activeTab === 'specification' && (
              <div className="specification-content">
                <div className="spec-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="review-content">
                <div className="review-summary">
                  <div className="rating-overview">
                    <div className="overall-rating">
                      <span className="rating-number">{product.rating}</span>
                      <div className="rating-stars">
                        {renderStars(product.rating)}
                      </div>
                      <span className="rating-count">Based on {product.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                
                <div className="reviews-list">
                  <div className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">JD</div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">John Doe</span>
                          <div className="review-rating">
                            {renderStars(5)}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">2 days ago</span>
                    </div>
                    <p className="review-text">
                      Excellent phone! The camera quality is amazing and the battery life is outstanding. 
                      Highly recommended for anyone looking for a premium smartphone experience.
                    </p>
                  </div>
                  
                  <div className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">SM</div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">Sarah Miller</span>
                          <div className="review-rating">
                            {renderStars(4)}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">1 week ago</span>
                    </div>
                    <p className="review-text">
                      Great phone overall. The design is sleek and the performance is smooth. 
                      Only minor issue is the charging speed could be faster.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="related-products-section">
        <div className="related-products-container">
          <h2>You may also like</h2>
          <div className="related-products-grid">
            {[
              {
                id: 2,
                name: 'iPhone 15 Pro',
                image: '/phone1.png',
                price: 1850000,
                originalPrice: 2100000,
                badges: ['12% OFF', 'New', 'Bestseller']
              },
              {
                id: 3,
                name: 'PlayStation 5 Console',
                image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
                price: 1850000,
                originalPrice: 2100000,
                badges: ['14% OFF', 'Out of stock']
              },
              {
                id: 4,
                name: 'Dell XPS 13 9360',
                image: '/laptop1.png',
                price: 1850000,
                originalPrice: 2100000,
                badges: ['12% OFF', 'New']
              },
              {
                id: 5,
                name: 'Sony Smartwatch 15',
                image: '/watch.png',
                price: 1850000,
                originalPrice: 2100000,
                badges: ['New', 'Bestseller']
              },
              {
                id: 6,
                name: 'Galaxy S25 Ultra',
                image: '/phone1.png',
                price: 1850000,
                originalPrice: 2100000,
                badges: ['12% OFF']
              }
            ].map((relatedProduct) => (
              <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="related-product-card">
                <div className="related-product-image">
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                  <div className="related-product-badges">
                    {relatedProduct.badges.map((badge, index) => (
                      <span key={index} className={`badge ${
                        badge.includes('OFF') ? 'discount' :
                        badge.includes('New') ? 'new-arrival' :
                        badge.includes('Bestseller') ? 'bestseller' :
                        badge.includes('Out of stock') ? 'out-of-stock' : 'default'
                      }`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="related-product-info">
                  <h3>{relatedProduct.name}</h3>
                  <div className="related-product-pricing">
                    <span className="current-price">{formatNaira(relatedProduct.price)}</span>
                    <span className="original-price">{formatNaira(relatedProduct.originalPrice)}</span>
                    <span className="usdt-price">650 USDT</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Specifications Modal */}
      {showSpecModal && (
        <div className="modal-overlay" onClick={() => setShowSpecModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Features & Specifications</h2>
              <button 
                className="modal-close"
                onClick={() => setShowSpecModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="specifications">
                <h3>Specifications</h3>
                <div className="spec-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="features">
                <h3>All Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
