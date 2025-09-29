import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import CategoriesPage from './components/CategoriesPage';
import BrandsPage from './components/BrandsPage';
import ProductsPage from './components/ProductsPage';
import AllProductsPage from './components/AllProductsPage';
import ServicePage from './components/ServicePage';
import ContactPage from './components/ContactPage';
import PhoneTrackingPage from './components/PhoneTrackingPage';
import PhoneSwapPage from './components/PhoneSwapPage';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import ProfileSettings from './components/ProfileSettings';
import ProductDetails from './components/ProductDetails';
import AboutUs from './components/AboutUs';
import OrderHistory from './components/OrderHistory';
import Wishlist from './components/Wishlist';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ToastDemo from './components/ToastDemo';
import { ToastProvider, useToast } from './hooks/useToast';
import './App.css';

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page without navbar */}
          <Route path="/" element={<LandingPage />} />

          {/* Home page with navbar and footer */}
          <Route path="/home" element={
            <>
              <Navbar />
              <main>
                <HomePage />
              </main>
              <Footer />
            </>
          } />

          {/* All other pages with navbar and footer */}
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
          <Route path="/all-products" element={
            <>
              <Navbar />
              <main>
                <AllProductsPage />
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
          <Route path="/about" element={
            <>
              <Navbar />
              <main>
                <AboutUs />
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
          <Route path="/contact-support" element={
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
          <Route path="/order-confirmation" element={
            <>
              <Navbar />
              <main>
                <OrderConfirmation />
              </main>
              <Footer />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:slug" element={
            <>
              <Navbar />
              <main>
                <ProductDetails />
              </main>
              <Footer />
            </>
          } />
          <Route path="/toast-demo" element={
            <>
              <Navbar />
              <main>
                <ToastDemo />
              </main>
              <Footer />
            </>
          } />
        </Routes>
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    </Router>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
