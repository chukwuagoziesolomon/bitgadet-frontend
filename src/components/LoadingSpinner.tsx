import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  overlay?: boolean;
  text?: string;
  variant?: 'elegant' | 'orbit' | 'flow' | 'pulse' | 'morph' | 'tech';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  fullScreen = false,
  overlay = true,
  text = 'Loading...',
  variant = 'elegant',
}) => {
  if (fullScreen) {
    return (
      <div className={`loading-fullscreen ${overlay ? 'with-overlay' : ''}`}>
        <div className={`loading-container loading-${size} loading-${variant}`}>
          {variant === 'elegant' && <ElegantLoader />}
          {variant === 'orbit' && <OrbitLoader />}
          {variant === 'flow' && <FlowLoader />}
          {variant === 'pulse' && <PulseLoader />}
          {variant === 'morph' && <MorphLoader />}
          {variant === 'tech' && <TechLoader />}
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-container loading-${size} loading-${variant}`}>
      {variant === 'elegant' && <ElegantLoader />}
      {variant === 'orbit' && <OrbitLoader />}
      {variant === 'flow' && <FlowLoader />}
      {variant === 'pulse' && <PulseLoader />}
      {variant === 'morph' && <MorphLoader />}
      {variant === 'tech' && <TechLoader />}
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

// ELEGANT LOADER - Smooth double ring with gradient
const ElegantLoader: React.FC = () => (
  <div className="spinner-elegant">
    <div className="elegant-ring elegant-ring-1"></div>
    <div className="elegant-ring elegant-ring-2"></div>
    <div className="elegant-center-dot"></div>
  </div>
);

// ORBIT LOADER - Animated orbiting particles
const OrbitLoader: React.FC = () => (
  <div className="spinner-orbit">
    <div className="orbit-particle orbit-particle-1"></div>
    <div className="orbit-particle orbit-particle-2"></div>
    <div className="orbit-particle orbit-particle-3"></div>
    <div className="orbit-center"></div>
  </div>
);

// FLOW LOADER - Liquid-like flowing animation
const FlowLoader: React.FC = () => (
  <div className="spinner-flow">
    <div className="flow-blob flow-blob-1"></div>
    <div className="flow-blob flow-blob-2"></div>
    <div className="flow-blob flow-blob-3"></div>
  </div>
);

// PULSE LOADER - Modern pulsing circles
const PulseLoader: React.FC = () => (
  <div className="spinner-pulse">
    <div className="pulse-circle pulse-circle-1"></div>
    <div className="pulse-circle pulse-circle-2"></div>
    <div className="pulse-circle pulse-circle-3"></div>
  </div>
);

// MORPH LOADER - Morphing shape animation
const MorphLoader: React.FC = () => (
  <div className="spinner-morph">
    <div className="morph-shape"></div>
  </div>
);

// TECH LOADER - Tech-inspired geometric animation
const TechLoader: React.FC = () => (
  <div className="spinner-tech">
    <div className="tech-line tech-line-1"></div>
    <div className="tech-line tech-line-2"></div>
    <div className="tech-line tech-line-3"></div>
    <div className="tech-line tech-line-4"></div>
  </div>
);

export default LoadingSpinner;
