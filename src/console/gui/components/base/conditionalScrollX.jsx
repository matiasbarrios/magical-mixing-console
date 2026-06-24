// Requirements
import {
    forwardRef, useCallback, useLayoutEffect, useRef, useState,
} from 'react';


// Internal
const useOverflowX = (ref, enabled) => {
    const [overflowX, setOverflowX] = useState(false);

    useLayoutEffect(() => {
        if (!enabled) {
            setOverflowX(false);
            return undefined;
        }

        const element = ref.current;
        if (!element) return undefined;

        let frameId = 0;

        const measure = () => {
            const { scrollWidth, clientWidth } = element;
            setOverflowX((prev) => {
                const next = scrollWidth > clientWidth;
                return prev === next ? prev : next;
            });
        };

        const scheduleMeasure = () => {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                frameId = 0;
                measure();
            });
        };

        scheduleMeasure();

        const resizeObserver = new ResizeObserver(scheduleMeasure);
        resizeObserver.observe(element);

        const mutationObserver = new MutationObserver(scheduleMeasure);
        mutationObserver.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        window.addEventListener('resize', scheduleMeasure);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('resize', scheduleMeasure);
        };
    }, [ref, enabled]);

    useLayoutEffect(() => {
        if (!enabled) return;

        const element = ref.current;
        if (!element) return;

        const { scrollWidth, clientWidth } = element;
        setOverflowX((prev) => {
            const next = scrollWidth > clientWidth;
            return prev === next ? prev : next;
        });
    }, [ref, enabled, overflowX]);

    return overflowX;
};


// Exported — horizontal scroll only when content overflows X (unless scrollAlways).
const ConditionalScrollX = forwardRef(({
    children,
    scrollAlways = false,
    fill = true,
    className: classNameProp,
    style: styleProp,
    ...divProps
}, forwardedRef) => {
    const ref = useRef(null);
    const overflowX = useOverflowX(ref, !scrollAlways);

    const setRef = useCallback((element) => {
        ref.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
    }, [forwardedRef]);

    let scrollClassName;
    if (scrollAlways) scrollClassName = 'mmc-conditional-scroll-x mmc-conditional-scroll-x-always';
    else if (overflowX) scrollClassName = 'mmc-conditional-scroll-x';

    const className = [
        scrollClassName,
        fill && 'mmc-conditional-scroll-x-fill',
        classNameProp,
    ].filter(Boolean).join(' ') || undefined;

    const style = !scrollAlways && !overflowX
        ? { ...styleProp, overflow: 'hidden' }
        : styleProp;

    return (
        <div
            ref={setRef}
            className={className}
            style={style}
            {...divProps}
        >
            {children}
        </div>
    );
});

ConditionalScrollX.displayName = 'ConditionalScrollX';

export default ConditionalScrollX;
