// Requirements
import { useState, useEffect } from 'react';
import { isMobile } from '../../platform';


// Constants
const XS = 520;
const SM = 768;
const MD = 1024;
const LG = 1280;

const LANDSCAPE_RATIO = 1.45;


// Exported
export const useScreen = () => {
    const [xs, setXs] = useState(window.innerWidth < XS);
    const [sm, setSm] = useState(window.innerWidth < SM && window.innerWidth >= XS);
    const [md, setMd] = useState(window.innerWidth < MD && window.innerWidth >= SM);
    const [lg, setLg] = useState(window.innerWidth < LG && window.innerWidth >= MD);
    const [xl, setXl] = useState(window.innerWidth >= LG);
    const [isLandscape, setIsLandscape] = useState(isMobile && window
        .innerWidth / window.innerHeight > LANDSCAPE_RATIO);

    useEffect(() => {
        const handleResize = () => {
            setIsLandscape(isMobile && window.innerWidth / window.innerHeight > LANDSCAPE_RATIO);
            setXs(window.innerWidth < XS);
            setSm(window.innerWidth < SM && window.innerWidth >= XS);
            setMd(window.innerWidth < MD && window.innerWidth >= SM);
            setLg(window.innerWidth < LG && window.innerWidth >= MD);
            setXl(window.innerWidth >= LG);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        xs,
        sm,
        md,
        lg,
        xl,
        isLandscape,
    };
};
