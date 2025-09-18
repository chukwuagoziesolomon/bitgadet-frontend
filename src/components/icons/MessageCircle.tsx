import React from 'react';

interface MessageCircleProps {
  size?: number;
  color?: string;
  className?: string;
}

const MessageCircle: React.FC<MessageCircleProps> = ({ 
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
      className={`lucide lucide-message-circle-icon lucide-message-circle ${className}`}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  );
};

export default MessageCircle;
