import React, { useEffect, useRef } from 'react';
import { Smartphone, Headphones, Tablet, Watch, Speaker, Laptop } from 'lucide-react';
import './GadgetCarousel.css';

const GadgetCarousel: React.FC = () => {
  const items = [
    { id: 1, icon: <Smartphone size={32} />, name: 'Smartphones' },
    { id: 2, icon: <Headphones size={32} />, name: 'Headphones' },
    { id: 3, icon: <Tablet size={32} />, name: 'Tablets' },
    { id: 4, icon: <Watch size={32} />, name: 'Smart Watches' },
    { id: 5, icon: <Speaker size={32} />, name: 'Speakers' },
    { id: 6, icon: <Laptop size={32} />, name: 'Laptops' },
  ];

  const circleRef = useRef<HTMLDivElement>(null);
  let currentRotation = 0;
  let animationFrameId: number;
  const rotationSpeed = 0.1; // Adjust speed as needed
  let isHovered = false;

  const rotateCircle = () => {
    if (!isHovered) {
      currentRotation += rotationSpeed;
      if (circleRef.current) {
        circleRef.current.style.transform = `rotate(${currentRotation}deg)`;
      }
    }
    animationFrameId = requestAnimationFrame(rotateCircle);
  };

  useEffect(() => {
    animationFrameId = requestAnimationFrame(rotateCircle);
    
    const circle = circleRef.current;
    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    if (circle) {
      circle.addEventListener('mouseenter', handleMouseEnter);
      circle.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (circle) {
        circle.removeEventListener('mouseenter', handleMouseEnter);
        circle.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="gadget-carousel">
      <div className="circle" ref={circleRef}>
        {items.map((item, index) => {
          const angle = (index * (360 / items.length)) * (Math.PI / 180);
          const radius = 180; // Adjust the radius as needed
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div 
              key={item.id}
              className="gadget-item"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div className="gadget-icon">
                {item.icon}
              </div>
              <span className="gadget-name">{item.name}</span>
            </div>
          );
        })}
        <div className="center-logo">
          <div className="logo-circle">
            <span>BitGadget</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GadgetCarousel;
