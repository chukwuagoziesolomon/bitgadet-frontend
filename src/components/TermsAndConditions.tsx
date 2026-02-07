import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        {/* Header */}
        <div className="terms-header">
          <h1>Terms and Conditions</h1>
          <p className="terms-intro">
            Welcome to BitGadgetz. By accessing or using our website and services, you agree to comply with these Terms and Conditions. 
            If you do not agree, please do not use our website or services.
          </p>
          <div className="last-updated">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Terms Content */}
        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Bitgadgetz. By accessing or using our website and services, you agree to comply with these Terms and Conditions. 
              If you do not agree, please do not use our website or services.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Services</h2>
            <p>Bitgadgetz provides:</p>
            <ul>
              <li>Online sales of gadgets and accessories</li>
              <li>Phone swap services</li>
              <li>Phone tracking services</li>
              <li>Payment via cryptocurrency and traditional methods</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. User Accounts</h2>
            <p>
              To use certain services, you may need to create an account. You are responsible for maintaining the confidentiality of your 
              account details and for all activity under your account.
            </p>
          </section>

          <section className="terms-section">
            <h2>4. Orders and Payments</h2>
            <ul>
              <li>All orders are subject to acceptance by Bitgadgetz.</li>
              <li>Payment must be completed before an order is processed.</li>
              <li>We accept payment via supported cryptocurrencies and traditional methods.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Delivery</h2>
            <ul>
              <li>We aim to deliver products within the estimated timeframes provided.</li>
              <li>Delivery times may vary due to unforeseen circumstances or shipping delays.</li>
              <li>Bitgadgetz is not responsible for delays caused by third-party courier services.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Returns and Refunds</h2>
            
            <h3>6.1 General</h3>
            <p>
              All returns, refunds, and exchanges are subject to Bitgadgetz's Refund & Return Policy, which forms an integral 
              part of these Terms and Conditions. By placing an order, you acknowledge that you have read and agreed to this policy.
            </p>

            <h3>6.2 New Gadgets</h3>
            <p>New gadgets may be eligible for return only if:</p>
            <ul>
              <li>The product is unused, unopened, and in its original sealed packaging</li>
              <li>The return request is made within the timeframe stated in the Refund & Return Policy</li>
              <li>Proof of purchase is provided</li>
            </ul>
            <p>Any new gadget that has been activated, unsealed, or shows signs of use shall not be eligible for a refund.</p>

            <h3>6.3 Used Gadgets</h3>
            <ul>
              <li>All used gadgets are sold after testing and condition disclosure.</li>
              <li>Used gadgets are non-refundable once sold, except where a verified functional defect exists that was not 
                  disclosed at the time of sale and is reported within the stated inspection period.</li>
            </ul>

            <h3>6.4 Inspection and Approval</h3>
            <p>
              All returned items are subject to inspection by Bitgadgetz. Refunds, replacements, or store credit will only be 
              issued after verification that the return meets policy requirements.
            </p>

            <h3>6.5 Refund Method</h3>
            <p>
              Approved refunds will be processed via the original payment method or store credit, at Bitgadgetz's discretion. 
              Processing times may vary depending on the payment method used.
            </p>

            <h3>6.6 Non-Refundable Circumstances</h3>
            <p>Refunds will not be issued for:</p>
            <ul>
              <li>Change-of-mind purchases</li>
              <li>Compatibility or software-related issues</li>
              <li>Damage caused by misuse, accidents, or unauthorized repairs</li>
              <li>Clearance, promotional, or "as-is" items (where stated)</li>
            </ul>

            <h3>6.7 Return Shipping</h3>
            <p>
              Customers are responsible for return shipping costs unless the item is confirmed to be faulty or incorrectly 
              supplied by Bitgadgetz.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Product Authenticity</h2>
            <p>
              We guarantee that all gadgets sold through Bitgadgetz are authentic and as described. However, we are not responsible 
              for third-party counterfeit products purchased elsewhere.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Limitation of Liability</h2>
            <ul>
              <li>Bitgadgetz is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</li>
              <li>We are not responsible for lost profits or data resulting from the use of our website or services.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>9. Intellectual Property</h2>
            <p>
              All content on the Bitgadgetz website, including text, images, logos, and software, is the property of Bitgadgetz 
              and is protected by copyright laws.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for illegal purposes</li>
              <li>Attempt to access other users' accounts</li>
              <li>Post or transmit content that is unlawful, harmful, or offensive</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>11. Modifications</h2>
            <p>
              Bitgadgetz reserves the right to modify these Terms and Conditions at any time. Updated terms will be posted on the 
              website, and continued use constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>12. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of Nigeria. Any disputes arising will be subject to the 
              jurisdiction of Nigerian courts.
            </p>
          </section>
        </div>

        {/* Contact Information */}
        <div className="terms-contact">
          <h3>Contact Information</h3>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <div className="contact-details">
            <p><strong>Email:</strong> support@bitgadgetz.store</p>
            <p><strong>Phone:</strong> +2349138666111</p>
            <p><strong>WhatsApp:</strong> +2349061728949</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;







