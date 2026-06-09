// Requirements
import {
    useCallback, useMemo, useState, useEffect, useRef,
} from 'react';
import { useDrag } from '@use-gesture/react';
import { scaleLinear } from 'd3';
import { Flex } from '@radix-ui/themes';
import { isMobile, isLinux } from '../../platform';
import { usePrefersReducedMotion } from '../../helpers/prefersReducedMotion';
import { isKeyboardStepKey, useKeyboardHoldAcceleration } from '../../helpers/keyboardAcceleration';
import { mmcFocusVisibleShadow, useKeyboardFocus } from '../../helpers/useKeyboardFocus';
import { noDecimals, oneDecimal, twoDecimals } from '../../helpers/format';
import { useUiSize } from '../theme';


// Constants
const angleMin = -145;

const angleMax = -1 * angleMin;

const stepLargerFactor = 10;

const dragSensitivity = 0.006;

const dragConfig = {
    pointer: { keys: false },
};

const setThrottleMs = 50;

const quantizeValue = (v, decimals) => {
    const factor = 10 ** decimals;
    return Math.round(v * factor) / factor;
};

const containerStyle = {
    position: 'relative',
    left: '0',
    touchAction: 'none',
    outline: 'none',
};

const wrapperStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    backgroundColor: 'var(--accent-a3)',
    // backgroundImage: 'linear-gradient(var(--white-a1), var(--white-a1))',
    transition: 'transform 0.2s ease',
    transformOrigin: 'center center',
};

const knobStyle = {
    position: 'absolute',
};

const lineStyle = {
    position: 'absolute',
    top: '-1px',
    left: '2px',
    width: '6px',
    height: '1.5px',
    borderRadius: '9999px',
    backgroundColor: 'var(--accent-a11)',
};

const textStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    opacity: 0,
    transition: 'opacity 0.2s ease',
};


// Internal
const decimalToAngle = v => scaleLinear()
    .domain([0, 1])
    .range([angleMin, angleMax])(v);


const clamp = (v, min, max) => Math.max(min, Math.min(max, v));


// Exported
export const Knob = ({
    value,
    set,
    valueToDecimal,
    decimalToValue,
    minimum,
    maximum,
    color = 'gray',
    onRightClick,
    disabled,
    readOnly = false,
    decimalsToShow = 0,
    hideValue = false,
    onFocusScale = 2,
    asButton = false,
    resetValue,
    formatValue,
    ariaLabel,
    orientation = 'vertical',
}) => {
    const { knobSizePx } = useUiSize();
    const size = knobSizePx;

    const prefersReducedMotion = usePrefersReducedMotion();

    const {
        getMultiplier: getKeyboardMultiplier,
        onKeyUp: onKeyboardKeyUp,
        reset: resetKeyboardHold,
    } = useKeyboardHoldAcceleration(prefersReducedMotion);

    const {
        keyboardFocus,
        onPointerDown: onFocusRingPointerDown,
        onFocus,
        onBlur: onFocusBlur,
    } = useKeyboardFocus();

    const onBlur = useCallback(() => {
        resetKeyboardHold();
        onFocusBlur();
    }, [onFocusBlur, resetKeyboardHold]);

    const [active, setActive] = useState(false);
    const knobRef = useRef(null);

    // Manual drag state for Ubuntu/Linux fallback
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const activate = useCallback(() => setActive(true), []);

    const deactivate = useCallback(() => setActive(false), []);

    const half = useMemo(() => (minimum + maximum) / 2, [minimum, maximum]);

    const keyboardStep = useMemo(() => 10 ** (-decimalsToShow), [decimalsToShow]);

    const keyboardStepLarge = useMemo(() => keyboardStep * stepLargerFactor, [keyboardStep]);

    const valueDecimal = useMemo(() => valueToDecimal(value), [value, valueToDecimal]);

    const dragDecimalRef = useRef(null);
    const lastDecimalRef = useRef(null);
    const lastSentValueRef = useRef(undefined);
    const throttleTimerRef = useRef(null);
    const [dragDecimal, setDragDecimal] = useState(null);

    const activeDecimal = dragDecimal ?? valueDecimal;

    const displayValue = useMemo(() => {
        if (dragDecimal !== null) return decimalToValue(dragDecimal);
        return value;
    }, [dragDecimal, decimalToValue, value]);

    const valueDisplay = useMemo(() => {
        if (displayValue === undefined) return '';
        if (formatValue) return formatValue(displayValue);
        let ds;
        if (decimalsToShow === 0) ds = noDecimals(displayValue);
        if (decimalsToShow === 1) ds = oneDecimal(displayValue);
        if (decimalsToShow === 2) ds = twoDecimals(displayValue);
        return `${ds}`;
    }, [displayValue, decimalsToShow, formatValue]);

    const angleValue = useMemo(() => decimalToAngle(activeDecimal), [activeDecimal]);

    const sendDecimal = useCallback((decimal) => {
        if (!set || Number.isNaN(decimal)) return;
        const rawValue = clamp(decimalToValue(decimal), minimum, maximum);
        if (Number.isNaN(rawValue)) return;
        const quantized = quantizeValue(rawValue, decimalsToShow);
        if (quantized === lastSentValueRef.current) return;
        lastSentValueRef.current = quantized;
        set(quantized);
    }, [decimalToValue, decimalsToShow, minimum, maximum, set]);

    useEffect(() => {
        if (value !== undefined) {
            lastSentValueRef.current = quantizeValue(value, decimalsToShow);
        }
    }, [value, decimalsToShow]);

    useEffect(() => () => {
        if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
    }, []);

    const flushPending = useCallback(() => {
        if (lastDecimalRef.current !== null) sendDecimal(lastDecimalRef.current);
    }, [sendDecimal]);

    const flushOnRelease = useCallback(() => {
        if (throttleTimerRef.current) {
            clearTimeout(throttleTimerRef.current);
            throttleTimerRef.current = null;
        }
        flushPending();
        dragDecimalRef.current = null;
        setDragDecimal(null);
    }, [flushPending]);

    const scheduleSend = useCallback((decimal) => {
        lastDecimalRef.current = decimal;
        if (!throttleTimerRef.current) {
            sendDecimal(decimal);
            throttleTimerRef.current = setTimeout(() => {
                throttleTimerRef.current = null;
                flushPending();
            }, setThrottleMs);
        }
    }, [sendDecimal, flushPending]);

    const setImmediate = useCallback((rawValue) => {
        if (throttleTimerRef.current) {
            clearTimeout(throttleTimerRef.current);
            throttleTimerRef.current = null;
        }
        const quantized = quantizeValue(clamp(rawValue, minimum, maximum), decimalsToShow);
        lastSentValueRef.current = quantized;
        lastDecimalRef.current = valueToDecimal(quantized);
        dragDecimalRef.current = null;
        setDragDecimal(null);
        set(quantized);
    }, [decimalsToShow, maximum, minimum, set, valueToDecimal]);

    const resetToDefault = useCallback(() => {
        if (resetValue === undefined) setImmediate(half);
        else setImmediate(resetValue);
    }, [setImmediate, half, resetValue]);

    const isInteractive = useMemo(() => !readOnly && !disabled, [readOnly, disabled]);

    const containerStyleFinal = useMemo(() => {
        let cursor = '';
        if (readOnly) {
            cursor = 'default';
        } else if (disabled) {
            cursor = 'not-allowed';
        }
        return {
            ...containerStyle,
            minWidth: `${size}px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '9999px',
            cursor,
            ...(keyboardFocus && isInteractive && {
                boxShadow: mmcFocusVisibleShadow,
                zIndex: 1,
            }),
        };
    }, [disabled, readOnly, size, keyboardFocus, isInteractive]);

    const wrapperStyleFinal = useMemo(() => ({
        ...wrapperStyle,
        transform: active && isInteractive ? `scale(${onFocusScale})` : 'scale(1)',
        zIndex: active ? 1 : 0,
        ...(prefersReducedMotion && { transition: 'none' }),
        ...(readOnly && { backgroundColor: 'var(--accent-a2)' }),
        ...(disabled && !readOnly && { backgroundColor: 'var(--gray-a3)' }),
    }), [active, onFocusScale, disabled, readOnly, prefersReducedMotion, isInteractive]);

    const knobStyleFinal = useMemo(() => ({
        ...knobStyle,
        top: `${Math.round(size / 2)}px`,
        left: `${Math.round(size / 2)}px`,
        transform: `rotate(${angleValue - 90}deg)`,
    }), [angleValue, size]);

    const lineStyleFinal = useMemo(() => ({
        ...lineStyle,
        borderRadius: '9999px',
        ...(!asButton && { width: active && isInteractive ? '4px' : '6px' }),
        ...(asButton && { width: active && isInteractive ? '4px' : '4px' }),
        ...(!asButton && { left: active && isInteractive ? `${Math.ceil(size / 4) + 1}px` : '3px' }),
        ...(asButton && { left: active && isInteractive ? `${Math.ceil(size / 4) + 1}px` : `${Math.ceil(size / 4) + 3}px` }),
        ...(readOnly && { backgroundColor: 'var(--accent-a8)' }),
        ...(disabled && !readOnly && { backgroundColor: 'var(--gray-a8)' }),
    }), [active, size, asButton, disabled, readOnly, isInteractive]);

    const textStyleFinal = useMemo(() => {
        let opacity = 0;
        if (!readOnly) {
            opacity = ((active && !hideValue) || asButton) ? 1 : 0;
        }
        return {
            ...textStyle,
            ...(!active && { fontSize: asButton ? '10px' : 'var(--font-size-2)' }),
            ...(active && { fontSize: 'var(--font-size-2)' }),
            lineHeight: 'var(--line-height-1)',
            letterSpacing: 'var(--letter-spacing-2)',
            color: 'var(--accent-a11)',
            width: `${size}px`,
            height: `${size}px`,
            opacity,
            ...(prefersReducedMotion && { transition: 'none' }),
            ...(disabled && !readOnly && { color: 'var(--gray-a8)' }),
        };
    }, [active, size, hideValue, asButton, disabled, readOnly, prefersReducedMotion]);

    const onDrag = useCallback(({ delta, last }) => {
        if (!isInteractive) return;
        const baseDecimal = dragDecimalRef.current ?? valueDecimal;
        const diffDecimal = delta[0] * dragSensitivity + delta[1] * -dragSensitivity;
        const newValueDecimal = clamp(baseDecimal + diffDecimal, 0, 1);
        dragDecimalRef.current = newValueDecimal;
        setDragDecimal(newValueDecimal);
        scheduleSend(newValueDecimal);
        if (last) {
            flushOnRelease();
            deactivate();
        }
    }, [valueDecimal, isInteractive, scheduleSend, flushOnRelease, deactivate]);

    // Manual drag handlers for Ubuntu/Linux fallback
    const onManualMouseDown = useCallback((e) => {
        if (!isInteractive) return;
        onFocusRingPointerDown();
        e.preventDefault();
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
        activate();
    }, [isInteractive, activate, onFocusRingPointerDown]);

    const onManualMouseMove = useCallback((e) => {
        if (!isDragging || !isInteractive) return;
        e.preventDefault();

        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        const diffDecimal = deltaX * dragSensitivity + deltaY * -dragSensitivity;
        const baseDecimal = dragDecimalRef.current ?? valueDecimal;
        const newValueDecimal = clamp(baseDecimal + diffDecimal, 0, 1);
        dragDecimalRef.current = newValueDecimal;
        setDragDecimal(newValueDecimal);
        scheduleSend(newValueDecimal);

        setLastMousePos({ x: e.clientX, y: e.clientY });
    }, [isDragging, isInteractive, lastMousePos, valueDecimal, scheduleSend]);

    const onManualMouseUp = useCallback(() => {
        setIsDragging(false);
        flushOnRelease();
        deactivate();
    }, [deactivate, flushOnRelease]);

    // Add global mouse listeners when dragging
    useEffect(() => {
        if (isDragging && isLinux) {
            document.addEventListener('mousemove', onManualMouseMove);
            document.addEventListener('mouseup', onManualMouseUp);
            document.addEventListener('mouseleave', onManualMouseUp);

            return () => {
                document.removeEventListener('mousemove', onManualMouseMove);
                document.removeEventListener('mouseup', onManualMouseUp);
                document.removeEventListener('mouseleave', onManualMouseUp);
            };
        }
        return undefined;
    }, [isDragging, onManualMouseMove, onManualMouseUp]);

    const bindDrag = useDrag(onDrag, dragConfig);

    const dragProps = useMemo(() => {
        if (isLinux) return {};
        const { onPointerDown: dragOnPointerDown, ...rest } = bindDrag();
        return {
            ...rest,
            onPointerDown: (e) => {
                onFocusRingPointerDown();
                dragOnPointerDown?.(e);
                activate();
                e.preventDefault();
            },
        };
    }, [bindDrag, activate, onFocusRingPointerDown]);

    const onRightClickFinal = useCallback((e) => {
        e.preventDefault();
        if (isMobile) return;
        onRightClick();
    }, [onRightClick]);

    const onDoubleClick = useCallback((e) => {
        if (!isInteractive) return;
        resetToDefault();
        e.preventDefault();
    }, [resetToDefault, isInteractive]);

    const onKeyDown = useCallback((event) => {
        if (!isInteractive) return;
        const { code } = event;
        let handled = false;
        const multiplier = getKeyboardMultiplier(code);
        const current = lastSentValueRef.current ?? value;
        if (['ArrowUp', 'ArrowRight'].includes(code)) {
            setImmediate(clamp(current + keyboardStep * multiplier, minimum, maximum));
            handled = true;
        } else if (['ArrowDown', 'ArrowLeft'].includes(code)) {
            setImmediate(clamp(current - keyboardStep * multiplier, minimum, maximum));
            handled = true;
        } else if (code === 'PageUp') {
            setImmediate(clamp(current + keyboardStepLarge * multiplier, minimum, maximum));
            handled = true;
        } else if (code === 'PageDown') {
            setImmediate(clamp(current - keyboardStepLarge * multiplier, minimum, maximum));
            handled = true;
        } else if (code === 'Home') {
            resetKeyboardHold();
            setImmediate(minimum);
            handled = true;
        } else if (code === 'End') {
            resetKeyboardHold();
            setImmediate(maximum);
            handled = true;
        } else if (code === 'Enter' && onRightClick) {
            onRightClick();
            handled = true;
        } else if ((code === 'Delete' || code === 'Backspace') && !event.repeat) {
            resetKeyboardHold();
            resetToDefault();
            handled = true;
        }
        if (handled) event.preventDefault();
    }, [
        setImmediate, value, minimum, maximum, isInteractive, keyboardStep, keyboardStepLarge,
        onRightClick, resetToDefault, getKeyboardMultiplier, resetKeyboardHold,
    ]);

    const onKeyUp = useCallback((event) => {
        if (isKeyboardStepKey(event.code)) {
            onKeyboardKeyUp(event);
        }
    }, [onKeyboardKeyUp]);

    const interactionProps = useMemo(() => {
        if (!isInteractive) return { tabIndex: -1 };

        return {
            role: 'slider',
            tabIndex: 0,
            'aria-disabled': disabled || undefined,
            'aria-valuenow': displayValue,
            'aria-valuemin': minimum,
            'aria-valuemax': maximum,
            'aria-orientation': orientation,
            'aria-valuetext': valueDisplay,
            ...dragProps,
            onMouseDown: isLinux ? onManualMouseDown : activate,
            onMouseUp: isLinux ? undefined : deactivate,
            onMouseLeave: isLinux ? undefined : deactivate,
            onTouchStart: activate,
            onTouchEnd: deactivate,
            onFocus,
            onBlur,
            onContextMenu: onRightClickFinal,
            onDoubleClick,
            onKeyDown,
            onKeyUp,
        };
    }, [
        isInteractive, disabled, displayValue, minimum, maximum, orientation, valueDisplay,
        dragProps, onManualMouseDown, activate, deactivate,
        onFocus, onBlur, onRightClickFinal, onDoubleClick, onKeyDown, onKeyUp,
    ]);

    return (
        <div
            ref={knobRef}
            className="mmc-knob"
            {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
            {...(keyboardFocus && isInteractive ? { 'data-keyboard-focus': '' } : {})}
            style={containerStyleFinal}
            data-accent-color={color}
            {...interactionProps}
        >
            <div
                className="mmc-knob__wrapper"
                style={wrapperStyleFinal}
                data-accent-color={color}
            >
                <div style={knobStyleFinal}>
                    <div style={lineStyleFinal} data-accent-color={color} />
                </div>
            </div>
            <Flex justify="center" align="center" style={textStyleFinal} data-accent-color={color}>
                {valueDisplay}
            </Flex>
        </div>
    );
};
