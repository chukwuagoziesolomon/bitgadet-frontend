import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  primaryButtonText = "Continue Browsing",
  secondaryButtonText = "Close",
  onPrimaryAction,
  onSecondaryAction
}) => {
  if (!isOpen) return null;

  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="modal-content">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>

          <h2 className="modal-title">{title}</h2>

          <p className="modal-message" dangerouslySetInnerHTML={{ __html: message }} />

          <div className="modal-actions">
            <button
              className="modal-primary-btn"
              onClick={handlePrimaryClick}
            >
              {primaryButtonText}
            </button>
            <button
              className="modal-secondary-btn"
              onClick={handleSecondaryClick}
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;