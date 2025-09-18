import React from 'react';
import './BrandsPage.css';

const BrandsPage: React.FC = () => {
  // Brand data matching the design from the image
  const brands = [
    {
      id: 1,
      name: 'Apple',
      logo: '/Apple.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 2,
      name: 'Samsung',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 3,
      name: 'Xiaomi Redmi',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 4,
      name: 'Infinix',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 5,
      name: 'Tecno',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 6,
      name: 'Itel',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 7,
      name: 'Oraimo',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 8,
      name: 'HMD',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 9,
      name: 'MOL',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 10,
      name: 'realme',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 11,
      name: 'IZ Energy',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 12,
      name: 'Oppo',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    },
    {
      id: 13,
      name: 'ZTE',
      logo: '/phone1.png',
      description: 'Innovation that changes everything. From iPhone to Mac, Apple creates products that empower people to do amazing things.',
      rating: 4.8,
      productCount: 5,
      categories: ['Smartphones', 'Laptops']
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  const handleViewProducts = (brandName: string) => {
    console.log(`Viewing products for ${brandName}`);
    // Add navigation logic here
  };

  return (
    <div className="brands-page">
      <div className="brands-container">
        <div className="brands-header">
          <h1>Our Brands</h1>
          <p>Discover products from top technology brands</p>
          </div>

        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand.id} className="brand-card">
              <div className="brand-logo-container">
                <img src={brand.logo} alt={brand.name} className="brand-logo" />
        </div>

              <div className="brand-content">
                <h3 className="brand-name">{brand.name}</h3>
                <p className="brand-description">{brand.description}</p>
                
                <div className="brand-rating">
                  <div className="stars">
                    {renderStars(brand.rating)}
              </div>
                  <span className="rating-text">{brand.rating} {brand.productCount} products</span>
            </div>
            
                <div className="brand-categories">
                  {brand.categories.join(' ')}
              </div>
              
                <button 
                  className="view-products-btn"
                  onClick={() => handleViewProducts(brand.name)}
                >
                  View Products
                </button>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
