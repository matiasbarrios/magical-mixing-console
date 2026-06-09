// Requirements
import { useEffect, useState } from 'react';


// Internal
const getPrefersReducedMotion = () => (
    typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);


// Exported
export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = event => setPrefersReducedMotion(event.matches);
        mediaQuery.addEventListener('change', onChange);
        return () => mediaQuery.removeEventListener('change', onChange);
    }, []);

    return prefersReducedMotion;
};
