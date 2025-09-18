import React from 'react';
import { Smartphone, RefreshCw, MapPin, Truck, CreditCard, RotateCcw, Headphones } from 'lucide-react';
import './ServicePage.css';

const ServicePage: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Gadget Sales',
      description: 'We offer the latest phones, smartwatches, and accessories at competitive prices. Our extensive collection includes top brands and models to suit every need and budget.',
      icon: Smartphone,
      buttonText: 'Check out our gadgets →'
    },
    {
      id: 2,
      title: 'Phone Swap and Trade In',
      description: 'Trade in your old phone for a newer one at a discounted price. We make upgrading easy and affordable with our hassle-free trade-in program.',
      icon: RefreshCw,
      buttonText: 'Start a phone swap →'
    },
    {
      id: 3,
      title: 'Phone Tracking Support',
      description: 'Lost your phone? We provide tracking support for devices purchased from us. Our team helps you locate and recover your device quickly.',
      icon: MapPin,
      buttonText: 'Get help with tracking →'
    }
  ];

  const features = [
    {
      id: 1,
      title: 'Express Delivery',
      description: 'Fast and reliable delivery service to your doorstep. We ensure your gadgets reach you safely and on time.',
      icon: Truck
    },
    {
      id: 2,
      title: 'Pay in Crypto',
      description: 'Accept cryptocurrency payments for your convenience. Secure, fast, and modern payment options available.',
      icon: CreditCard
    },
    {
      id: 3,
      title: 'Hassle-free Returns',
      description: 'Easy return policy with no questions asked. We make returns simple and stress-free for our customers.',
      icon: RotateCcw
    },
    {
      id: 4,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you with any queries or technical issues you may have.',
      icon: Headphones
    }
  ];

  return (
    <div className="service-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Our Service</h1>
          <p>
            At BitGadgetz, we're not just here to sell gadgets. We're here to help you get the best tech experience with services that make things easy, affordable, and stress-free.
          </p>
          <button className="browse-btn">Browse Our Products</button>
        </div>
      </div>

      {/* What We Offer Section */}
      <section className="what-we-offer">
        <div className="container">
          <div className="section-header">
            <h2>What We Offer</h2>
            <p>Discover our comprehensive range of services designed to meet all your tech needs</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <service.icon size={48} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <button className="service-btn">{service.buttonText}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose BitGadgetz?</h2>
            <p>We're committed to providing exceptional service and value to our customers</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={40} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immediate Assistance Section */}
      <section className="immediate-assistance">
        <div className="container">
          <h2>Need Immediate Assistance?</h2>
          <p>Our WhatsApp support team is available 24/7 to help with your inquiries.</p>
          <button className="whatsapp-btn">Chat on WhatsApp</button>
        </div>
      </section>
    </div>
  );
};

export default ServicePage; 