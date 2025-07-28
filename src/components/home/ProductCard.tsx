import React from 'react';
import HeartMinus from '../icons/HeartMinus';
import '../Home.css';

export interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  discount?: string;
  isNew?: boolean;
  inStock?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  price, 
  originalPrice,
  image, 
  brand,
  rating,
  reviews,
  discount,
  isNew = false,
  inStock = true
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  return (
    <div className="product-card-new">
      {/* Product Image */}
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
        
        {/* Tags */}
        <div className="product-tags">
          {discount && <span className="tag discount">{discount}</span>}
          {isNew && <span className="tag new">NEW</span>}
          {!inStock && <span className="tag out-of-stock">Out of stock</span>}
        </div>
        
        {/* Heart Icon */}
        <button className="wishlist-btn">
          <HeartMinus size={16} />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <div className="product-brand">{brand}</div>
        <h3 className="product-name">{name}</h3>
        
        {/* Rating */}
        <div className="product-rating">
          <div className="stars">{renderStars(rating)}</div>
          <span className="rating-text">({reviews}) • {reviews} reviews</span>
        </div>
        
        {/* Price */}
        <div className="product-pricing">
          <span className="current-price">{price}</span>
          {originalPrice && <span className="original-price">{originalPrice}</span>}
        </div>
        
        {/* Actions */}
        <div className="product-actions">
          <button className="add-to-cart-btn" disabled={!inStock}>
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button className="whatsapp-btn">WhatsApp Enquiry</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
