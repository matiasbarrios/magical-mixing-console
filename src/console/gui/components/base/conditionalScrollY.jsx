// Requirements
import {
    forwardRef, useCallback, useLayoutEffect, useRef, useState,
} from 'react';
import { Flex } from '@radix-ui/themes';


// Internal
const useOverflowY = (ref, enabled) => {
    const [overflowY, setOverflowY] = useState(false);

    useLayoutEffect(() => {
        if (!enabled) {
            setOverflowY(false);
            return undefined;
        }

        const element = ref.current;
        if (!element) return undefined;

        let frameId = 0;

        const measure = () => {
            const { scrollHeight, clientHeight } = element;
            setOverflowY((prev) => {
                const next = scrollHeight > clientHeight;
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

        const { scrollHeight, clientHeight } = element;
        setOverflowY((prev) => {
            const next = scrollHeight > clientHeight;
            return prev === next ? prev : next;
        });
    }, [ref, enabled, overflowY]);

    return overflowY;
};


// Exported — vertical scroll only when content overflows Y (unless scrollAlways).
const ConditionalScrollY = forwardRef(({
    children,
    scrollAlways = false,
    className: classNameProp,
    style: styleProp,
    ...flexProps
}, forwardedRef) => {
    const ref = useRef(null);
    const overflowY = useOverflowY(ref, !scrollAlways);

    const setRef = useCallback((element) => {
        ref.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
    }, [forwardedRef]);

    let scrollClassName;
    if (scrollAlways) scrollClassName = 'mmc-conditional-scroll-y mmc-conditional-scroll-y-always';
    else if (overflowY) scrollClassName = 'mmc-conditional-scroll-y';

    const className = [scrollClassName, classNameProp].filter(Boolean).join(' ') || undefined;

    const style = !scrollAlways && !overflowY
        ? { ...styleProp, overflow: 'hidden' }
        : styleProp;

    return (
        <Flex
            ref={setRef}
            direction="column"
            gapY="4"
            flexGrow="1"
            minHeight="0"
            pb="2"
            className={className}
            style={style}
            {...flexProps}
        >
            {children}
        </Flex>
    );
});

ConditionalScrollY.displayName = 'ConditionalScrollY';

export default ConditionalScrollY;