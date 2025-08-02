import React from 'react';

interface TabletProps {
  size?: number;
  color?: string;
  className?: string;
}

const Tablet: React.FC<TabletProps> = ({ 
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
      className={`lucide lucide-tablet ${className}`}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <line x1="12" x2="12.01" y1="18" y2="18"/>
    </svg>
  );
};

export default Tablet;
