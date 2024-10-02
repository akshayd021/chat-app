import React, { createContext, useContext, useEffect, useState } from 'react';

const ScreenContext = createContext();

const breakpoints = {
    mobile: 640,
    tablet: 770,
};

const ScreenProvider = ({ children }) => {
    // Initialize states based on the client-side check
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    const updateScreenSize = () => {
        // Check if the window object is defined
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            setIsMobile(width <= breakpoints.mobile);
            setIsTablet(width > breakpoints.mobile && width <= breakpoints.tablet);
        }
    };

    useEffect(() => {
        // Initial check for window size
        updateScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', updateScreenSize);
        
        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    return (
        <ScreenContext.Provider value={{ isMobile, isTablet, isDesktop: !isMobile && !isTablet }}>
            {children}
        </ScreenContext.Provider>
    );
};

const useScreen = () => {
    return useContext(ScreenContext);
};

export { ScreenProvider, useScreen };
