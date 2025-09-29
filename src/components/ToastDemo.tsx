import React from 'react';
import { useToast } from '../hooks/useToast';
import './ToastDemo.css';

const ToastDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccessToast = () => {
    showSuccess('Success!', 'This is a success message');
  };

  const handleErrorToast = () => {
    showError('Error!', 'This is an error message');
  };

  const handleWarningToast = () => {
    showWarning('Warning!', 'This is a warning message');
  };

  const handleInfoToast = () => {
    showInfo('Info', 'This is an info message');
  };

  const handleApiErrorDemo = () => {
    // Simulate an API error
    const mockError = {
      response: {
        data: {
          errors: {
            email: ['This field is required'],
            password: ['Password must be at least 8 characters']
          }
        }
      }
    };
    
    const errorMessages = Object.values(mockError.response.data.errors).flat().join(', ');
    showError('Validation Error', errorMessages);
  };

  return (
    <div className="toast-demo">
      <h2>Toast Notification Demo</h2>
      <p>Click the buttons below to see different types of toast notifications:</p>
      
      <div className="demo-buttons">
        <button onClick={handleSuccessToast} className="demo-btn success">
          Show Success Toast
        </button>
        
        <button onClick={handleErrorToast} className="demo-btn error">
          Show Error Toast
        </button>
        
        <button onClick={handleWarningToast} className="demo-btn warning">
          Show Warning Toast
        </button>
        
        <button onClick={handleInfoToast} className="demo-btn info">
          Show Info Toast
        </button>
        
        <button onClick={handleApiErrorDemo} className="demo-btn api-error">
          Show API Error Demo
        </button>
      </div>
      
      <div className="demo-info">
        <h3>How to use in your components:</h3>
        <pre>{`import { useToast } from '../hooks/useToast';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  const handleAction = async () => {
    try {
      await apiCall();
      showSuccess('Success!', 'Action completed successfully');
    } catch (error) {
      showError('Error!', 'Something went wrong');
    }
  };
  
  return <button onClick={handleAction}>Do Something</button>;
};`}</pre>
      </div>
    </div>
  );
};

export default ToastDemo;
