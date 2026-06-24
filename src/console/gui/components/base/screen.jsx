// Requirements
import {
    createContext, useContext, useEffect, useState,
} from 'react';


// Constants
const XS = 520;
const SM = 768;
const MD = 1024;
const LG = 1280;

const LANDSCAPE_RATIO = 1.45;

const UPDATE_DELAY = 300;


// Variables
const Context = createContext(null);


// Internal
const computeScreen = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width / height > LANDSCAPE_RATIO;

    return {
        xs: width < XS,
        sm: width < SM && width >= XS,
        md: width < MD && width >= SM,
        lg: width < LG && width >= MD,
        xl: width >= LG,
        width,
        height,
        isLandscape,
        // xs = width < XS (portrait phone). isXSLandscape = phone landscape with little height.
        isXSLandscape: isLandscape && height < XS,
    };
};

const screenEquals = (a, b) => a.xs === b.xs
    && a.sm === b.sm
    && a.md === b.md
    && a.lg === b.lg
    && a.xl === b.xl
    && a.width === b.width
    && a.height === b.height
    && a.isLandscape === b.isLandscape
    && a.isXSLandscape === b.isXSLandscape;


// Exported
export const ScreenProvider = ({ children }) => {
    const [screen, setScreen] = useState(computeScreen);

    useEffect(() => {
        let frameId = 0;
        let timeoutId = 0;

        const updateScreen = () => {
            setScreen((prev) => {
                const next = computeScreen();
                return screenEquals(prev, next) ? prev : next;
            });
        };

        const scheduleUpdate = () => {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                frameId = 0;
                updateScreen();
            });
        };

        const handleOrientationChange = () => {
            scheduleUpdate();
            // Mobile WebViews can report stale innerWidth/innerHeight until after rotation.
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = window.setTimeout(scheduleUpdate, UPDATE_DELAY);
        };

        window.addEventListener('resize', scheduleUpdate);
        window.addEventListener('orientationchange', handleOrientationChange);
        const viewport = window.visualViewport;
        viewport?.addEventListener('resize', scheduleUpdate);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('resize', scheduleUpdate);
            window.removeEventListener('orientationchange', handleOrientationChange);
            viewport?.removeEventListener('resize', scheduleUpdate);
        };
    }, []);

    return (
        <Context.Provider value={screen}>
            { children }
        </Context.Provider>
    );
};


export const useScreen = () => {
    const screen = useContext(Context);
    if (!screen) {
        throw new Error('useScreen must be used within ScreenProvider');
    }
    return screen;
};

