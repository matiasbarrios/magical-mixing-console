// Requirements
import { useCallback, useRef, useState } from 'react';


// Exported
export const mmcFocusVisibleShadow = [
    '0 0 0 1px var(--black-a3)',
    '0 0 0 1px var(--gray-a2)',
    '0 0 0 2px var(--gray-a8)',
    '0 1px 2px var(--gray-a4)',
    '0 1px 3px -0.5px var(--gray-a3)',
].join(', ');

export const useKeyboardFocus = () => {
    const pointerDownRef = useRef(false);
    const [keyboardFocus, setKeyboardFocus] = useState(false);

    const onPointerDown = useCallback(() => {
        pointerDownRef.current = true;
    }, []);

    const onFocus = useCallback(() => {
        setKeyboardFocus(!pointerDownRef.current);
        pointerDownRef.current = false;
    }, []);

    const onBlur = useCallback(() => {
        setKeyboardFocus(false);
        pointerDownRef.current = false;
    }, []);

    return {
        keyboardFocus,
        onPointerDown,
        onFocus,
        onBlur,
    };
};
