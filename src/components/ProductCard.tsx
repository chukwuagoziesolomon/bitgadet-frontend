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
  isInCart?: boolean;
  isInWishlist?: boolean;
  onToggleWishlist?: (productId: number, willBeInWishlist?: boolean) => void;
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
  badges,
  inStock,
  showBadges = true,
  showWishlist = true,
  showActions = true,
  onAddToCart,
  isInCart = false,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = React.useState(false);

  const handleCardClick = () => {
    navigate(`/product/${slug || id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000); // Reset after 2 seconds
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(id, true); // Add to wishlist
    }
  };

  const handleWishlistDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(id, false); // Remove from wishlist
    }
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello, I'd like to enquire about ${name} (ID: ${id}) by ${brand}.`;
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
            className={`add-to-cart-btn ${addedToCart ? 'added-animation' : ''}`}
            onClick={handleAddToCart}
            disabled={!inStock || addedToCart}
          >
            {addedToCart ? "✓ Added!" : (inStock ? (isInCart ? "Added to Cart" : "Add to Cart") : "Out of Stock")}
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
