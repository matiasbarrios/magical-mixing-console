// Requirements
import {
    cloneElement, isValidElement, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Slider } from 'radix-ui';
import { Text } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { noDecimals, oneDecimal, twoDecimals } from '../../helpers/format';
import { isMobile } from '../../platform';
import { usePrefersReducedMotion } from '../../helpers/prefersReducedMotion';
import { isKeyboardStepKey, useKeyboardHoldAcceleration } from '../../helpers/keyboardAcceleration';
import { mmcFocusVisibleShadow, useKeyboardFocus } from '../../helpers/useKeyboardFocus';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';


// Constants
const minimumPercentageToShow = 5;

const peakTimeout = 2 * 1000;

// Fader curves compress low dB into a small part of 0–1; 0.001 step is ~0.5 dB there.
const sliderStep = 0.0001;

// ~20 updates/s while dragging; enough for smooth fader feel without flooding OSC.
const setThrottleMs = 50;

const quantizeValue = (v, decimals) => {
    const factor = 10 ** decimals;
    return Math.round(v * factor) / factor;
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const isValidMeterSample = v => typeof v === 'number' && Number.isFinite(v);

const hasDisplayableMeter = (value) => {
    if (value === undefined) return false;
    if (Array.isArray(value)) return value.some(isValidMeterSample);
    return isValidMeterSample(value);
};

const scaledPx = (base, trackSizePx) => `${Math.round((base * trackSizePx) / 22)}px`;

const trackBackgroundGray = {
    backgroundColor: 'var(--gray-4)',
    backgroundImage: 'linear-gradient(var(--white-a1), var(--white-a1))',
};

const trackBackgroundRed = {
    backgroundColor: 'var(--red-8)',
};

const trackBackgroundColor = {
    backgroundColor: 'var(--accent-track)',
    backgroundImage: 'none',
};

const rootStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    touchAction: 'none',
};

const trackStyle = {
    position: 'relative',
    flexGrow: 1,
    borderRadius: '9999px',
};

const thumbStyle = {
    display: 'block',
    width: '20px',
    height: '20px',
    borderRadius: '10px',
};

const meterRootStyle = {
    position: 'relative',
    left: '8px',
};

const meterGradientLeftStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    clipPath: 'inset(0 0 0 0)',
};

const meterValueLeftStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
};

const peakValueLeftStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
};

const meterGradientRightStyle = {
    position: 'absolute',
    clipPath: 'inset(0 0 0 0)',
};

const meterValueRightStyle = {
    position: 'absolute',
};

const peakValueRightStyle = {
    position: 'absolute',
};

const displayedValueStyle = {
    position: 'absolute',
    color: 'var(--gray-a9)',
    lineHeight: 'var(--line-height-1)',
    letterSpacing: 'var(--letter-spacing-1)',
};

const meterValuesTextStyle = {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
};

const meterValueRowStyle = {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1,
    letterSpacing: 'var(--letter-spacing-1)',
};


// Internal
const linearGradient = direction => `linear-gradient(to ${direction}, var(--green-9) 0%, var(--green-9) 50%, var(--yellow-9) 80%, var(--red-9) 95%)`;


// Exported
export const Meter = ({
    value, valueToDecimal, isVertical, hasColor, valuesShow, paintOpposite, dir = 'ltr', flush = false,
}) => {
    const { disabled } = useDevice();
    const prefersReducedMotion = usePrefersReducedMotion();
    const { meterSliderTrackSizePx, textSize } = useUiSize();

    const meterTransition = prefersReducedMotion ? undefined : '0.15s ease-out';
    const isStereo = useMemo(() => Array.isArray(value) && value.length === 2, [value]);

    const percentageGet = useCallback((v) => {
        if (!isValidMeterSample(v)) return 0;
        const r = Math.round(10000 * valueToDecimal(v)) / 100; // Two decimals, smoother animation
        if (!Number.isFinite(r) || r <= minimumPercentageToShow) return 0;
        return Math.min(r, 100);
    }, [valueToDecimal]);

    const hidden = useMemo(() => (disabled || !hasDisplayableMeter(value)),
        [value, disabled]);

    const leftSample = useMemo(() => (Array.isArray(value) ? value[0] : value), [value]);
    const rightSample = useMemo(() => (Array.isArray(value) ? value[1] : value), [value]);
    const showLeftValue = useMemo(() => isValidMeterSample(leftSample), [leftSample]);
    const showRightValue = useMemo(() => isValidMeterSample(rightSample), [rightSample]);

    const leftValue = useMemo(() => percentageGet(Array.isArray(value)
        ? value[0] : value), [percentageGet, value]);

    const rightValue = useMemo(() => percentageGet(Array.isArray(value)
        ? value[1] : value), [percentageGet, value]);

    // Peaks
    const [leftPeakShown, setLeftPeakShown] = useState(false);
    const hideLeftPeak = useCallback(() => { setLeftPeakShown(false); }, []);
    const [rightPeakShown, setRightPeakShown] = useState(false);
    const hideRightPeak = useCallback(() => { setRightPeakShown(false); }, []);

    const leftPeakTimeout = useRef(null);
    const rightPeakTimeout = useRef(null);

    useEffect(() => {
        if (leftValue >= 99.99) {
            setLeftPeakShown(true);
            if (leftPeakTimeout?.current) clearTimeout(leftPeakTimeout.current);
            leftPeakTimeout.current = setTimeout(() => {
                setLeftPeakShown(false);
                leftPeakTimeout.current = null;
            }, peakTimeout);
        }
        if (isStereo && rightValue >= 99.99) {
            setRightPeakShown(true);
            if (rightPeakTimeout?.current) clearTimeout(rightPeakTimeout.current);
            rightPeakTimeout.current = setTimeout(() => {
                setRightPeakShown(false);
                rightPeakTimeout.current = null;
            }, peakTimeout);
        }
    }, [leftValue, rightValue, isStereo]);

    // Styling
    const meterRootStyleFinal = useMemo(() => ({
        ...meterRootStyle,
        ...(flush ? {
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
        } : {
            ...(isVertical ? { width: '0' } : { width: 'calc(100% - 8px)' }),
            ...(isVertical ? { height: 'calc(100% - 16px)' } : { height: scaledPx(10, meterSliderTrackSizePx) }),
            ...(isVertical && { top: '8px' }),
            ...(!isVertical && (isStereo
                ? { top: scaledPx(4, meterSliderTrackSizePx) }
                : { top: scaledPx(6, meterSliderTrackSizePx) })),
            ...(!isVertical && dir === 'ltr' && { left: '0px' }),
            ...(!isVertical && dir === 'rtl' && { right: '8px' }),
            ...(isVertical && (isStereo ? { left: '9.5px' } : { left: '15px' })),
        }),
    }), [isStereo, isVertical, dir, flush, meterSliderTrackSizePx]);

    const flushRadius = '0 0 var(--radius-3) var(--radius-3)';

    const meterGradientLeftStyleFinal = useMemo(() => ({
        ...meterGradientLeftStyle,
        ...(isVertical && (isStereo
            ? { width: scaledPx(5, meterSliderTrackSizePx) }
            : { width: scaledPx(10, meterSliderTrackSizePx) })),
        ...(!isVertical && { width: '100%' }),
        ...(isVertical && { height: '100%' }),
        ...(!isVertical && (isStereo
            ? { height: scaledPx(6, meterSliderTrackSizePx) }
            : { height: scaledPx(10, meterSliderTrackSizePx) })),
        ...(flush && !isVertical && { height: '100%' }),
        ...(!paintOpposite && { backgroundImage: linearGradient(isVertical ? 'top' : 'right') }),
        ...(paintOpposite && (hasColor ? trackBackgroundColor : trackBackgroundGray)),
        ...(!paintOpposite && { borderRadius: flush && !isVertical ? flushRadius : '5px' }),
    }), [isVertical, isStereo, paintOpposite, hasColor, flush, meterSliderTrackSizePx]);

    const meterValueLeftStyleFinal = useMemo(() => ({
        ...meterValueLeftStyle,
        ...(isVertical && (isStereo
            ? { width: scaledPx(5, meterSliderTrackSizePx) }
            : { width: scaledPx(10, meterSliderTrackSizePx) })),
        ...(!isVertical && { width: `${100 - leftValue}%` }),
        ...(isVertical && { height: `${100 - leftValue}%` }),
        ...(!isVertical && (isStereo
            ? { height: scaledPx(6, meterSliderTrackSizePx) }
            : { height: scaledPx(10, meterSliderTrackSizePx) })),
        ...(flush && !isVertical && { height: '100%' }),
        ...(!isVertical && meterTransition && { transition: `width ${meterTransition}` }),
        ...(isVertical && meterTransition && { transition: `height ${meterTransition}` }),
        ...(!paintOpposite && (hasColor ? trackBackgroundColor : trackBackgroundGray)),
        ...(paintOpposite && trackBackgroundRed),
        ...(paintOpposite && { borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }),
        ...(paintOpposite && leftValue === 0 && {
            borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px',
        }),
        ...(flush && !isVertical && leftValue === 0 && { borderRadius: flushRadius }),
    }), [
        isVertical, isStereo, leftValue, hasColor, paintOpposite, flush,
        meterTransition, meterSliderTrackSizePx,
    ]);

    const peakValueLeftStyleFinal = useMemo(() => ({
        ...peakValueLeftStyle,
        ...(isVertical && (isStereo
            ? { width: scaledPx(5, meterSliderTrackSizePx) }
            : { width: scaledPx(10, meterSliderTrackSizePx) })),
        ...(!isVertical && { width: scaledPx(3, meterSliderTrackSizePx) }),
        ...(isVertical && { height: scaledPx(3, meterSliderTrackSizePx) }),
        ...(!isVertical && (isStereo
            ? { height: scaledPx(6, meterSliderTrackSizePx) }
            : { height: scaledPx(10, meterSliderTrackSizePx) })),
        ...(!isVertical && meterTransition && { transition: `width ${meterTransition}` }),
        ...(isVertical && meterTransition && { transition: `height ${meterTransition}` }),
        ...trackBackgroundRed,
        ...({ borderRadius: '5px' }),
    }), [isVertical, isStereo, meterTransition, meterSliderTrackSizePx]);

    const meterGradientRightStyleFinal = useMemo(() => ({
        ...meterGradientRightStyle,
        ...(isVertical ? { top: '0' } : { top: scaledPx(8, meterSliderTrackSizePx) }),
        ...(isVertical ? { right: scaledPx(-6, meterSliderTrackSizePx) } : { right: '0' }),
        ...(isVertical ? { width: scaledPx(5, meterSliderTrackSizePx) } : { width: '100%' }),
        ...(isVertical ? { height: '100%' } : { height: scaledPx(6, meterSliderTrackSizePx) }),
        ...(!paintOpposite && { backgroundImage: linearGradient(isVertical ? 'top' : 'right') }),
        ...(paintOpposite && (hasColor ? trackBackgroundColor : trackBackgroundGray)),
        ...(!paintOpposite && { borderRadius: '5px' }),
    }), [isVertical, paintOpposite, hasColor, meterSliderTrackSizePx]);

    const meterValueRightStyleFinal = useMemo(() => ({
        ...meterValueRightStyle,
        ...(isVertical ? { top: '0' } : { top: scaledPx(8, meterSliderTrackSizePx) }),
        ...(isVertical ? { right: scaledPx(-6, meterSliderTrackSizePx) } : { right: '0' }),
        ...(isVertical ? { width: scaledPx(5, meterSliderTrackSizePx) } : { width: `${100 - rightValue}%` }),
        ...(isVertical ? { height: `${100 - rightValue}%` } : { height: scaledPx(6, meterSliderTrackSizePx) }),
        ...(!isVertical && meterTransition && { transition: `width ${meterTransition}` }),
        ...(isVertical && meterTransition && { transition: `height ${meterTransition}` }),
        ...(!paintOpposite && (hasColor ? trackBackgroundColor : trackBackgroundGray)),
        ...(paintOpposite && trackBackgroundRed),
        ...(paintOpposite && { borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }),
    }), [isVertical, rightValue, hasColor, paintOpposite, meterTransition, meterSliderTrackSizePx]);

    const peakValueRightStyleFinal = useMemo(() => ({
        ...peakValueRightStyle,
        ...(isVertical ? { top: '0' } : { top: scaledPx(8, meterSliderTrackSizePx) }),
        ...(isVertical ? { right: scaledPx(-6, meterSliderTrackSizePx) } : { right: '0' }),
        ...(isVertical ? { width: scaledPx(5, meterSliderTrackSizePx) }
            : { width: scaledPx(3, meterSliderTrackSizePx) }),
        ...(isVertical ? { height: scaledPx(3, meterSliderTrackSizePx) }
            : { height: scaledPx(6, meterSliderTrackSizePx) }),
        ...(!isVertical && meterTransition && { transition: `width ${meterTransition}` }),
        ...(isVertical && meterTransition && { transition: `height ${meterTransition}` }),
        ...trackBackgroundRed,
        ...({ borderRadius: '5px' }),
    }), [isVertical, meterTransition, meterSliderTrackSizePx]);

    const horizontalMeterValueFontSize = useMemo(() => (
        isStereo
            ? scaledPx(textSize === '1' ? 5 : 6, meterSliderTrackSizePx)
            : scaledPx(8, meterSliderTrackSizePx)
    ), [isStereo, textSize, meterSliderTrackSizePx]);

    const horizontalMeterValueRowBase = useMemo(() => ({
        ...meterValueRowStyle,
        left: scaledPx(5, meterSliderTrackSizePx),
        right: 0,
        fontSize: horizontalMeterValueFontSize,
    }), [meterSliderTrackSizePx, horizontalMeterValueFontSize]);

    const horizontalMeterValueRowLeftStyle = useMemo(() => ({
        ...horizontalMeterValueRowBase,
        top: 0,
        ...(isStereo
            ? { height: scaledPx(6, meterSliderTrackSizePx) }
            : { height: flush ? '100%' : scaledPx(10, meterSliderTrackSizePx) }),
    }), [horizontalMeterValueRowBase, isStereo, flush, meterSliderTrackSizePx]);

    const horizontalMeterValueRowRightStyle = useMemo(() => ({
        ...horizontalMeterValueRowBase,
        top: scaledPx(8, meterSliderTrackSizePx),
        height: scaledPx(6, meterSliderTrackSizePx),
    }), [horizontalMeterValueRowBase, meterSliderTrackSizePx]);

    const meterValuesTextStyleFinal = useMemo(() => ({
        ...meterValuesTextStyle,
        ...(isVertical && { bottom: '2px' }),
        ...(isVertical && isStereo && { left: scaledPx(7, meterSliderTrackSizePx) }),
        ...(isVertical && !isStereo && { left: '1px' }),
        ...(isVertical && { transformOrigin: 'bottom left', transform: 'rotate(270deg)' }),
        ...(isVertical && { minWidth: scaledPx(20, meterSliderTrackSizePx) }),
        ...(isVertical && { maxWidth: scaledPx(20, meterSliderTrackSizePx) }),
        ...(isVertical && (isStereo
            ? { fontSize: scaledPx(textSize === '1' ? 3 : 4, meterSliderTrackSizePx) }
            : { fontSize: scaledPx(8, meterSliderTrackSizePx) })),
        ...(isVertical && (isStereo
            ? { lineHeight: scaledPx(5, meterSliderTrackSizePx) }
            : { lineHeight: scaledPx(9, meterSliderTrackSizePx) })),
    }), [isStereo, isVertical, meterSliderTrackSizePx, textSize]);

    const meterValuesTextLeftStyleFinal = useMemo(() => ({
        ...(leftValue < minimumPercentageToShow ? { color: 'var(--gray-a9)' } : { color: 'var(--white-a9)' }),
        ...(paintOpposite && { color: 'var(--gray-a9)' }),
        ...((!paintOpposite && leftValue < minimumPercentageToShow)
            ? { opacity: 0 } : { opacity: 1 }),
    }), [leftValue, paintOpposite]);

    const meterValuesTextRightStyleFinal = useMemo(() => ({
        ...(rightValue < minimumPercentageToShow ? { color: 'var(--gray-a9)' } : { color: 'var(--white-a9)' }),
        ...(paintOpposite && { color: 'var(--gray-a9)' }),
        ...((!paintOpposite && rightValue < minimumPercentageToShow)
            ? { opacity: 0 } : { opacity: 1 }),
    }), [rightValue, paintOpposite]);

    return (
        <div style={meterRootStyleFinal}>
            {!hidden && (
                <>
                    {valuesShow && (
                        isVertical ? (
                            <div style={meterValuesTextStyleFinal}>
                                {showLeftValue && (
                                    <span style={meterValuesTextLeftStyleFinal}>
                                        {noDecimals(leftSample)}
                                    </span>
                                )}
                                {isStereo && showRightValue && (
                                    <span style={meterValuesTextRightStyleFinal}>
                                        {noDecimals(rightSample)}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <>
                                {showLeftValue && (
                                    <div style={horizontalMeterValueRowLeftStyle}>
                                        <span style={meterValuesTextLeftStyleFinal}>
                                            {noDecimals(leftSample)}
                                        </span>
                                    </div>
                                )}
                                {isStereo && showRightValue && (
                                    <div style={horizontalMeterValueRowRightStyle}>
                                        <span style={meterValuesTextRightStyleFinal}>
                                            {noDecimals(rightSample)}
                                        </span>
                                    </div>
                                )}
                            </>
                        )
                    )}
                    {showLeftValue && (
                        <>
                            <div style={meterGradientLeftStyleFinal} />
                            <div style={meterValueLeftStyleFinal} />
                            {leftPeakShown && (
                                <div
                                    role="button"
                                    tabIndex={-1}
                                    style={peakValueLeftStyleFinal}
                                    onClick={hideLeftPeak}
                                />
                            )}
                        </>
                    )}
                    {isStereo && showRightValue && (
                        <>
                            <div style={meterGradientRightStyleFinal} />
                            <div style={meterValueRightStyleFinal} />
                            {rightPeakShown && (
                                <div
                                    role="button"
                                    tabIndex={-1}
                                    style={peakValueRightStyleFinal}
                                    onClick={hideRightPeak}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};


export const MeterSlider = ({
    value,
    set,
    valueToDecimal,
    decimalToValue,
    minimum,
    maximum,
    color,
    onDisplayedValueClicked,
    onResetValueClicked,
    disabled,
    readOnly = false,
    isVertical,
    meter,
    meterNotAvailable,
    valueShowAlways,
    decimalsToShow = 1,
    dir = 'ltr',
    showPlusIfPositive = false,
    ariaLabel,
    label,
    trackStart,
}) => {
    const { t } = useLanguage();
    const { disabled: deviceDisabled } = useDevice();
    const prefersReducedMotion = usePrefersReducedMotion();
    const { meterSliderSizePx, meterSliderTrackSizePx } = useUiSize();

    const {
        getMultiplier: getKeyboardMultiplier,
        onKeyUp: onKeyboardKeyUp,
        reset: resetKeyboardHold,
    } = useKeyboardHoldAcceleration(prefersReducedMotion);

    const decimalValue = useMemo(() => {
        if (value === undefined || valueToDecimal === undefined) return undefined;
        return valueToDecimal(value);
    }, [value, valueToDecimal]);

    const lastDecimalRef = useRef(null);
    const lastSentValueRef = useRef(undefined);
    const throttleTimerRef = useRef(null);
    const [dragDecimal, setDragDecimal] = useState(null);

    const sliderDecimal = dragDecimal ?? decimalValue;

    const displayValue = useMemo(() => {
        if (dragDecimal !== null && decimalToValue) return decimalToValue(dragDecimal);
        return value;
    }, [dragDecimal, decimalToValue, value]);

    const displayedValue = useMemo(() => {
        if (displayValue === undefined) return '';
        let ds;
        if (decimalsToShow === 0) ds = noDecimals(displayValue);
        if (decimalsToShow === 1) ds = oneDecimal(displayValue);
        if (decimalsToShow === 2) ds = twoDecimals(displayValue);
        return `${showPlusIfPositive && displayValue >= 0 ? '+' : ''}${ds}`;
    }, [displayValue, decimalsToShow, showPlusIfPositive]);

    const setValue = useCallback((decimal) => {
        if (!set || !decimalToValue || Number.isNaN(decimal)) return;
        const rawValue = decimalToValue(decimal);
        if (Number.isNaN(rawValue)) return;
        const quantized = quantizeValue(rawValue, decimalsToShow);
        if (quantized === lastSentValueRef.current) return;
        lastSentValueRef.current = quantized;
        set(quantized);
    }, [decimalToValue, decimalsToShow, set]);

    useEffect(() => {
        if (value !== undefined) {
            lastSentValueRef.current = quantizeValue(value, decimalsToShow);
        }
    }, [value, decimalsToShow]);

    useEffect(() => () => {
        if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
    }, []);

    const flushPending = useCallback(() => {
        if (lastDecimalRef.current !== null) setValue(lastDecimalRef.current);
    }, [setValue]);

    const valueMinimum = useMemo(() => (minimum !== undefined ? minimum : decimalToValue?.(0)),
        [minimum, decimalToValue]);

    const valueMaximum = useMemo(() => (maximum !== undefined ? maximum : decimalToValue?.(1)),
        [maximum, decimalToValue]);

    const keyboardStep = useMemo(() => 10 ** (-decimalsToShow), [decimalsToShow]);

    const keyboardStepLarge = useMemo(() => keyboardStep * 10, [keyboardStep]);

    const setImmediate = useCallback((rawValue) => {
        if (!set) return;
        if (throttleTimerRef.current) {
            clearTimeout(throttleTimerRef.current);
            throttleTimerRef.current = null;
        }
        const clamped = clamp(rawValue, valueMinimum, valueMaximum);
        const quantized = quantizeValue(clamped, decimalsToShow);
        lastSentValueRef.current = quantized;
        lastDecimalRef.current = valueToDecimal(quantized);
        setDragDecimal(null);
        set(quantized);
    }, [decimalsToShow, set, valueMaximum, valueMinimum, valueToDecimal]);

    const [showValue, setShowValue] = useState(false);

    const onValueChangeFinal = useCallback((v) => {
        const [decimal] = v;
        lastDecimalRef.current = decimal;
        setDragDecimal(decimal);
        setShowValue(true);

        if (!throttleTimerRef.current) {
            setValue(decimal);
            throttleTimerRef.current = setTimeout(() => {
                throttleTimerRef.current = null;
                flushPending();
            }, setThrottleMs);
        }
    }, [setValue, flushPending]);

    const onValueCommit = useCallback(() => {
        if (throttleTimerRef.current) {
            clearTimeout(throttleTimerRef.current);
            throttleTimerRef.current = null;
        }
        flushPending();
        setDragDecimal(null);
        setShowValue(false);
    }, [flushPending]);

    const [thumbHover, setThumbHover] = useState(false);
    const {
        keyboardFocus: thumbKeyboardFocus,
        onPointerDown: onThumbFocusRingPointerDown,
        onFocus: onThumbFocus,
        onBlur: onThumbFocusBlur,
    } = useKeyboardFocus();

    const onThumbBlur = useCallback(() => {
        resetKeyboardHold();
        onThumbFocusBlur();
    }, [onThumbFocusBlur, resetKeyboardHold]);
    const onThumbHover = useCallback(() => setThumbHover(true), []);
    const onThumbLeave = useCallback(() => setThumbHover(false), []);

    const displayedValueRef = useRef(null);

    const orientation = useMemo(() => (isVertical ? 'vertical' : 'horizontal'), [isVertical]);

    const isDisabled = useMemo(() => (disabled || deviceDisabled) && !readOnly,
        [disabled, deviceDisabled, readOnly]);

    const isInteractive = useMemo(() => !readOnly && !disabled && !deviceDisabled,
        [readOnly, disabled, deviceDisabled]);

    const onSliderContextMenu = useCallback((e) => {
        if (!isInteractive || !onDisplayedValueClicked) return;
        const valueEl = displayedValueRef.current;
        if (!valueEl) return;
        const rect = valueEl.getBoundingClientRect();
        if (
            e.clientX >= rect.left && e.clientX <= rect.right
            && e.clientY >= rect.top && e.clientY <= rect.bottom
        ) {
            e.preventDefault();
            onDisplayedValueClicked();
        }
    }, [isInteractive, onDisplayedValueClicked]);

    const passThroughTrackTouches = useMemo(() => {
        const coarsePointer = typeof window !== 'undefined'
            && window.matchMedia?.('(pointer: coarse)').matches;
        const hasTouchScreen = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
        return isInteractive && (isMobile || coarsePointer || hasTouchScreen);
    }, [isInteractive]);

    const onRootPointerDown = useCallback((e) => {
        if (!passThroughTrackTouches) return;
        const { target } = e;
        const onThumb = target?.closest?.('.mmc-meter-slider__thumb');
        if (!onThumb) {
            e.preventDefault();
        }
    }, [passThroughTrackTouches]);

    const onThumbKeyDown = useCallback((event) => {
        if (isDisabled || value === undefined) return;

        const current = displayValue ?? value;
        let next;
        const { code } = event;
        const multiplier = getKeyboardMultiplier(code);
        const keyboardCurrent = lastSentValueRef.current ?? current;

        if (['ArrowUp', 'ArrowRight'].includes(code)) {
            next = keyboardCurrent + keyboardStep * multiplier;
        } else if (['ArrowDown', 'ArrowLeft'].includes(code)) {
            next = keyboardCurrent - keyboardStep * multiplier;
        } else if (code === 'PageUp') {
            next = keyboardCurrent + keyboardStepLarge * multiplier;
        } else if (code === 'PageDown') {
            next = keyboardCurrent - keyboardStepLarge * multiplier;
        } else if (code === 'Home') {
            resetKeyboardHold();
            next = valueMinimum;
        } else if (code === 'End') {
            resetKeyboardHold();
            next = valueMaximum;
        } else if (code === 'Enter' && onDisplayedValueClicked) {
            onDisplayedValueClicked();
            event.preventDefault();
            return;
        } else if ((code === 'Delete' || code === 'Backspace') && onResetValueClicked && !event.repeat) {
            resetKeyboardHold();
            onResetValueClicked();
            event.preventDefault();
            return;
        } else {
            return;
        }

        event.preventDefault();
        setImmediate(next);
    }, [
        displayValue, isDisabled, keyboardStep, keyboardStepLarge,
        setImmediate, value, valueMaximum, valueMinimum,
        onDisplayedValueClicked, onResetValueClicked,
        getKeyboardMultiplier, resetKeyboardHold,
    ]);

    const onThumbKeyUp = useCallback((event) => {
        if (isKeyboardStepKey(event.code)) {
            onKeyboardKeyUp(event);
        }
    }, [onKeyboardKeyUp]);

    const rootStyleFinal = useMemo(() => ({
        ...rootStyle,
        ...(passThroughTrackTouches ? { pointerEvents: 'none' } : {}),
        ...(passThroughTrackTouches && !isVertical ? { touchAction: 'pan-y' } : {}),
        ...(passThroughTrackTouches && isVertical ? { touchAction: 'pan-x' } : {}),
        ...(isVertical ? { width: `${meterSliderSizePx}px`, height: '100%' } : { width: '100%', height: `${meterSliderSizePx}px` }),
        ...(isDisabled ? { opacity: 0.2, cursor: 'not-allowed' } : {}),
        ...(readOnly ? { cursor: 'default' } : {}),
    }), [isVertical, isDisabled, readOnly, passThroughTrackTouches, meterSliderSizePx]);

    const trackStyleFinal = useMemo(() => ({
        ...trackStyle,
        position: 'relative',
        ...(passThroughTrackTouches ? { pointerEvents: 'none' } : {}),
        ...(isVertical ? { width: `${meterSliderTrackSizePx}px`, height: '100%' } : { width: '100%', height: `${meterSliderTrackSizePx}px` }),
        ...(isDisabled ? { backgroundColor: 'var(--gray-a4)', backgroundImage: 'none' } : {}),
        ...(!color ? trackBackgroundGray : trackBackgroundColor),
        ...(!!color && { boxShadow: 'inset 0 0 0 1px var(--gray-a3), inset 0 0 0 1px var(--accent-a4), inset 0 0 0 1px var(--black-a1), inset 0 1.5px 2px 0 var(--black-a2)' }),
    }), [isVertical, isDisabled, color, passThroughTrackTouches, meterSliderTrackSizePx]);

    const displayedValueStyleFinal = useMemo(() => ({
        ...displayedValueStyle,
        ...(isVertical && { transformOrigin: 'top right', transform: 'rotate(270deg)' }),
        ...(isVertical ? { top: '8px', right: '17px' } : {
            top: 0,
            right: '8px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1,
        }),
        ...({ fontSize: 'var(--font-size-1)' }),
        pointerEvents: 'none',
    }), [isVertical]);

    const displayedValueInlineStyle = useMemo(() => ({
        color: 'var(--gray-a9)',
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-1)',
        fontSize: 'var(--font-size-1)',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        pointerEvents: 'none',
    }), []);

    const trackEndOverlayStyle = useMemo(() => ({
        position: 'absolute',
        ...(isVertical && { transformOrigin: 'top right', transform: 'rotate(270deg)' }),
        ...(isVertical ? { top: '8px', right: '17px' } : { top: 0, right: '8px', height: '100%' }),
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        pointerEvents: 'none',
    }), [isVertical]);

    const trackLabelStyle = useMemo(() => ({
        color: 'var(--gray-a9)',
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-2)',
        fontSize: 'var(--font-size-2)',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
    }), []);

    const hasTrackStart = !!trackStart && !isVertical;

    const trackStartContent = useMemo(() => {
        if (typeof trackStart === 'string' || typeof trackStart === 'number') {
            return (
                <Text size="1" color="gray" wrap="nowrap">
                    { trackStart }
                </Text>
            );
        }
        if (isValidElement(trackStart)) {
            return cloneElement(trackStart, { size: '1' });
        }
        return trackStart;
    }, [trackStart]);

    const trackStyleWithStart = useMemo(() => ({
        ...trackStyleFinal,
        ...(hasTrackStart && {
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
        }),
    }), [trackStyleFinal, hasTrackStart]);

    const trackStartStyle = useMemo(() => ({
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px',
        paddingRight: '8px',
        pointerEvents: 'none',
    }), []);

    const trackBodyStyle = useMemo(() => ({
        position: 'relative',
        flex: 1,
        minWidth: 0,
        height: '100%',
        alignSelf: 'stretch',
        ...(!hasTrackStart && !isVertical && { paddingLeft: '8px' }),
    }), [hasTrackStart, isVertical]);

    const meterNotAvailableStyle = useMemo(() => ({
        ...displayedValueStyle,
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        ...(isVertical ? {
            top: '8px',
            left: '2px',
            transformOrigin: 'top left',
            transform: 'rotate(270deg)',
            fontSize: '7px',
        } : {
            top: 0,
            left: '8px',
            height: '100%',
            fontSize: '8px',
        }),
    }), [isVertical]);

    const thumbStyleFinal = useMemo(() => ({
        ...thumbStyle,
        width: `${meterSliderSizePx}px`,
        height: `${meterSliderSizePx}px`,
        borderRadius: `${meterSliderSizePx / 2}px`,
        backgroundColor: color ? 'var(--accent-a11)' : 'var(--gray-a8)',
        ...(passThroughTrackTouches && { pointerEvents: 'auto' }),
        ...(thumbKeyboardFocus && {
            boxShadow: mmcFocusVisibleShadow,
        }),
    }), [color, thumbKeyboardFocus, passThroughTrackTouches, meterSliderSizePx]);

    const slider = (
        <Slider.Root
            className="mmc-meter-slider"
            data-accent-color={color}
            defaultValue={[0]}
            min={0}
            max={1}
            step={sliderStep}
            value={[sliderDecimal]}
            onValueChange={onValueChangeFinal}
            onValueCommit={onValueCommit}
            onPointerDown={onRootPointerDown}
            onContextMenu={onSliderContextMenu}
            style={rootStyleFinal}
            disabled={!isInteractive}
            orientation={orientation}
            dir={dir}
        >
            <Slider.Track style={hasTrackStart ? trackStyleWithStart : trackStyleFinal}>
                {hasTrackStart && (
                    <div
                        className="mmc-meter-slider__track-start"
                        style={trackStartStyle}
                    >
                        { trackStartContent }
                    </div>
                )}
                <div style={trackBodyStyle}>
                    {meter}
                    {!!meterNotAvailable && (
                        <div style={meterNotAvailableStyle}>{ t('No meter')}</div>
                    )}
                    {!!label && (
                        <div style={trackEndOverlayStyle}>
                            {displayedValue !== undefined
                                && (showValue || valueShowAlways || thumbHover || readOnly) && (
                                <span
                                    ref={displayedValueRef}
                                    data-mmcs-value=""
                                    style={displayedValueInlineStyle}
                                >
                                    {displayedValue}
                                </span>
                            )}
                            <div style={trackLabelStyle}>
                                { label }
                            </div>
                        </div>
                    )}
                    {!label && displayedValue !== undefined
                        && (showValue || valueShowAlways || thumbHover || readOnly) && (
                        <div
                            ref={displayedValueRef}
                            data-mmcs-value=""
                            style={displayedValueStyleFinal}
                        >
                            {displayedValue}
                        </div>
                    )}
                </div>
            </Slider.Track>
            {isInteractive && value !== undefined && (
                <Slider.Thumb
                    className="mmc-meter-slider__thumb"
                    style={thumbStyleFinal}
                    aria-label={ariaLabel}
                    aria-valuenow={displayValue}
                    aria-valuemin={valueMinimum}
                    aria-valuemax={valueMaximum}
                    aria-valuetext={displayedValue}
                    {...(thumbKeyboardFocus ? { 'data-keyboard-focus': '' } : {})}
                    onPointerDown={onThumbFocusRingPointerDown}
                    onFocus={onThumbFocus}
                    onBlur={onThumbBlur}
                    onKeyDown={onThumbKeyDown}
                    onKeyUp={onThumbKeyUp}
                    onDoubleClick={onResetValueClicked}
                    onMouseEnter={onThumbHover}
                    onMouseLeave={onThumbLeave}
                />
            )}
        </Slider.Root>
    );

    return slider;
};
