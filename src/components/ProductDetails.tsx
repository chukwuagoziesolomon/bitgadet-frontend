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
import { publicApiRequest } from '../config/api';
import './ProductDetails.css';

interface Category {
  id: number;
  name: string;
  display_name: string;
  description: string;
}

interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

interface ProductDetails {
  id: number;
  name: string;
  slug: string;
  category: Category;
  description: string;
  short_description: string;
  price: string;
  price_usdt: string;
  discount_percentage: number;
  stock_quantity: number;
  sku: string;
  brand: string;
  model: string;
  colors: string[];
  storage_options: string[];
  ram_options: string[];
  display_specs: string;
  chip_specs: string;
  camera_specs: string;
  storage_specs: string;
  battery_specs: string;
  operating_system: string;
  weight: string;
  specifications: string;
  features: string[];
  main_image: string;
  images: ProductImage[];
  is_active: boolean;
  is_featured: boolean;
  is_on_sale: boolean;
  is_in_stock: boolean;
  has_colors: boolean;
  has_storage_options: boolean;
  has_ram_options: boolean;
  color_count: number;
  storage_count: number;
  ram_count: number;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  is_new: boolean;
  is_bestseller: boolean;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Recommendation {
  id: number;
  name: string;
  slug: string;
  main_image: string;
  price: string;
  price_usdt: string;
  discount_percentage: number;
  is_on_sale: boolean;
  is_new: boolean;
  is_bestseller: boolean;
}

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedRAM, setSelectedRAM] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const productData = await publicApiRequest<ProductDetails>(`/api/products/${slug}/`);
        setProduct(productData);

        // Set default selections
        if (productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.storage_options.length > 0) {
          setSelectedStorage(productData.storage_options[0]);
        }
        if (productData.ram_options.length > 0) {
          setSelectedRAM(productData.ram_options[0]);
        }

        // Fetch reviews
        try {
          const reviewsData = await publicApiRequest<Review[]>(`/api/products/${slug}/reviews/`);
          setReviews(reviewsData);
        } catch (reviewError) {
          console.warn('Failed to fetch reviews:', reviewError);
          setReviews([]);
        }

        // Fetch recommendations
        try {
          const recommendationsData = await publicApiRequest<Recommendation[]>(`/api/products/recommendations/?category=${productData.category.name}&limit=6`);
          setRecommendations(recommendationsData);
        } catch (recError) {
          console.warn('Failed to fetch recommendations:', recError);
          setRecommendations([]);
        }

      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!product || product.images.length === 0) return;

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

      // Use custom notification instead of browser alert
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10001;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          max-width: 350px;
          animation: slideInRight 0.3s ease-out;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">✓</span>
            <span>Link copied to clipboard!</span>
          </div>
        </div>
      `;

      // Add animation styles if not already present
      if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(notification);

      // Remove after 3 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
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

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <div className="error-message">
          {error || 'Product not found'}
        </div>
        <Link to="/products" className="back-to-products">
          Back to Products
        </Link>
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
            <img
              src={product.images[currentImageIndex]?.image || product.main_image}
              alt={product.images[currentImageIndex]?.alt_text || product.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'; // Cloudinary-style fallback
              }}
            />
            {(product.is_bestseller || product.is_new || product.is_featured) && (
              <div className="product-badges">
                {product.is_bestseller && <span className="badge bestseller">Best Seller</span>}
                {product.is_new && <span className="badge new-arrival">New</span>}
                {product.is_featured && <span className="badge featured">Featured</span>}
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
                key={image.id}
                className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => goToImage(index)}
              >
                <img
                  src={image.image}
                  alt={image.alt_text}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=No+Image'; // Cloudinary-style fallback
                  }}
                />
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
                {renderStars(product.average_rating)}
              </div>
              <span className="rating-text">
                {product.average_rating} ({product.review_count} reviews)
              </span>
            </div>

            <div className="product-pricing">
              <div className="price-main">
                <span className="current-price">{formatNaira(parseFloat(product.price))}</span>
                {product.discount_percentage > 0 && (
                  <>
                    <span className="original-price">
                      {formatNaira(parseFloat(product.price) / (1 - product.discount_percentage / 100))}
                    </span>
                    <div className="discount-badge">
                      {product.discount_percentage}% OFF
                    </div>
                  </>
                )}
              </div>
              <div className="price-usdt-bar">
                <span className="crypto-icon">₿</span>
                <span className="usdt-text">USDT: {product.price_usdt}</span>
              </div>
            </div>

            <div className="product-availability">
              <div className="stock-info">
                {product.is_in_stock ? (
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
              {product.is_in_stock && product.stock_quantity <= 10 && (
                <div className="stock-warning">
                  Hurry up! only {product.stock_quantity} product{product.stock_quantity !== 1 ? 's' : ''} left in stock!
                </div>
              )}
            </div>

            {/* Product Options */}
            <div className="product-options">
              {product.has_colors && product.colors.length > 0 && (
                <div className="option-group">
                  <label className="option-label">Color:</label>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.has_storage_options && product.storage_options.length > 0 && (
                <div className="option-group">
                  <label className="option-label">Storage:</label>
                  <div className="storage-options">
                    {product.storage_options.map((storage) => (
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
              )}

              {product.has_ram_options && product.ram_options.length > 0 && (
                <div className="option-group">
                  <label className="option-label">RAM:</label>
                  <div className="ram-options">
                    {product.ram_options.map((ram) => (
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
              )}
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
                  disabled={quantity >= product.stock_quantity}
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
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {activeTab === 'specification' && (
              <div className="specification-content">
                <div className="spec-grid">
                  {product.display_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Display:</span>
                      <span className="spec-value">{product.display_specs}</span>
                    </div>
                  )}
                  {product.chip_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Chip:</span>
                      <span className="spec-value">{product.chip_specs}</span>
                    </div>
                  )}
                  {product.camera_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Camera:</span>
                      <span className="spec-value">{product.camera_specs}</span>
                    </div>
                  )}
                  {product.storage_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Storage:</span>
                      <span className="spec-value">{product.storage_specs}</span>
                    </div>
                  )}
                  {product.battery_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Battery:</span>
                      <span className="spec-value">{product.battery_specs}</span>
                    </div>
                  )}
                  {product.operating_system && (
                    <div className="spec-item">
                      <span className="spec-label">Operating System:</span>
                      <span className="spec-value">{product.operating_system}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="spec-item">
                      <span className="spec-label">Weight:</span>
                      <span className="spec-value">{product.weight}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="review-content">
                <div className="review-summary">
                  <div className="rating-overview">
                    <div className="overall-rating">
                      <span className="rating-number">{product.average_rating}</span>
                      <div className="rating-stars">
                        {renderStars(product.average_rating)}
                      </div>
                      <span className="rating-count">Based on {product.review_count} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="reviewer-details">
                              <span className="reviewer-name">{review.user}</span>
                              <div className="review-rating">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-text">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {recommendations.length > 0 && (
        <div className="related-products-section">
          <div className="related-products-container">
            <h2>You may also like</h2>
            <div className="related-products-grid">
              {recommendations.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.slug}`} className="related-product-card">
                  <div className="related-product-image">
                    <img
                      src={relatedProduct.main_image}
                      alt={relatedProduct.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/250x250/f3f4f6/9ca3af?text=No+Image'; // Cloudinary-style fallback
                      }}
                    />
                    <div className="related-product-badges">
                      {relatedProduct.is_on_sale && (
                        <span className="badge discount">{relatedProduct.discount_percentage}% OFF</span>
                      )}
                      {relatedProduct.is_new && <span className="badge new-arrival">New</span>}
                      {relatedProduct.is_bestseller && <span className="badge bestseller">Bestseller</span>}
                    </div>
                  </div>
                  <div className="related-product-info">
                    <h3>{relatedProduct.name}</h3>
                    <div className="related-product-pricing">
                      <span className="current-price">{formatNaira(parseFloat(relatedProduct.price))}</span>
                      {relatedProduct.is_on_sale && relatedProduct.discount_percentage > 0 && (
                        <span className="original-price">
                          {formatNaira(parseFloat(relatedProduct.price) / (1 - relatedProduct.discount_percentage / 100))}
                        </span>
                      )}
                      <span className="usdt-price">{relatedProduct.price_usdt} USDT</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  {product.display_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Display:</span>
                      <span className="spec-value">{product.display_specs}</span>
                    </div>
                  )}
                  {product.chip_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Chip:</span>
                      <span className="spec-value">{product.chip_specs}</span>
                    </div>
                  )}
                  {product.camera_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Camera:</span>
                      <span className="spec-value">{product.camera_specs}</span>
                    </div>
                  )}
                  {product.storage_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Storage:</span>
                      <span className="spec-value">{product.storage_specs}</span>
                    </div>
                  )}
                  {product.battery_specs && (
                    <div className="spec-item">
                      <span className="spec-label">Battery:</span>
                      <span className="spec-value">{product.battery_specs}</span>
                    </div>
                  )}
                  {product.operating_system && (
                    <div className="spec-item">
                      <span className="spec-label">Operating System:</span>
                      <span className="spec-value">{product.operating_system}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="spec-item">
                      <span className="spec-label">Weight:</span>
                      <span className="spec-value">{product.weight}</span>
                    </div>
                  )}
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
