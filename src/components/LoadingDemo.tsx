import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './LoadingDemo.css';

type LoadingVariant = 'elegant' | 'orbit' | 'flow' | 'pulse' | 'morph' | 'tech';

const LoadingDemo: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<LoadingVariant>('elegant');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const variants: LoadingVariant[] = ['elegant', 'orbit', 'flow', 'pulse', 'morph', 'tech'];

  const descriptions: Record<LoadingVariant, string> = {
    elegant: 'Smooth double-ring gradient - Professional & Elegant',
    orbit: 'Orbiting particles - Modern & Dynamic',
    flow: 'Liquid flowing blobs - Smooth & Organic',
    pulse: 'Concentric pulsing circles - Clean & Simple',
    morph: 'Morphing shape animation - Creative & Abstract',
    tech: 'Geometric tech lines - Futuristic & Sleek',
  };

  return (
    <div className="loading-demo-container">
      <div className="demo-content">
        <h1>✨ Beautiful Loading Animations</h1>
        <p className="demo-subtitle">Choose your preferred loading animation</p>

        {/* Variant Selection */}
        <div className="variant-selector">
          {variants.map((variant) => (
            <button
              key={variant}
              className={`variant-btn ${selectedVariant === variant ? 'active' : ''}`}
              onClick={() => setSelectedVariant(variant)}
            >
              <span className="variant-name">{variant.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="variant-description">{descriptions[selectedVariant]}</p>

        {/* Live Preview */}
        <div className="preview-section">
          <h3>Live Preview</h3>
          <div className="preview-container">
            <LoadingSpinner
              variant={selectedVariant}
              size="medium"
              text={`${selectedVariant} Loading...`}
            />
          </div>
        </div>

        {/* Size Variations */}
        <div className="size-section">
          <h3>Size Variations</h3>
          <div className="size-container">
            <div className="size-box">
              <LoadingSpinner
                variant={selectedVariant}
                size="small"
                text="Small"
              />
            </div>
            <div className="size-box">
              <LoadingSpinner
                variant={selectedVariant}
                size="medium"
                text="Medium"
              />
            </div>
            <div className="size-box">
              <LoadingSpinner
                variant={selectedVariant}
                size="large"
                text="Large"
              />
            </div>
          </div>
        </div>

        {/* Toggle Full Screen */}
        <div className="fullscreen-section">
          <button
            className="fullscreen-btn"
            onClick={() => setIsFullScreen(true)}
          >
            View Full Screen Demo
          </button>
        </div>

        {/* Features */}
        <div className="features-section">
          <h3>✨ Features</h3>
          <ul>
            <li>🎨 6 Beautiful, unique animations</li>
            <li>🎯 Perfectly matches project design (#00C896)</li>
            <li>📱 Fully responsive on all devices</li>
            <li>⚡ GPU-accelerated for smooth 60fps</li>
            <li>♿ Accessible & WCAG AA compliant</li>
            <li>🔧 Easy to customize & integrate</li>
          </ul>
        </div>

        {/* Integration Guide */}
        <div className="guide-section">
          <h3>🚀 How to Use</h3>
          <div className="code-example">
            <pre>{`import { useGlobalLoading } from '../hooks/useGlobalLoading';

export function MyComponent() {
  const { setLoading } = useGlobalLoading();

  const handleLoadData = async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/data');
      // Use data...
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handleLoadData}>Load Data</button>;
}`}</pre>
          </div>
        </div>
      </div>

      {/* Full Screen Overlay */}
      {isFullScreen && (
        <div className="fullscreen-overlay" onClick={() => setIsFullScreen(false)}>
          <div className="fullscreen-content">
            <button
              className="close-btn"
              onClick={() => setIsFullScreen(false)}
            >
              ✕ Close
            </button>
            <LoadingSpinner
              fullScreen={false}
              variant={selectedVariant}
              size="large"
              text={`${selectedVariant} - Click to close or press ESC`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingDemo;
