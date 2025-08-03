import React from 'react';
import { HeartPlus } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  image: string;
  price: string;
  originalPrice: string;
  usdtPrice: string;
  rating: number;
  reviews: number;
  badges?: string[];
  inStock: boolean;
  showBadges?: boolean;
  showWishlist?: boolean;
  showActions?: boolean;
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
  badges = [],
  inStock,
  showBadges = true,
  showWishlist = true,
  showActions = true
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - rating < 1) {
        stars.push(<span key={i} className="star partial">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        {showWishlist && (
          <button className="wishlist-btn">
            <HeartPlus size={20} />
          </button>
        )}
        {showBadges && badges.length > 0 && (
          <div className="product-badges">
            {badges.map((badge, index) => (
              <span key={index} className={`badge ${badge.includes('OFF') ? 'discount' : badge.includes('New') ? 'new' : 'bestseller'}`}>
                {badge}
              </span>
            ))}
            {!inStock && (
              <span className="badge out-of-stock">Out of Stock</span>
            )}
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{brand} {name}</h3>
        <div className="product-rating">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <span className="rating-text">({rating}) - {reviews} reviews</span>
        </div>
        <div className="product-price">
          <span className="current-price">{price}</span>
          <span className="original-price">{originalPrice}</span>
          <span className="usdt-price">{usdtPrice}</span>
        </div>
        
        {showActions && (
          inStock ? (
            <div className="product-actions">
              <button className="add-to-cart-btn">Add to Cart</button>
              <button className="whatsapp-btn">WhatsApp Enquiry</button>
            </div>
          ) : (
            <div className="out-of-stock-text">Out of stock</div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductCard; 