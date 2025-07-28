import React, { useState, useEffect } from 'react';
import './PriceFilter.css';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  currency?: string;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  currency = '₦',
}) => {
  const [min, setMin] = useState<number>(minPrice);
  const [max, setMax] = useState<number>(maxPrice);
  const [localMin, setLocalMin] = useState<number>(minPrice);
  const [localMax, setLocalMax] = useState<number>(maxPrice);

  // Format number with commas for display
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), max - 1);
    setLocalMin(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), min + 1);
    setLocalMax(value);
  };

  const handleApplyFilter = () => {
    setMin(localMin);
    setMax(localMax);
    onPriceChange(localMin, localMax);
  };

  // Calculate the fill for the range slider track
  const minPercent = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className="price-filter">
      <h3 className="filter-title">Filter by Price</h3>
      <div className="price-range-display">
        <span className="price-value">{currency}{formatNumber(localMin)}</span>
        <span className="price-separator">-</span>
        <span className="price-value">{currency}{formatNumber(localMax)}</span>
      </div>
      
      <div className="range-slider">
        <div 
          className="range-fill" 
          style={{ 
            left: `${minPercent}%`, 
            width: `${maxPercent - minPercent}%` 
          }} 
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localMin}
          onChange={handleMinChange}
          onMouseUp={handleApplyFilter}
          onTouchEnd={handleApplyFilter}
          className="range-input min-range"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localMax}
          onChange={handleMaxChange}
          onMouseUp={handleApplyFilter}
          onTouchEnd={handleApplyFilter}
          className="range-input max-range"
          aria-label="Maximum price"
        />
      </div>
      
      <button className="apply-filter-btn" onClick={handleApplyFilter}>
        Filter
      </button>
    </div>
  );
};

export default PriceFilter;
