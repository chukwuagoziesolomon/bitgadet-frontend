import React from "react";
import ProductCard from "./ProductCard";

// Example usage of the ProductCard component
const ProductCardExample: React.FC = () => {
  // Sample product data
  const sampleProduct = {
    id: 1,
    name: "iPhone 15 Pro",
    brand: "Apple",
    image: "/phone.png", // Make sure this image exists in your public folder
    price: 1850000,
    originalPrice: 2100000,
    usdtPrice: "650 USDT",
    rating: 4.5,
    reviews: 64,
    badges: ["New", "Sale", "Bestseller"],
    inStock: true,
  };

  const handleAddToCart = (productId: number) => {
    console.log(`Adding product ${productId} to cart`);
    // Cart logic handled by ProductCard component - no alert needed
  };

  const handleToggleWishlist = (productId: number) => {
    console.log(`Toggling wishlist for product ${productId}`);
    // Wishlist logic handled by ProductCard component - no alert needed
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Product Card Example</h2>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
        <ProductCard
          {...sampleProduct}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
        
        {/* Another example with different data */}
        <ProductCard
          id={2}
          name="Samsung Galaxy S24 Ultra"
          brand="Samsung"
          image="/phone1.png"
          price={1650000}
          originalPrice={1800000}
          usdtPrice="580 USDT"
          rating={4.3}
          reviews={42}
          badges={["New", "Sale"]}
          inStock={true}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>
    </div>
  );
};

export default ProductCardExample;
