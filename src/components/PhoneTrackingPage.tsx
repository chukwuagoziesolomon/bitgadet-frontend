import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import './PhoneTrackingPage.css';

const PhoneTrackingPage: React.FC = () => {
  const [trackingInfo, setTrackingInfo] = useState({
    imei: '',
    serialNumber: '',
    phoneNumber: '',
    lastKnownLocation: ''
  });

  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTrackingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate tracking API call
    setTimeout(() => {
      setTrackingResult({
        status: 'Found',
        lastSeen: '2 hours ago',
        location: 'Lagos, Nigeria',
        batteryLevel: '45%',
        networkStatus: 'Connected'
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="phone-tracking-page">

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Phone Tracking Service</h1>
          <p>Lost your phone? Our professional tracking service can help you locate and recover your device quickly and securely.</p>
        </div>
      </section>

      {/* Information Banner */}
      <section className="info-banner-section">
        <div className="container">
          <div className="info-banner">
            <div className="banner-content">
              <Shield className="banner-icon" size={24} />
              <div className="banner-text">
                <strong>Important:</strong> Phone tracking service is only available for devices purchased from us within the last 24 months. Please ensure you have your purchase receipt and device information ready.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column - Tracking Form */}
            <div className="tracking-form-column">
              <div className="info-banner">
                <Shield size={20} />
                <p>Phone tracking service is only available for devices purchased from us. To access the tracking feature of our devices, the purchase date should be within 24 months of the current date.</p>
              </div>

              <div className="form-card">
                <h2>Submit Tracking Request</h2>

                <form onSubmit={handleSubmit} className="tracking-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number *</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={trackingInfo.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+234 XXX XXX XXXX"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="imei">IMEI Number *</label>
                      <input
                        type="text"
                        id="imei"
                        name="imei"
                        value={trackingInfo.imei}
                        onChange={handleInputChange}
                        placeholder="15-digit IMEI number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="serialNumber">Device Model *</label>
                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      value={trackingInfo.serialNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., iPhone 15 Pro Max"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastKnownLocation">Last Known Location</label>
                    <input
                      type="text"
                      id="lastKnownLocation"
                      name="lastKnownLocation"
                      value={trackingInfo.lastKnownLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., Lagos Island, Victoria Island"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="additionalInfo">Additional Information</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Provide any additional details about your device or tracking request..."
                      rows={4}
                    />
                  </div>

                  <button type="submit" className="submit-tracking-btn" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Submit Tracking Request'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Service Plans */}
            <div className="service-plans-column">
              <h2>Service Plans</h2>

              <div className="plan-card featured">
                <div className="plan-header">
                  <h3>Standard Recovery</h3>
                  <div className="price">₦5,000</div>
                  <div className="duration">24 hours</div>
                </div>
                <ul className="plan-features">
                  <li>✓ Basic device tracking</li>
                  <li>✓ Basic recovery report</li>
                  <li>✓ 24 hour investigation</li>
                  <li>✓ Email support</li>
                  <li>✓ Phone support</li>
                </ul>
                <div className="plan-badge">
                  <span className="badge advanced">Advanced Tracking</span>
                  <span className="badge popular">Popular</span>
                </div>
              </div>

              <div className="plan-card">
                <div className="plan-header">
                  <h3>Premium Recovery</h3>
                  <div className="price">₦25,000</div>
                  <div className="duration">12 hours</div>
                </div>
                <ul className="plan-features">
                  <li>✓ GPS device tracking</li>
                  <li>✓ Live device tracking</li>
                  <li>✓ Advanced recovery</li>
                  <li>✓ 12 hour investigation</li>
                  <li>✓ Priority support</li>
                  <li>✓ Recovery assistance</li>
                </ul>
              </div>

              <div className="plan-card">
                <div className="plan-header">
                  <h3>Standard Recovery</h3>
                  <div className="price">₦65,000</div>
                  <div className="duration">6 hours</div>
                </div>
                <ul className="plan-features">
                  <li>✓ GPS tracking hunt</li>
                  <li>✓ Live device tracking</li>
                  <li>✓ Advanced recovery</li>
                  <li>✓ 6 hour investigation</li>
                  <li>✓ Priority support</li>
                  <li>✓ Recovery assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Tracking Service Works */}
      <section className="how-tracking-works">
        <div className="container">
          <h2>How Our Tracking Service Works</h2>

          <div className="tracking-steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Submit Request</h3>
                <p>Fill out the tracking form with your device details and contact information.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Payment & Verification</h3>
                <p>Choose your tracking plan and complete payment. We'll verify your ownership.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Investigation Begins</h3>
                <p>Our team starts the tracking process using advanced tools and techniques.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Receive Results</h3>
                <p>Get detailed reports and assistance with device recovery or location.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="need-help">
        <div className="container">
          <h3>Need Help?</h3>
          <p>Our tracking experts are available 24/7 to assist you with any questions or concerns.</p>
          <button className="help-support-button">
            Get Support
          </button>
        </div>
      </section>

      {/* Legal & Privacy Notice */}
      <section className="legal-notice">
        <div className="container">
          <div className="legal-grid">
            <div className="legal-column">
              <h3>Terms and Conditions</h3>
              <ul>
                <li>Service is only available for devices purchased from BitGadgetz</li>
                <li>Device must be purchased within 24 months</li>
                <li>Tracking success is not guaranteed</li>
                <li>Refunds are not available once investigation begins</li>
              </ul>
            </div>

            <div className="legal-column">
              <h3>Privacy Policy</h3>
              <ul>
                <li>All personal information will be kept confidential</li>
                <li>Data will only be used for tracking purposes</li>
                <li>Information will not be shared with third parties</li>
                <li>Data will be deleted after case completion</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhoneTrackingPage;
