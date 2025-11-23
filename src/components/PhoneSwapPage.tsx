import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { API_CONFIG, publicApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import { handleApiError } from '../utils/errorHandler';
import './PhoneSwapPage.css';
import { useNavigate } from 'react-router-dom';

const PhoneSwapPage: React.FC = () => {
  const { showError } = useToast();
  const navigate = useNavigate();

  const [currentDeviceInfo, setCurrentDeviceInfo] = useState({
    brand: '',
    model: '',
    storage: '',
    color: '',
    purchaseDate: ''
  });

  const [desiredDeviceInfo, setDesiredDeviceInfo] = useState({
    brand: '',
    model: '',
    storage: '',
    color: '',
    priceRange: ''
  });

  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    location: ''
  });

  const [deviceCondition, setDeviceCondition] = useState({
    excellent: false,
    good: false,
    fair: false,
    poor: false,
    cracked: false,
    waterDamage: false,
    batteryIssues: false,
    screenIssues: false,
    buttonIssues: false,
    cameraIssues: false,
    speakerIssues: false,
    chargingIssues: false,
    softwareIssues: false,
    overallCondition: ''
  });

  const [physicalCondition, setPhysicalCondition] = useState({
    goodOtherwise: false,
    hasScratches: false,
    hasDents: false,
    missingParts: false,
    brokenScreen: false,
    liquidDamage: false,
    wontTurnOn: false,
    functionalIssues: false
  });

  const [includedAccessories, setIncludedAccessories] = useState({
    originalBox: false,
    cable: false,
    case: false,
    charger: false,
    earphones: false,
    screenProtector: false
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    additionalNotes: '',
    agreeToTerms: false
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [swapRequestData, setSwapRequestData] = useState<any>(null);

  const handleCurrentDeviceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentDeviceInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDesiredDeviceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDesiredDeviceInfo(prev => ({
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

  const handleDeviceConditionChange = (condition: string) => {
    setDeviceCondition(prev => ({
      ...prev,
      [condition]: !prev[condition as keyof typeof prev]
    }));
  };

  const handlePhysicalConditionChange = (condition: string) => {
    setPhysicalCondition(prev => ({
      ...prev,
      [condition]: !prev[condition as keyof typeof prev]
    }));
  };

  const handleAccessoryChange = (accessory: string) => {
    setIncludedAccessories(prev => ({
      ...prev,
      [accessory]: !prev[accessory as keyof typeof prev]
    }));
  };

  const handleAdditionalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setAdditionalInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the payload to match the API structure
      const payload = {
        current_brand: currentDeviceInfo.brand,
        current_model: currentDeviceInfo.model,
        current_storage: currentDeviceInfo.storage,
        current_color: currentDeviceInfo.color,
        purchase_date: currentDeviceInfo.purchaseDate,
        desired_brand: desiredDeviceInfo.brand,
        desired_model: desiredDeviceInfo.model,
        desired_storage: desiredDeviceInfo.storage,
        desired_color: desiredDeviceInfo.color,
        price_range: desiredDeviceInfo.priceRange,
        full_name: contactInfo.fullName,
        email_address: contactInfo.emailAddress,
        phone_number: contactInfo.phoneNumber,
        location: contactInfo.location,
        // Device condition mapping
        screen_condition: deviceCondition.excellent ? 'excellent' :
                         deviceCondition.good ? 'good' :
                         deviceCondition.fair ? 'fair' :
                         deviceCondition.poor ? 'poor' : 'excellent',
        battery_condition: deviceCondition.batteryIssues ? 'poor' : 'good',
        physical_condition: physicalCondition.goodOtherwise ? 'excellent' :
                           physicalCondition.hasScratches ? 'good' :
                           physicalCondition.hasDents ? 'fair' :
                           physicalCondition.brokenScreen ? 'poor' :
                           physicalCondition.liquidDamage ? 'poor' : 'excellent',
        // Accessories
        original_box: includedAccessories.originalBox,
        charger: includedAccessories.charger,
        earphones: includedAccessories.earphones,
        screen_protector: includedAccessories.screenProtector,
        case: includedAccessories.case,
        cable: includedAccessories.cable,
        // Additional info
        additional_notes: additionalInfo.additionalNotes,
        functional_issues: physicalCondition.functionalIssues || physicalCondition.wontTurnOn ? 'Has functional issues' : '',
        terms_accepted: additionalInfo.agreeToTerms
      };

      console.log('Submitting phone swap request:', payload);

      const response = await publicApiRequest(API_CONFIG.ENDPOINTS.PHONE_SWAP_SUBMIT, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('Phone swap request successful:', response);
      setSwapRequestData((response as any).swap_request);
      navigate('/success', {
        state: {
          title: 'Phone Swap Request Submitted!',
          message: `Thank you, ${contactInfo.fullName || 'User'}! Your phone swap request has been submitted.`,
          userName: contactInfo.fullName,
          userContact: contactInfo.phoneNumber || contactInfo.emailAddress,
          contextType: 'swap',
          nextSteps: [
            'Our team will reach out to you shortly to schedule inspection.',
            `We will contact you via WhatsApp/phone at ${contactInfo.phoneNumber || contactInfo.emailAddress}.`,
          ],
          ctaText: 'Back to Home'
        }
      });

      // Reset form
      setCurrentDeviceInfo({ brand: '', model: '', storage: '', color: '', purchaseDate: '' });
      setDesiredDeviceInfo({ brand: '', model: '', storage: '', color: '', priceRange: '' });
      setContactInfo({ fullName: '', emailAddress: '', phoneNumber: '', location: '' });
      setDeviceCondition({
        excellent: false, good: false, fair: false, poor: false,
        cracked: false, waterDamage: false, batteryIssues: false,
        screenIssues: false, buttonIssues: false, cameraIssues: false,
        speakerIssues: false, chargingIssues: false, softwareIssues: false,
        overallCondition: ''
      });
      setPhysicalCondition({
        goodOtherwise: false, hasScratches: false, hasDents: false,
        missingParts: false, brokenScreen: false, liquidDamage: false,
        wontTurnOn: false, functionalIssues: false
      });
      setIncludedAccessories({
        originalBox: false, cable: false, case: false,
        charger: false, earphones: false, screenProtector: false
      });
      setAdditionalInfo({ additionalNotes: '', agreeToTerms: false });

    } catch (error: any) {
      console.error('Error submitting phone swap request:', error);
      const errorMessage = handleApiError(error, 'Phone Swap Submission');
      showError('Submission Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="phone-swap-page">
      {/* How Phone Swap Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Phone Swap Works</h2>
          <p>Our simple 5-step process makes upgrading your phone quick, safe, and transparent</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Submit Request</h3>
              <p>Fill in our contact form with your device details and get an instant quote</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Device Inspection</h3>
              <p>Bring your device to our store for a thorough inspection by our experts</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Value Assessment</h3>
              <p>We'll provide you with the exact value of your device based on its condition</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Make the Swap</h3>
              <p>Choose your new device and we'll handle the swap process for you</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">5</div>
              <h3>Complete Setup</h3>
              <p>We'll help you set up your new device and transfer all your data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Swap Form */}
      <section className="phone-swap-form">
        <div className="container">
          <h2>Start Your Phone Swap</h2>
          <p>Fill out the form below to get started with your phone swap. We'll contact you within 24 hours.</p>
          
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
                    <option value="Oppo">Oppo</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Realme">Realme</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Infinix">Infinix</option>
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
                  <label htmlFor="currentStorage">Storage</label>
                  <select
                    id="currentStorage"
                    name="storage"
                    value={currentDeviceInfo.storage}
                    onChange={handleCurrentDeviceChange}
                  >
                    <option value="">Select Storage</option>
                    <option value="32GB">32GB</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="currentColor">Color *</label>
                  <input
                    type="text"
                    id="currentColor"
                    name="color"
                    value={currentDeviceInfo.color}
                    onChange={handleCurrentDeviceChange}
                    placeholder="e.g., Space Gray, White, Black"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="purchaseDate">Purchase Date</label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={currentDeviceInfo.purchaseDate}
                    onChange={handleCurrentDeviceChange}
                  />
                </div>

                <div className="form-group">
                  {/* Empty div for spacing */}
                </div>
              </div>
            </div>

            {/* Desired Device Information */}
            <div className="form-section">
              <h3>Desired Device Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="desiredBrand">Brand *</label>
                  <select
                    id="desiredBrand"
                    name="brand"
                    value={desiredDeviceInfo.brand}
                    onChange={handleDesiredDeviceChange}
                    required
                  >
                    <option value="">Select Brand</option>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Realme">Realme</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Infinix">Infinix</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="desiredModel">Model *</label>
                  <input
                    type="text"
                    id="desiredModel"
                    name="model"
                    value={desiredDeviceInfo.model}
                    onChange={handleDesiredDeviceChange}
                    placeholder="e.g., iPhone 15 Pro Max"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="desiredStorage">Storage</label>
                  <select
                    id="desiredStorage"
                    name="storage"
                    value={desiredDeviceInfo.storage}
                    onChange={handleDesiredDeviceChange}
                  >
                    <option value="">Select Storage</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="desiredColor">Color *</label>
                  <input
                    type="text"
                    id="desiredColor"
                    name="color"
                    value={desiredDeviceInfo.color}
                    onChange={handleDesiredDeviceChange}
                    placeholder="e.g., Space Gray, White, Black"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priceRange">Price Range</label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    value={desiredDeviceInfo.priceRange}
                    onChange={handleDesiredDeviceChange}
                  >
                    <option value="">Select Price Range</option>
                    <option value="Under ₦100,000">Under ₦100,000</option>
                    <option value="₦100,000 - ₦300,000">₦100,000 - ₦300,000</option>
                    <option value="₦300,000 - ₦500,000">₦300,000 - ₦500,000</option>
                    <option value="₦500,000 - ₦800,000">₦500,000 - ₦800,000</option>
                    <option value="Above ₦800,000">Above ₦800,000</option>
                  </select>
                </div>

                <div className="form-group">
                  {/* Empty div for spacing */}
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

            {/* Device Condition Assessment */}
            <div className="form-section">
              <h3>Device Condition Assessment</h3>
              
              <div className="condition-group">
                <h4>Screen Condition *</h4>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={deviceCondition.excellent}
                      onChange={() => handleDeviceConditionChange('excellent')}
                    />
                    Excellent - No scratches or marks
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={deviceCondition.good}
                      onChange={() => handleDeviceConditionChange('good')}
                    />
                    Good - Minor scratches
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={deviceCondition.fair}
                      onChange={() => handleDeviceConditionChange('fair')}
                    />
                    Fair - Visible scratches or marks
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={deviceCondition.poor}
                      onChange={() => handleDeviceConditionChange('poor')}
                    />
                    Poor - Deep scratches
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={deviceCondition.cracked}
                      onChange={() => handleDeviceConditionChange('cracked')}
                    />
                    Cracked - Lines or cracks
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={deviceCondition.waterDamage}
                      onChange={() => handleDeviceConditionChange('waterDamage')}
                    />
                    Water damage - Liquid damage
                  </label>
                </div>
              </div>

              <div className="condition-group">
                <h4>Physical Condition *</h4>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.goodOtherwise}
                      onChange={() => handlePhysicalConditionChange('goodOtherwise')}
                    />
                    Good otherwise
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.hasScratches}
                      onChange={() => handlePhysicalConditionChange('hasScratches')}
                    />
                    Has scratches
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.hasDents}
                      onChange={() => handlePhysicalConditionChange('hasDents')}
                    />
                    Has dents or dings
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.missingParts}
                      onChange={() => handlePhysicalConditionChange('missingParts')}
                    />
                    Missing parts or buttons
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.brokenScreen}
                      onChange={() => handlePhysicalConditionChange('brokenScreen')}
                    />
                    Broken screen or display
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.liquidDamage}
                      onChange={() => handlePhysicalConditionChange('liquidDamage')}
                    />
                    Liquid damage
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.wontTurnOn}
                      onChange={() => handlePhysicalConditionChange('wontTurnOn')}
                    />
                    Won't turn on or charge
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={physicalCondition.functionalIssues}
                      onChange={() => handlePhysicalConditionChange('functionalIssues')}
                    />
                    Functional issues
                  </label>
                </div>
              </div>
            </div>

            {/* Included Accessories */}
            <div className="form-section">
              <h3>Included Accessories</h3>
              <div className="checkbox-grid">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includedAccessories.originalBox}
                    onChange={() => handleAccessoryChange('originalBox')}
                  />
                  Original Box
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includedAccessories.cable}
                    onChange={() => handleAccessoryChange('cable')}
                  />
                  Cable
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includedAccessories.case}
                    onChange={() => handleAccessoryChange('case')}
                  />
                  Case
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includedAccessories.charger}
                    onChange={() => handleAccessoryChange('charger')}
                  />
                  Charger
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includedAccessories.earphones}
                    onChange={() => handleAccessoryChange('earphones')}
                  />
                  Earphones
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includedAccessories.screenProtector}
                    onChange={() => handleAccessoryChange('screenProtector')}
                  />
                  Screen Protector
                </label>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label htmlFor="additionalNotes">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={additionalInfo.additionalNotes}
                  onChange={handleAdditionalInfoChange}
                  placeholder="Any additional information about your device or special requirements..."
                  rows={4}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <h3>Phone Swapping Terms & Conditions</h3>
              <div className="terms-content">
                <div className="terms-item">
                  <h4>1. Service Overview</h4>
                  <p>The BitGadgetz Phone Swapping service allows customers to exchange their current device for another device owned and provided by BitGadgetz. All devices available for swap are verified, tested, and owned by BitGadgetz.</p>
                </div>
                
                <div className="terms-item">
                  <h4>2. User Responsibility</h4>
                  <p>You must be the legal owner of the device you are offering for a swap. Devices that are stolen, blacklisted, or reported lost will not be accepted. You must disclose the true condition of your device during the evaluation process.</p>
                </div>
                
                <div className="terms-item">
                  <h4>3. Device Evaluation</h4>
                  <p>BitGadgetz will inspect and evaluate your device before confirming eligibility for a swap. Device condition, market value, and model type will determine the available swap options. Once a device is accepted and swapped, the process is final.</p>
                </div>
                
                <div className="terms-item">
                  <h4>4. Swap Process</h4>
                  <p>Customers may choose from the range of devices available in BitGadgetz inventory. If the selected device has a higher value than the evaluated device, the customer must pay the difference. If the selected device has a lower value, no cash refunds will be issued; instead, customers may choose to add accessories or services to balance the value.</p>
                </div>
                
                <div className="terms-item">
                  <h4>5. Liability</h4>
                  <p>BitGadgetz ensures that all swapped devices are tested and verified before release. However, BitGadgetz does not provide lifetime warranties on swapped devices. Any warranties provided will be clearly stated at the time of swap.</p>
                </div>
                
                <div className="terms-item">
                  <h4>6. Fees</h4>
                  <p>A service fee may apply to each swap, which will be communicated before finalizing the process. All payments are non-refundable once the swap is completed.</p>
                </div>
                
                <div className="terms-item">
                  <h4>7. Privacy</h4>
                  <p>Any personal data left on a swapped device is the sole responsibility of the customer. Customers must back up and wipe their devices before handing them over. BitGadgetz is not liable for any data left behind.</p>
                </div>
                
                <div className="terms-item">
                  <h4>8. Acceptance</h4>
                  <p>By using the BitGadgetz Phone Swapping service, you agree to these Terms & Conditions. BitGadgetz reserves the right to reject any device that does not meet our standards or violates these terms.</p>
                </div>
              </div>
              
              <div className="terms-agreement">
                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={additionalInfo.agreeToTerms}
                    onChange={handleAdditionalInfoChange}
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="terms-text">
                    I have read and agree to the <strong>BitGadgetz Phone Swapping Terms & Conditions</strong> outlined above. I understand that the final swap will be determined based on physical inspection of my device.
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Continue Phone Swap'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PhoneSwapPage;
