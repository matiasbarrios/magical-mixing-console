// Requirements
import { useDevice } from '@magical-mixing/mixers-react';
import { EraserIcon } from '@radix-ui/react-icons';
import { IconButton, TextField } from '@radix-ui/themes';
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { ICON_STYLE } from '../../helpers/values';
import { useUiSize } from '../theme';


// Consants
const DEBOUNCE_TIME = 500;


// Exported
export default ({
    id, value, set, placeholder, onChange, onEnter, variant, size: sizeProp,
    debounceTime = DEBOUNCE_TIME, style, width, maxWidth, minWidth,
}) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const size = sizeProp ?? textSize;

    const [tempValue, setTempValue] = useState(value);
    const timer = useRef(null);

    const onChangeWithDebounce = useCallback((e) => {
        const v = onChange ? onChange(e.target.value) : e.target.value;
        setTempValue(v);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => set(v), debounceTime);
    }, [set, debounceTime, onChange]);

    const erase = useCallback(() => {
        set('');
        setTempValue('');
    }, [set]);

    const onKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && onEnter) onEnter();
    }, [onEnter]);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const eraseVisible = !!tempValue;

    const eraseButtonStyle = useMemo(() => ({
        opacity: eraseVisible ? 1 : 0,
        pointerEvents: eraseVisible ? undefined : 'none',
        transition: 'opacity 0.2s',
    }), [eraseVisible]);

    const styleFinal = useMemo(() => ({
        ...(width !== undefined && { width }),
        ...(maxWidth !== undefined && { maxWidth }),
        ...(minWidth !== undefined && { minWidth }),
        ...style,
    }), [style, width, maxWidth, minWidth]);

    return (
        <TextField.Root
            id={id}
            value={tempValue}
            placeholder={placeholder}
            onChange={onChangeWithDebounce}
            onKeyDown={onKeyDown}
            disabled={disabled}
            size={size}
            variant={variant}
            style={styleFinal}
        >
            <TextField.Slot side="right" pr="3">
                <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={erase}
                    disabled={disabled}
                    aria-label="Erase"
                    style={eraseButtonStyle}
                >
                    <EraserIcon style={ICON_STYLE} />
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    );
};
