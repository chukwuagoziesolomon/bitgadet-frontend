import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import "./ProductCard.css";

interface ProductCardProps {
  id: number;
  slug?: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  usdtPrice: string;
  rating: number;
  reviews: number;
  badges?: string[];
  inStock?: boolean;
  showBadges?: boolean;
  showWishlist?: boolean;
  showActions?: boolean;
  onAddToCart?: (productId: number) => void;
  isInCart?: boolean;
  isInWishlist?: boolean;
  onToggleWishlist?: (productId: number, willBeInWishlist?: boolean) => void;
  category?: string;

  // New API response fields
  is_in_stock?: boolean;
  is_out_of_stock?: boolean;
  stock_status?: string;
  is_featured?: boolean;
  is_on_sale?: boolean;
  discount_percentage?: number;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  product_condition?: string;
  condition_display?: string;
  stock_quantity?: number;
  
  // Coupon fields
  is_coupon?: boolean;
  coupon_value?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  name,
  brand,
  image,
  price,
  originalPrice,
  usdtPrice,
  rating,
  reviews,
  badges = [],
  inStock,
  showBadges = true,
  showWishlist = true,
  showActions = true,
  onAddToCart,
  isInCart = false,
  isInWishlist = false,
  onToggleWishlist,
  category,
  // New API fields
  is_in_stock,
  is_out_of_stock,
  stock_status,
  is_featured,
  is_on_sale,
  discount_percentage,
  is_new_arrival,
  is_best_seller,
  product_condition,
  condition_display,
  stock_quantity,
  // Coupon fields
  is_coupon = false,
  coupon_value,
}) => {
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = React.useState(false);

  // Determine stock status - prioritize API fields over legacy prop
  const isInStock = is_in_stock !== undefined ? is_in_stock : inStock;
  const isOutOfStock = is_out_of_stock || !isInStock;

  // Generate badges based on product properties
  const generateBadges = () => {
    const generatedBadges: string[] = [...badges];

    // Stock status badge
    if (isOutOfStock) {
      generatedBadges.push('Out of Stock');
    } else if (stock_status) {
      generatedBadges.push(stock_status);
    }

    // Featured badge
    if (is_featured) {
      generatedBadges.push('Featured');
    }

    // Sale badge
    if (is_on_sale && discount_percentage && discount_percentage > 0) {
      generatedBadges.push(`-${discount_percentage}%`);
    }

    // New arrival badge
    if (is_new_arrival) {
      generatedBadges.push('New Arrival');
    }

    // Best seller badge
    if (is_best_seller) {
      generatedBadges.push('Best Seller');
    }

    // Condition badge
    if (condition_display) {
      generatedBadges.push(condition_display);
    }

    // Coupon badge - prioritize this over other badges for coupons
    if (is_coupon) {
      generatedBadges.unshift('🎁 Gift Coupon'); // Add gift emoji and prioritize
      return generatedBadges; // Return early for coupons to avoid other badges
    }

    return generatedBadges;
  };

  const productBadges = generateBadges();

  // Filter logic: Show only toaster products and exclude specific products
  const shouldShowProduct = () => {
    // If category filter is specified, only show products in that category
    if (category && !name.toLowerCase().includes('toaster') && !category.toLowerCase().includes('toaster')) {
      return false;
    }

    return true;
  };

  // Custom notification function to avoid browser notification issues
  const showCustomNotification = (message: string, type: 'success' | 'info' = 'success') => {
    // Remove any existing notifications first
    const existingToasts = document.querySelectorAll('.custom-notification');
    existingToasts.forEach(toast => toast.remove());

    setTimeout(() => {
      const notification = document.createElement('div');
      notification.className = 'custom-notification';

      const bgColor = type === 'success' ? '#10b981' : '#06b6d4';
      const icon = type === 'success' ? '✓' : '✓';

      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${bgColor};
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
          pointer-events: none;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">${icon}</span>
            <span>${message}</span>
          </div>
        </div>
      `;

      // Add animation styles if not already present
      if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
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
    }, 100);
  };

  const handleCardClick = () => {
    navigate(`/product/${slug || id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
      setAddedToCart(true);

      // Show custom notification without any browser notification interference
      showCustomNotification(`${name} added to cart!`, 'success');

      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      const willBeInWishlist = !isInWishlist;
      onToggleWishlist(id, willBeInWishlist);

      const action = willBeInWishlist ? 'added to' : 'removed from';
      showCustomNotification(`${name} ${action} wishlist!`, 'info');
    }
  };

  const handleWishlistDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(id, false); // Remove from wishlist
      showCustomNotification(`${name} removed from wishlist!`, 'info');
    }
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello, I'd like to enquire about ${name} by ${brand}.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=2349138666111&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  // Don't render if product should be filtered out
  if (!shouldShowProduct()) {
    return null;
  }

  return (
    <div className="product-card-component">
      <div className="brands-product-card" onClick={handleCardClick}>
      {/* Badges + Wishlist */}
      <div className="card-header">
        {showBadges && (
          <div className="badges">
            {productBadges.map((badge, index) => (
              <span key={index} className={`badge ${badge.toLowerCase().replace(/\s+/g, "-")}`}>
                {badge}
              </span>
            ))}
          </div>
        )}
        {showWishlist && (
          <button
            className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
            onClick={handleWishlistClick}
            onDoubleClick={handleWishlistDoubleClick}
          >
            <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Product Image */}
      <div className="brands-product-image-container">
        <img
          src={image}
          alt={name}
          className="brands-product-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'; // Cloudinary-style fallback
          }}
        />
      </div>

      {/* Product Info */}
      <div className="brands-product-info">
        <p className="brands-product-brand">{brand}</p>
        <h3 className="brands-product-name">{name}</h3>

        {/* Rating */}
        <div className="brands-product-rating">
          <div className="brands-stars">{renderStars(rating)}</div>
          <span className="brands-rating-text">
            ({rating.toFixed(1)}) · {reviews} reviews
          </span>
        </div>

        {/* Pricing */}
        <div className="brands-product-pricing">
          {is_coupon ? (
            <>
              <span className="brands-current-price coupon-value">
                ₦{coupon_value?.toLocaleString()} Value
              </span>
              <span className="coupon-price">
                Buy for ₦{price.toLocaleString()}
              </span>
            </>
          ) : (
            <>
              <span className="brands-current-price">
                ₦{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="brands-original-price">
                  ₦{originalPrice.toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>
        {!is_coupon && <p className="brands-usdt-price">{usdtPrice}</p>}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="brands-actions">
          <button
            className={`add-to-cart-btn ${addedToCart ? 'added-animation' : ''}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || addedToCart}
          >
            {addedToCart ? "✓ Added!" : (isOutOfStock ? "Out of Stock" : (isInCart ? "Added to Cart" : "Add to Cart"))}
          </button>
          <button
            className={`whatsapp-btn ${isOutOfStock ? 'disabled' : ''}`}
            onClick={handleWhatsAppEnquiry}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Unavailable" : "WhatsApp Enquiry"}
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductCard;
