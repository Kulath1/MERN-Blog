import React, { createContext, useState, useContext } from 'react';

// Create context
const adContext = createContext();

// Provider component
export const AdProvider = ({ children }) => {
    const [ads, setAds] = useState([]);

    const addAd = (newAd) => {
        setAds((prevAds) => [...prevAds, newAd]);
    };

    return (
        <adContext.Provider value={{ ads, addAd }}>
            {children}
        </adContext.Provider>
    );
};

// Custom hook to use the ad context
export const useAds = () => useContext(adContext);
