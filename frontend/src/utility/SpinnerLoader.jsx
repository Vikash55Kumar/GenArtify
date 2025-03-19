import React, { useState, useEffect } from 'react';
import './spinnerLoader.css'; // Make sure to import the CSS file for styling

export default function SpinnerLoader() {
    const [showImg, setShowImg] = useState(true); 
    return (
        <div className="spinner-overlay">
            {showImg && (
                <div className="spinner-container">
                    <img src='./RollingT.svg' alt="Loading Spinner" className="spinner-img" />
                </div>
            )}
        </div>
    );
}
