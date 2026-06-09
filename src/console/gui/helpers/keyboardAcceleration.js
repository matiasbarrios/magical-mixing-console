// Requirements
import { useCallback, useRef } from 'react';


// Constants — tune delay, interval, and multipliers for hold-to-accelerate feel.
const DEFAULT_KEYBOARD_ACCEL = {
    delayMs: 400,
    intervalMs: 250,
    multipliers: [1, 2, 4, 8, 16],
};

const arrowKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const pageKeys = new Set(['PageUp', 'PageDown']);

const isKeyboardStepKey = code => arrowKeys.has(code) || pageKeys.has(code);

const getKeyboardStepMultiplier = (heldMs, config = DEFAULT_KEYBOARD_ACCEL, reduceMotion = false) => {
    const { delayMs, intervalMs, multipliers } = config;
    if (reduceMotion) return 1;
    if (heldMs < delayMs) return 1;
    const tier = Math.floor((heldMs - delayMs) / intervalMs);
    const index = Math.min(tier + 1, multipliers.length - 1);
    return multipliers[index];
};

const useKeyboardHoldAcceleration = (reduceMotion = false, config = DEFAULT_KEYBOARD_ACCEL) => {
    const holdRef = useRef({ code: null, startTime: 0 });
    const configRef = useRef(config);
    configRef.current = config;

    const getMultiplier = useCallback((code) => {
        const now = Date.now();
        if (holdRef.current.code !== code) {
            holdRef.current = { code, startTime: now };
            return 1;
        }
        const heldMs = now - holdRef.current.startTime;
        return getKeyboardStepMultiplier(heldMs, configRef.current, reduceMotion);
    }, [reduceMotion]);

    const onKeyUp = useCallback((event) => {
        if (holdRef.current.code === event.code) {
            holdRef.current = { code: null, startTime: 0 };
        }
    }, []);

    const reset = useCallback(() => {
        holdRef.current = { code: null, startTime: 0 };
    }, []);

    return { getMultiplier, onKeyUp, reset };
};

export {
    DEFAULT_KEYBOARD_ACCEL,
    getKeyboardStepMultiplier,
    isKeyboardStepKey,
    useKeyboardHoldAcceleration,
};
