// Requirements
import {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { cleanValue } from 'react-currency-input-field';
import { TextField } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';


// Exported
export default ({
    value, set, onEnter, decimalsLimit = 1, allowNegativeValue, minimum, maximum,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    const [internalValue, setInternalValue] = useState('');

    const cleanValueOptions = useMemo(() => ({
        decimalSeparator: '.',
        groupSeparator: ',',
        allowDecimals: true,
        decimalsLimit,
        allowNegativeValue,
        disableAbbreviations: true,
        prefix: '',
        transformRawValue: v => v,
    }), [decimalsLimit, allowNegativeValue]);

    const onChange = useCallback((e) => {
        const v = e.target.value;
        if (v === undefined || v === null) return;

        const stringValue = cleanValue({ value: v, ...cleanValueOptions });
        const stringValueWithoutSeparator = cleanValueOptions.decimalSeparator
            ? stringValue.replace(cleanValueOptions.decimalSeparator, '.')
            : stringValue;
        const numberValue = parseFloat(stringValueWithoutSeparator);

        if (Number.isNaN(numberValue)) {
            setInternalValue(stringValue);
            return;
        }
        if (stringValue.endsWith(cleanValueOptions.decimalSeparator)) {
            setInternalValue(stringValue);
            return;
        }
        if (minimum !== undefined && numberValue < minimum) {
            return;
        }
        if (maximum !== undefined && numberValue > maximum) {
            return;
        }

        setInternalValue(stringValue);
        set(numberValue);
    }, [set, cleanValueOptions, minimum, maximum]);

    const onKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && onEnter) onEnter();
    }, [onEnter]);

    useEffect(() => {
        if (value === undefined || value === null) return;
        let v = value.toString();
        if (value.toString().includes('.')) {
            v = value.toFixed(decimalsLimit).toString();
        }
        const stringValue = cleanValue({ value: v, ...cleanValueOptions });
        setInternalValue(stringValue);
    }, [value, cleanValueOptions, decimalsLimit]);

    return (
        <TextField.Root
            size={textSize}
            placeholder={t('Value')}
            value={internalValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={disabled}
        />
    );
};
