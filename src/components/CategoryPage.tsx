import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard, { ProductCardProps } from './home/ProductCard';
import FilterSidebar from './filters/FilterSidebar';
import './CategoryPage.css';

interface Product extends ProductCardProps {
  category?: string;
}

// This would normally come from an API
const allProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    brand: 'APPLE',
    price: '₦1,850,000',
    originalPrice: '₦2,100,000',
    image: '/phone.png',
    rating: 4.5,
    reviews: 84,
    discount: '-12%',
    isNew: true,
    inStock: true,
    category: 'smartphones'
  },
  {
    id: 2,
    name: 'Play Station (PS) 5 Console',
    brand: 'SONY',
    price: '₦1,850,000',
    originalPrice: '₦2,050,000',
    image: '/games.png',
    rating: 4.8,
    reviews: 64,
    discount: '-10%',
    isNew: false,
    inStock: false,
    category: 'gaming'
  },
  // Add more products with categories as needed
];

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  
  // Calculate min and max price from all products
  const { minPrice, maxPrice } = useMemo(() => {
    if (allProducts.length === 0) return { minPrice: 0, maxPrice: 1000000 };
    
    const prices = allProducts
      .map(p => parseInt(p.price.replace(/[^0-9]/g, '')) || 0)
      .filter(price => !isNaN(price));
      
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    };
  }, [allProducts]);

  // Load products (in a real app, this would be an API call)
  useEffect(() => {
    // This would be replaced with an actual API call in a real application
    setAllProducts([
      {
        id: 1,
        name: 'iPhone 15 Pro',
        brand: 'APPLE',
        price: '₦1,850,000',
        originalPrice: '₦2,100,000',
        image: '/phone.png',
        rating: 4.5,
        reviews: 84,
        discount: '-12%',
        isNew: true,
        inStock: true,
        category: 'smartphones'
      },
      {
        id: 2,
        name: 'MacBook Pro 16\"',
        brand: 'APPLE',
        price: '₦2,500,000',
        originalPrice: '₦2,800,000',
        image: '/laptop.png',
        rating: 4.8,
        reviews: 120,
        discount: '-11%',
        isNew: false,
        inStock: true,
        category: 'laptops'
      },
      // Add more products as needed
    ]);
  }, []);

  // Filter products by category and price
  useEffect(() => {
    // Convert URL-friendly name to display name (e.g., 'smart-phones' -> 'Smart Phones')
    const displayName = categoryName
      ? categoryName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'All Categories';

    setCategoryTitle(displayName);

    let filtered = [...allProducts];

    // Filter by category
    if (categoryName && categoryName.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        product => product.category?.toLowerCase() === categoryName.toLowerCase()
      );
    }

    // Filter by price
    filtered = filtered.filter(product => {
      const price = parseInt(product.price.replace(/[^0-9]/g, '')) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });

    setFilteredProducts(filtered);
  }, [categoryName, allProducts, priceRange]);
  
  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{categoryTitle}</h1>
        <p className="product-count">{filteredProducts.length} products found</p>
      </div>
      
      <div className="category-content">
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
              // Create a new object without the category property
              const { category, ...productProps } = product;
              return <ProductCard key={product.id} {...productProps} />;
            })
          ) : (
            <div className="no-products">
              <p>No products found matching your filters.</p>
            </div>
          )}
        </div>
        
        <FilterSidebar 
          onPriceFilter={handlePriceFilter}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
