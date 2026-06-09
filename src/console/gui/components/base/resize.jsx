// Requirements
import { useLayoutEffect, useState } from 'react';


// Epxorted
export const useResizeObserver = (ref) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return () => {};

        let frameId = 0;

        const updateSize = () => {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                frameId = 0;
                const { clientWidth: width, clientHeight: height } = element;
                setSize(prev => (
                    prev.width === width && prev.height === height ? prev : { width, height }
                ));
            });
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);
        observer.observe(element);
        window.addEventListener('resize', updateSize);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('resize', updateSize);
        };
    }, [ref]);

    return size;
};
