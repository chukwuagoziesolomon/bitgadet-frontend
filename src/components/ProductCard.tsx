import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number;
  usdtPrice: string;
  rating: number;
  reviews: number;
  badges: string[];
  inStock: boolean;
  showBadges?: boolean;
  showWishlist?: boolean;
  showActions?: boolean;
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  image,
  price,
  originalPrice,
  usdtPrice,
  rating,
  reviews,
  badges,
  inStock,
  showBadges = true,
  showWishlist = true,
  showActions = true,
  onAddToCart,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(id);
    }
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hi! I'm interested in the ${name} by ${brand}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/2348123456789?text=${encodeURIComponent(message)}`;
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

  return (
    <div className="product-card-component">
      <div className="brands-product-card" onClick={handleCardClick}>
      {/* Badges + Wishlist */}
      <div className="card-header">
        {showBadges && (
          <div className="badges">
            {badges.map((badge, index) => (
              <span key={index} className={`badge ${badge.toLowerCase().replace(/\s+/g, "-")}`}>
                {badge}
              </span>
            ))}
          </div>
        )}
        {showWishlist && (
          <button className="wishlist-btn" onClick={handleWishlistToggle}>
            ♡
          </button>
        )}
      </div>

      {/* Product Image */}
      <div className="brands-product-image-container">
        <img src={image} alt={name} className="brands-product-image" />
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
          <span className="brands-current-price">
            ₦{price.toLocaleString()}
          </span>
          <span className="brands-original-price">
            ₦{originalPrice.toLocaleString()}
          </span>
        </div>
        <p className="brands-usdt-price">{usdtPrice}</p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="brands-actions">
          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <button 
            className="whatsapp-btn" 
            onClick={handleWhatsAppEnquiry}
          >
            WhatsApp Enquiry
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductCard;
