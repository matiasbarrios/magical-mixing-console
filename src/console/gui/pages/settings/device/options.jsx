// Requirements
import {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import {
    useConfigurationOption, useConfigurationOptions, useDevice,
} from '@magical-mixing/mixers-react';
import {
    Button, Flex, IconButton, Text, TextField,
} from '@radix-ui/themes';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { ICON_STYLE } from '../../../helpers/values';
import { useUiSize } from '../../../components/theme';
import { ActiveToggleButton } from '../../../components/base/activeToggleButton';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import TextFieldErasable from '../../../components/base/textFieldErasable';
import { useLanguage } from '../../../components/language';
import { useUnsavedValues, useValueOrFunction } from './unsavedContext';


// Internal
const OptionInputPassword = ({ value, onChange, disabled }) => {
    const [show, setShow] = useState(false);
    const toggleShow = useCallback(() => { setShow(!show); }, [show]);
    const { textSize } = useUiSize();
    return (
        <TextField.Root
            size={textSize}
            value={value}
            onChange={onChange}
            type={show ? 'text' : 'password'}
            disabled={disabled}
            style={{ width: '100%', maxWidth: '16rem' }}
        >
            <TextField.Slot side="right">
                <IconButton size={textSize} variant="ghost" onClick={toggleShow}>
                    {!show
                        ? <EyeClosedIcon style={ICON_STYLE} />
                        : <EyeOpenIcon style={ICON_STYLE} />}
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    );
};


const ConfigurationSelect = ({
    value, options, onChange, disabled,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const selectedOption = useMemo(() => options.find(o => o.value === value), [options, value]);

    const displayValue = useMemo(() => (selectedOption ? t(selectedOption.name) : ''),
        [selectedOption, t]);

    if (disabled) {
        return (
            <Button size={textSize} variant="soft" color="gray" disabled>
                <Text size="1" wrap="nowrap">{ displayValue }</Text>
            </Button>
        );
    }

    return (
        <DropdownSelect.Root set={onChange}>
            <DropdownSelect.Trigger square size={textSize} variant="soft" color="gray">
                <Text size="1" wrap="nowrap">{ displayValue }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                {options.map(o => (
                    <DropdownSelect.Option key={o.value} selected={value === o.value} id={o.value}>
                        <Text size="2" color="gray" wrap="nowrap">{ t(o.name) }</Text>
                    </DropdownSelect.Option>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const OptionInput = ({
    optionId, value, onChange, onTransform,
}) => {
    const { type, options } = useConfigurationOption(optionId);
    const { disabled } = useDevice();

    const valueToggle = useCallback(() => onChange(!value), [onChange, value]);

    if (value === undefined) return null;

    if (type === 'string') {
        return (
            <TextFieldErasable
                value={value}
                set={onChange}
                onChange={onTransform}
                debounceTime={0}
                width="100%"
                maxWidth="16rem"
            />
        );
    }
    if (type === 'select') {
        return (
            <ConfigurationSelect
                value={value}
                options={options}
                onChange={onChange}
                disabled={disabled}
            />
        );
    }
    if (type === 'password') {
        return <OptionInputPassword value={value} onChange={onChange} disabled={disabled} />;
    }
    if (type === 'boolean') {
        return <ActiveToggleButton active={value} onClick={valueToggle} disabled={disabled} />;
    }
    return null;
};


const OptionValue = ({ optionId }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const {
        type, options, minLength, maxLength, isValid, value, set,
    } = useConfigurationOption(optionId);
    const {
        getUnsavedValue, setUnsavedValue, subscribeForSaving, setSavedValue,
    } = useUnsavedValues();

    const minLengthFinal = useValueOrFunction(minLength);
    const maxLengthFinal = useValueOrFunction(maxLength);

    const [tempValue, setTempValue] = useState(value);
    const [warning, setWarning] = useState(null);

    const parseToInt = useMemo(() => type === 'select'
        && options.every(o => typeof o.value === 'number'), [options, type]);

    const validateValue = useCallback((v) => {
        let finalValue = v;

        if (maxLengthFinal !== undefined && finalValue.length > maxLengthFinal) {
            finalValue = finalValue.slice(0, maxLengthFinal);
        }

        if (minLengthFinal !== undefined && finalValue.length < minLengthFinal) {
            setWarning(`${t('Input has to be at least')} ${minLengthFinal} ${t('characters')}`);
        } else if (finalValue.length > 0 && typeof isValid === 'function' && !isValid(finalValue)) {
            setWarning(t('Invalid value'));
        } else {
            setWarning(null);
        }

        return finalValue;
    }, [maxLengthFinal, minLengthFinal, isValid, t]);

    const onChange = useCallback((e) => {
        let finalValue = e?.target?.value !== undefined ? e.target.value : e;
        if (parseToInt) {
            finalValue = parseInt(finalValue, 10);
        }

        if (type === 'password') {
            finalValue = validateValue(finalValue);
        }

        setTempValue(finalValue);
        setUnsavedValue(optionId, finalValue);
    }, [parseToInt, type, validateValue, setUnsavedValue, optionId]);

    const onTransform = useCallback(v => validateValue(v), [validateValue]);

    useEffect(() => {
        setSavedValue(optionId, value);
        const unsaved = getUnsavedValue(optionId);
        if (unsaved !== undefined && unsaved !== value) {
            setTempValue(unsaved);
            return;
        }
        setTempValue(value);
        setUnsavedValue(optionId, undefined);
    }, [value, optionId, getUnsavedValue, setUnsavedValue, setSavedValue]);

    useEffect(() => subscribeForSaving(optionId, set), [set, subscribeForSaving, optionId]);

    return (
        <Flex direction="column" gapY="2" align="end" width="100%" minWidth="0">
            <OptionInput
                optionId={optionId}
                value={tempValue}
                onChange={onChange}
                onTransform={onTransform}
            />
            {!!warning && <Text size={textSize} color="red">{warning}</Text>}
        </Flex>
    );
};


const Option = ({ option }) => {
    const { t } = useLanguage();
    const {
        has, value, name, hideIf,
    } = useConfigurationOption(option.optionId);

    const doHide = useValueOrFunction(hideIf);

    if (!has || value === undefined || doHide) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label wrap="pretty">
                    { t(name) }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <OptionValue optionId={option.optionId} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({ categoryId }) => {
    const { options } = useConfigurationOptions();
    const categoryOptions = useMemo(() => options
        .filter(o => o.categoryId === categoryId), [options, categoryId]);

    return (
        <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
            {categoryOptions.map(o => <Option key={o.optionId} option={o} />)}
        </LabelControlTable.List>
    );
};
