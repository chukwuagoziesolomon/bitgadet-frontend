import React from 'react';
import { CheckCircle, Smartphone, MessageCircle, Search, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SuccessPage.css';

type ContextType = 'swap' | 'tracking' | 'contact' | 'default';

const icons: Record<ContextType, JSX.Element> = {
  swap: <Smartphone size={72} color="#00C896" />,
  tracking: <Search size={72} color="#2766e6" />,
  contact: <MessageCircle size={72} color="#2766e6" />,
  default: <CheckCircle size={72} color="#00C896" />,
};

function getIcon(contextType: ContextType): JSX.Element {
  return icons[contextType] || icons.default;
}

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Accept props from route state or fallback
  const { title, message, userName, userContact, contextType = 'default', ctaText = 'Back to Home', secondaryText, onSecondaryAction, nextSteps } = (location.state || {}) as {
    title?: string;
    message?: string;
    userName?: string;
    userContact?: string;
    contextType?: ContextType;
    ctaText?: string;
    secondaryText?: string;
    onSecondaryAction?: () => void;
    nextSteps?: string[];
  };

  const fullTitle = title || 'Success!';
  const desc = message ||
    (contextType === 'swap'
      ? `Thank you${userName ? `, ${userName}` : ''}! Your phone swap request has been submitted. We'll contact you at ${userContact || 'your provided contact'} within 24h.`
      : contextType === 'tracking'
      ? `Thank you${userName ? `, ${userName}` : ''}! Your tracking request was sent successfully. We'll update you at ${userContact || 'your provided details'} soon.`
      : contextType === 'contact'
      ? `Thank you${userName ? `, ${userName}` : ''} for contacting us! We'll reply by ${userContact || 'your provided details'} within 24h.`
      : `Thank you${userName ? `, ${userName}` : ''}! Your request was successful.`);
  const steps = nextSteps ||
    (contextType === 'swap'
      ? ["Our team will reach out to your contact info to proceed with device inspection.", "Inspection and swap scheduling will follow."]
      : contextType === 'tracking'
      ? ["Our team will start investigation.", "Results and next steps will be shared via your contact info."]
      : contextType === 'contact'
      ? ["We'll review your message.", "A team member will reply via your provided details."]
      : null
    );

  return (
    <div className="successpage-hero">
      <div className="successpage-content animate-fadeUp">
        <div className="successpage-icon-wrapper">
          {getIcon(contextType as ContextType)}
          <span className="icon-sparkle">
            <Sparkles size={40} color="#fbbf24" />
          </span>
        </div>
        <h1 className="successpage-title">{fullTitle}</h1>
        <div className="successpage-message">{desc}</div>
        {steps && (
          <ul className="successpage-nextsteps">
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        )}
        <div className="successpage-cta-buttons">
          <button className="successpage-cta-btn" onClick={() => navigate('/')}>{ctaText}</button>
          {secondaryText && (
            <button className="successpage-cta-btn secondary" onClick={onSecondaryAction}>{secondaryText}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
