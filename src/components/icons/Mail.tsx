import React from 'react';

interface MailProps {
  size?: number;
  color?: string;
  className?: string;
}

const Mail: React.FC<MailProps> = ({ 
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
      className={`lucide lucide-mail-icon lucide-mail ${className}`}
    >
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-10 5L2 7"/>
    </svg>
  );
};

export default Mail;
