import React from 'react';
import Smartphone from '../icons/Smartphone';
import Laptop from '../icons/Laptop';
import Watch from '../icons/Watch';
import Headphones from '../icons/Headphones';
import ShoppingBag from '../icons/ShoppingBag';
import TrendingUp from '../icons/TrendingUp';
import Gamepad2 from '../icons/Gamepad2';
import '../Home.css';

interface CategoryCardProps {
  name: string;
  image: string;
  description: string;
  items: number;
  iconType: string;
}



const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, description, items, iconType }) => {
  const getIcon = () => {
    const iconColor = '#00c896'; // Search bar color
    switch (iconType) {
      case 'phone':
        return <Smartphone size={20} color={iconColor} />;
      case 'laptop':
        return <Laptop size={20} color={iconColor} />;
      case 'tablet':
        return <Smartphone size={20} color={iconColor} />;
      case 'games':
        return <Gamepad2 size={20} color={iconColor} />;
      case 'watch':
        return <Watch size={20} color={iconColor} />;
      case 'accessories':
        return <Headphones size={20} color={iconColor} />;
      default:
        return <ShoppingBag size={20} color={iconColor} />;
    }
  };
  return (
    <div className="category-card improved">
      <div className="image-container">
        <img src={image} alt={name} />
        <div className="overlay-icon">{getIcon()}</div>
      </div>
      <h4 className="cat-title">{name}</h4>
      <p className="cat-desc">{description}</p>
      <span className="items-badge">
        <TrendingUp size={14} color="#008060" />
        {items} Items
      </span>
      <button className="shop-link">Shop Now →</button>
    </div>
  );
};

export default CategoryCard;
