// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { TextField } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useUiSize } from '../theme';


// Constants
const STANDARD_FREQUENCIES = [
    20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
    630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000,
    10000, 12500, 16000, 20000,
];


// Internal
const clamp = (v, minimum, maximum) => Math.min(maximum, Math.max(minimum, v));

const frequenciesInRange = (minimum, maximum) => STANDARD_FREQUENCIES
    .filter(f => f >= minimum && f <= maximum);

const nearestIndex = (value, freqs) => {
    let bestIdx = 0;
    let bestDiff = Infinity;
    freqs.forEach((f, i) => {
        const diff = Math.abs(f - value);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestIdx = i;
        }
    });
    return bestIdx;
};

const snapToStandard = (value, minimum, maximum) => {
    const freqs = frequenciesInRange(minimum, maximum);
    if (!freqs.length) return Math.round(value);
    return freqs[nearestIndex(value, freqs)];
};

const stepFrequency = (
    value, minimum, maximum, direction, jump = 1
) => {
    const freqs = frequenciesInRange(minimum, maximum);
    if (!freqs.length) return value;
    const idx = nearestIndex(value, freqs);
    const nextIdx = direction === 'up'
        ? Math.min(idx + jump, freqs.length - 1)
        : Math.max(idx - jump, 0);
    return freqs[nextIdx];
};

const formatFrequency = (v) => {
    if (v === undefined || v === null) return '';
    const rounded = Math.round(v);
    if (Math.abs(v - rounded) < 0.05) return String(rounded);
    return String(Math.round(v * 10) / 10);
};

const normalizeFrequency = (value) => {
    const rounded = Math.round(value);
    if (Math.abs(value - rounded) < 0.05) return rounded;
    return Math.round(value * 10) / 10;
};


// Exported
export default ({
    value, set, minimum, maximum, onEnter, autoFocus, inputRef, size: sizeProp, style: inputStyle,
    width, maxWidth, minWidth,
}) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const size = sizeProp ?? textSize;
    const [internalValue, setInternalValue] = useState('');
    const isEditingRef = useRef(false);

    const displayValue = useCallback((v) => {
        if (v === undefined || v === null) return '';
        return formatFrequency(v);
    }, []);

    const commit = useCallback((raw) => {
        const n = parseFloat(raw);
        if (Number.isNaN(n)) {
            setInternalValue(displayValue(value));
            return;
        }
        const clamped = clamp(n, minimum, maximum);
        const normalized = normalizeFrequency(clamped);
        set(normalized);
        setInternalValue(formatFrequency(normalized));
    }, [set, value, minimum, maximum, displayValue]);

    const step = useCallback((direction, large = false) => {
        const current = snapToStandard(value ?? minimum, minimum, maximum);
        const jump = large ? 5 : 1;
        const next = stepFrequency(
            current, minimum, maximum, direction, jump
        );
        set(next);
        setInternalValue(formatFrequency(next));
    }, [value, set, minimum, maximum]);

    const onChange = useCallback((e) => {
        setInternalValue(e.target.value.replace(/[^\d.]/g, ''));
    }, []);

    const onFocus = useCallback((e) => {
        isEditingRef.current = true;
        e.target.select();
    }, []);

    const onBlur = useCallback((e) => {
        isEditingRef.current = false;
        commit(e.target.value);
    }, [commit]);

    const onKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            step('up', e.shiftKey);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            step('down', e.shiftKey);
            return;
        }
        if (e.key === 'PageUp') {
            e.preventDefault();
            step('up', true);
            return;
        }
        if (e.key === 'PageDown') {
            e.preventDefault();
            step('down', true);
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            commit(e.currentTarget.value);
            if (onEnter) onEnter(e);
            else e.currentTarget.blur();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setInternalValue(displayValue(value));
            e.currentTarget.blur();
        }
    }, [step, commit, onEnter, value, displayValue]);

    useEffect(() => {
        if (isEditingRef.current) return;
        setInternalValue(displayValue(value));
    }, [value, displayValue]);

    const style = useMemo(() => ({
        fontVariantNumeric: 'tabular-nums',
        ...(width !== undefined && { width }),
        ...(maxWidth !== undefined && { maxWidth }),
        ...(minWidth !== undefined && { minWidth }),
        ...inputStyle,
    }), [inputStyle, width, maxWidth, minWidth]);

    return (
        <TextField.Root
            ref={inputRef}
            size={size}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            placeholder="Hz"
            value={internalValue}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
            autoFocus={autoFocus}
            style={style}
        />
    );
};
