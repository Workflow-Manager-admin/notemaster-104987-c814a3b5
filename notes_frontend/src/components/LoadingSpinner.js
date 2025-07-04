import React from 'react';
import './LoadingSpinner.css';

// PUBLIC_INTERFACE
const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const spinnerClass = `loading-spinner ${size}`;
  
  return (
    <div className="loading-wrapper">
      <div className={spinnerClass}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
