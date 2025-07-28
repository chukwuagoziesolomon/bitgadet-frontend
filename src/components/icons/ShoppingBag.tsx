import React from 'react';

interface ShoppingBagProps {
  size?: number;
  color?: string;
  className?: string;
}

const ShoppingBag: React.FC<ShoppingBagProps> = ({ 
  size = 24, 
  color = "currentColor", 
  className = "" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`lucide lucide-shopping-bag ${className}`}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <path d="M3 6h18"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
};

export default ShoppingBag;
