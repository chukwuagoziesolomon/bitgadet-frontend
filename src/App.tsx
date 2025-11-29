import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import CategoriesPage from './components/CategoriesPage';
import BrandsPage from './components/BrandsPage';
import BrandPage from './components/BrandPage';
import AllProductsPage from './components/AllProductsPage';
import ServicePage from './components/ServicePage';
import ContactPage from './components/ContactPage';
import PhoneTrackingPage from './components/PhoneTrackingPage';
import PhoneSwapPage from './components/PhoneSwapPage';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import PaymentDetails from './components/PaymentDetails';

import ForgotPasswordPage from './components/ForgotPasswordPage';
import AboutUs from './components/AboutUs';
import TermsAndConditions from './components/TermsAndConditions';
import Footer from './components/Footer';
import CouponSuccess from './components/CouponSuccess';
import CouponSuccessBeautiful from './components/CouponSuccessBeautiful';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import ProfileSettings from './components/ProfileSettings';
import OrderHistory from './components/OrderHistory';
import WishlistPage from './components/WishlistPage';
import ProductDetails from './components/ProductDetails';
import SearchResultsPage from './components/SearchResultsPage';
import ToastDemo from './components/ToastDemo';
import SuccessPage from './components/SuccessPage';
import ToastContainer from './components/ToastContainer';
import { ToastProvider, useToast } from './hooks/useToast';
import GlobalLoadingProvider from './hooks/useGlobalLoading';

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <ScrollToTop />
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
          <Route path="/brands/:brandName" element={
            <>
              <Navbar />
              <main>
                <BrandPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/products" element={<Navigate to="/all-products" replace />} />
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
          <Route path="/terms" element={
            <>
              <Navbar />
              <main>
                <TermsAndConditions />
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
          <Route path="/payment-details" element={<PaymentDetails />} />
          <Route path="/order-confirmation" element={
            <>
              <Navbar />
              <main>
                <OrderConfirmation />
              </main>
              <Footer />
            </>
          } />
          <Route path="/coupon/success/:orderId" element={
            <>
              <Navbar />
              <main>
                <CouponSuccess />
              </main>
              <Footer />
            </>
          } />
          <Route path="/coupon-success/:orderId" element={
            <>
              <main style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
                <CouponSuccessBeautiful />
              </main>
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/product/:slug" element={
            <>
              <Navbar />
              <main>
                <ProductDetails />
              </main>
              <Footer />
            </>
          } />
          <Route path="/search" element={
            <>
              <Navbar />
              <main>
                <SearchResultsPage />
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
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </div>
    </Router>
  );
};

function App() {
  return (
    <ToastProvider>
      <GlobalLoadingProvider>
        <AppContent />
      </GlobalLoadingProvider>
    </ToastProvider>
  );
}

export default App;
