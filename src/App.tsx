import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/NewHome';
import CategoryPage from './components/CategoryPage';
import CategoriesPage from './components/CategoriesPage';
import BrandsPage from './components/BrandsPage';
import ProductsPage from './components/ProductsPage';
import ServicePage from './components/ServicePage';
import ContactPage from './components/ContactPage';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryName" element={<CategoryPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
