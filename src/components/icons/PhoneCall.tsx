import React from 'react';

interface PhoneCallProps {
  size?: number;
  color?: string;
  className?: string;
}

const PhoneCall: React.FC<PhoneCallProps> = ({ 
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
      className={`lucide lucide-phone-call-icon lucide-phone-call ${className}`}
    >
      <path d="M13 2a9 9 0 0 1 9 9"/>
      <path d="M13 6a5 5 0 0 1 5 5"/>
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
    </svg>
  );
};

export default PhoneCall;
