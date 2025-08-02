import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Home from './components/NewHome';
import CategoryPage from './components/CategoryPage';
import CategoriesPage from './components/CategoriesPage';
import BrandsPage from './components/BrandsPage';
import ProductsPage from './components/ProductsPage';
import ServicePage from './components/ServicePage';
import ContactPage from './components/ContactPage';
import PhoneTrackingPage from './components/PhoneTrackingPage';
import PhoneSwapPage from './components/PhoneSwapPage';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page without navbar */}
          <Route path="/" element={<LandingPage />} />

          {/* All other pages with navbar and footer */}
          <Route path="/home" element={
            <>
              <Navbar />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/categories" element={
            <>
              <Navbar />
              <main>
                <CategoriesPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/categories/:categoryName" element={
            <>
              <Navbar />
              <main>
                <CategoryPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/brands" element={
            <>
              <Navbar />
              <main>
                <BrandsPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/products" element={
            <>
              <Navbar />
              <main>
                <ProductsPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/service" element={
            <>
              <Navbar />
              <main>
                <ServicePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <main>
                <ContactPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/phone-tracking" element={
            <>
              <Navbar />
              <main>
                <PhoneTrackingPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/phone-swap" element={
            <>
              <Navbar />
              <main>
                <PhoneSwapPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Navbar />
              <main>
                <ShoppingCart />
              </main>
              <Footer />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Navbar />
              <main>
                <Checkout />
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
