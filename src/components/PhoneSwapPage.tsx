import React, { useState } from 'react';
import { Smartphone, Shield, Search, CheckCircle, Clock } from 'lucide-react';
import './PhoneSwapPage.css';

const PhoneSwapPage: React.FC = () => {
  const [currentDeviceInfo, setCurrentDeviceInfo] = useState({
    brand: '',
    model: '',
    imei: '',
    serialNumber: ''
  });

  const [newDeviceInfo, setNewDeviceInfo] = useState({
    brand: '',
    model: '',
    storage: '',
    color: '',
    imei: '',
    serialNumber: ''
  });

  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    location: ''
  });

  const [deviceCondition, setDeviceCondition] = useState({
    screenCondition: '',
    batteryCondition: '',
    physicalCondition: '',
    functionalIssues: '',
    includedAccessories: {
      originalBox: false,
      cable: false,
      case: false,
      charger: false,
      earphones: false,
      screenProtector: false
    }
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    additionalNotes: '',
    agreeToTerms: false
  });

  const handleCurrentDeviceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentDeviceInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewDeviceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDeviceInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeviceCondition(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccessoryChange = (accessory: string) => {
    setDeviceCondition(prev => ({
      ...prev,
      includedAccessories: {
        ...prev.includedAccessories,
        [accessory]: !prev.includedAccessories[accessory as keyof typeof prev.includedAccessories]
      }
    }));
  };

  const handleAdditionalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setAdditionalInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Phone swap request submitted:', {
      currentDevice: currentDeviceInfo,
      newDevice: newDeviceInfo,
      contact: contactInfo,
      condition: deviceCondition,
      additionalInfo: additionalInfo
    });
  };

  return (
    <div className="phone-swap-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Phone Swap Service</h1>
          <p>Upgrade your device with our comprehensive phone swap service. We make it seamless to transition from your old phone to your new one.</p>
        </div>
      </section>

      {/* How Phone Swap Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Phone Swap Works</h2>
          <p>Our step-by-step process makes upgrading your phone quick and hassle-free</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <Search size={32} />
              </div>
              <h3>Select Your Old Device</h3>
              <p>Choose your current device from our extensive database and get an instant valuation</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">
                <Smartphone size={32} />
              </div>
              <h3>Pick the Latest Device</h3>
              <p>Browse our collection of the latest smartphones and select your upgrade</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">
                <Shield size={32} />
              </div>
              <h3>Secure Data Transfer</h3>
              <p>We ensure all your data, contacts, and apps are safely transferred to your new device</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">
                <CheckCircle size={32} />
              </div>
              <h3>Quality Assurance</h3>
              <p>Every device goes through rigorous testing to ensure optimal performance</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon">
                <Clock size={32} />
              </div>
              <h3>Same-day Pickup</h3>
              <p>Schedule a convenient pickup time and get your new device delivered the same day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Swap Form */}
      <section className="phone-swap-form">
        <div className="container">
          <h2>Start Your Phone Swap</h2>
          <p>Fill out the form below to get a quote and begin your phone swap journey</p>
          
          <form onSubmit={handleSubmit} className="swap-form">
            {/* Current Device Information */}
            <div className="form-section">
              <h3>Current Device Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currentBrand">Brand *</label>
                  <select
                    id="currentBrand"
                    name="brand"
                    value={currentDeviceInfo.brand}
                    onChange={handleCurrentDeviceChange}
                    required
                  >
                    <option value="">Select Brand</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Huawei">Huawei</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="currentModel">Model *</label>
                  <input
                    type="text"
                    id="currentModel"
                    name="model"
                    value={currentDeviceInfo.model}
                    onChange={handleCurrentDeviceChange}
                    placeholder="e.g., iPhone 14 Pro"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currentImei">IMEI</label>
                  <input
                    type="text"
                    id="currentImei"
                    name="imei"
                    value={currentDeviceInfo.imei}
                    onChange={handleCurrentDeviceChange}
                    placeholder="15-digit IMEI number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="currentSerial">Serial Number</label>
                  <input
                    type="text"
                    id="currentSerial"
                    name="serialNumber"
                    value={currentDeviceInfo.serialNumber}
                    onChange={handleCurrentDeviceChange}
                    placeholder="Device serial number"
                  />
                </div>
              </div>
            </div>

            {/* Desired Device Information */}
            <div className="form-section">
              <h3>Desired Device Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newBrand">Brand *</label>
                  <select
                    id="newBrand"
                    name="brand"
                    value={newDeviceInfo.brand}
                    onChange={handleNewDeviceChange}
                    required
                  >
                    <option value="">Select Brand</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Huawei">Huawei</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="newModel">Model *</label>
                  <input
                    type="text"
                    id="newModel"
                    name="model"
                    value={newDeviceInfo.model}
                    onChange={handleNewDeviceChange}
                    placeholder="e.g., iPhone 15 Pro Max"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="storage">Storage</label>
                  <select
                    id="storage"
                    name="storage"
                    value={newDeviceInfo.storage}
                    onChange={handleNewDeviceChange}
                  >
                    <option value="">Select storage</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={newDeviceInfo.color}
                    onChange={handleNewDeviceChange}
                    placeholder="e.g., Space Gray, White, Black"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newImei">IMEI</label>
                  <input
                    type="text"
                    id="newImei"
                    name="imei"
                    value={newDeviceInfo.imei}
                    onChange={handleNewDeviceChange}
                    placeholder="15-digit IMEI number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newSerial">Serial Number</label>
                  <input
                    type="text"
                    id="newSerial"
                    name="serialNumber"
                    value={newDeviceInfo.serialNumber}
                    onChange={handleNewDeviceChange}
                    placeholder="Device serial number"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3>Contact Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={contactInfo.fullName}
                    onChange={handleContactChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="emailAddress">Email Address *</label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={contactInfo.emailAddress}
                    onChange={handleContactChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={contactInfo.phoneNumber}
                    onChange={handleContactChange}
                    placeholder="+234 XXX XXX XXXX"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={contactInfo.location}
                    onChange={handleContactChange}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Submit Swap Request
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PhoneSwapPage;
