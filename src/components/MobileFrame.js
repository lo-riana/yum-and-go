import React from 'react';
import './MobileFrame.css';

const MobileFrame = ({ children }) => {
  return (
    <div className="mobile-app">
      <div className="mobile-frame">
        <div className="mobile-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
