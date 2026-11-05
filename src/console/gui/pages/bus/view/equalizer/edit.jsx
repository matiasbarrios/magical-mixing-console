// Requirements
import { useCallback, useMemo, useRef, useState } from 'react';
import { Power, PowerOff } from 'lucide-react';
import {
    Box, Dialog, Flex, IconButton, Text,
} from '@radix-ui/themes';
import {
    useBusEqualizerGraphic, useBusEqualizerGraphicReset,
    useBusEqualizerMode, useBusEqualizerParametric,
    useBusEqualizerParametricFrequency, useBusEqualizerParametricGain,
    useBusEqualizerParametricOn, useBusEqualizerParametricQ,
    useBusEqualizerParametricOptions, useBusEqualizerParametricReset,
    useBusEqualizerParametricType,
    useBusEqualizerTrue, useBusEqualizerTrueReset,
    useDevice,
} from '@magical-mixing/mixers-react';
import { scaleLinear } from 'd3';
import { ICON_STYLE, ONE } from '../../../../helpers/values';
import FrequencyInput from '../../../../components/base/frequencyInput';
import { DropdownSelect } from '../../../../components/base/dropdownSelect';
import DialogHeader from '../../../../components/base/dialogHeader';
import DecimalInput from '../../../../components/base/decimalInput';
import { Knob } from '../../../../components/base/knob';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { COLORS } from './parametric/constants';
import { gainAlwaysZero } from './parametric/biquad';
import { useEqualizer } from './context';


// Internal
const GAIN_RESET = 0;

const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
    columnGap: 'var(--space-2)',
    rowGap: 'var(--space-2)',
    alignItems: 'center',
    width: '100%',
};

const filterLabelCellStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
};

const filterFrequencyCellStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    minWidth: 0,
};

const filterKnobsCellStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 'var(--space-1)',
    minWidth: 'var(--mmc-knob-size)',
};

const filterControlsCellStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--space-1)',
};

const filterOnSlotStyle = {
    width: 24,
    flexShrink: 0,
};

const filterInactiveOpacity = 0.5;

const editPanelStyle = {
    overflowX: 'hidden',
    overflowY: 'auto',
};


const FilterGain = ({ busId, parameterId, name }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { dbRange } = useEqualizer();
    const {
        has, value, set,
    } = useBusEqualizerParametricGain(busId, parameterId);

    const minimum = -dbRange;
    const maximum = dbRange;

    const gainScale = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => gainScale.invert, [gainScale]);
    const valueToDecimal = useCallback((v) => {
        const clamped = Math.max(minimum, Math.min(maximum, v));
        return gainScale(clamped);
    }, [gainScale, minimum, maximum]);

    const [opened, setOpened] = useState(false);
    const open = useCallback(() => setOpened(true), []);
    const close = useCallback(() => setOpened(false), []);

    if (!has || value === undefined || value === null || Number.isNaN(value)) return null;

    return (
        <>
            <Knob
                value={value}
                set={set}
                valueToDecimal={valueToDecimal}
                decimalToValue={decimalToValue}
                minimum={minimum}
                maximum={maximum}
                onRightClick={open}
                ariaLabel={`${t('Gain')}, ${t(name)}`}
                disabled={disabled}
                decimalsToShow={1}
                asButton
                resetValue={GAIN_RESET}
                onFocusScale={1.5}
            />
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        { `${t(name)} · ${t('Gain')}` }
                    </DialogHeader>
                    <DecimalInput
                        value={value}
                        decimalsLimit={1}
                        set={set}
                        onEnter={close}
                        allowNegativeValue
                        minimum={minimum}
                        maximum={maximum}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </>
    );
};


const FilterQ = ({ busId, parameterId, name }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const {
        has, value, set, minimum, maximum,
    } = useBusEqualizerParametricQ(busId, parameterId);

    const valueToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => valueToDecimal.invert, [valueToDecimal]);

    const [opened, setOpened] = useState(false);
    const open = useCallback(() => setOpened(true), []);
    const close = useCallback(() => setOpened(false), []);

    if (!has || value === undefined || value === null || Number.isNaN(value)) return null;

    return (
        <>
            <Knob
                value={value}
                set={set}
                valueToDecimal={valueToDecimal}
                decimalToValue={decimalToValue}
                minimum={minimum}
                maximum={maximum}
                onRightClick={open}
                ariaLabel={`Q, ${t(name)}`}
                disabled={disabled}
                decimalsToShow={2}
                asButton
                resetValue={minimum}
                onFocusScale={1.5}
            />
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        { `${t(name)} · Q` }
                    </DialogHeader>
                    <DecimalInput
                        value={value}
                        decimalsLimit={2}
                        set={set}
                        onEnter={close}
                        minimum={minimum}
                        maximum={maximum}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </>
    );
};


const ParametricFilterRow = ({
    busId, parameterId, name, onFrequencyEnter, frequencyInputRef,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const typeTriggerRef = useRef(null);
    const color = COLORS.parameters[parameterId];

    const {
        has: frequencyHas, value: frequency, set: frequencySet, minimum, maximum,
    } = useBusEqualizerParametricFrequency(busId, parameterId);
    const {
        has: onHas, value: on, toggle: onToggle,
    } = useBusEqualizerParametricOn(busId, parameterId);
    const {
        value: type, set: typeSet, options: typeOptions,
    } = useBusEqualizerParametricType(busId, parameterId);

    const typeOption = useMemo(() => typeOptions.find(o => o.id === type),
        [type, typeOptions]);

    const showGain = !!typeOption?.preset && !gainAlwaysZero(typeOption.preset);
    const showQ = ['Parametric', 'Vintage'].includes(typeOption?.name);

    const handleFrequencyEnter = useCallback(() => {
        if (typeOptions.length > 1) {
            typeTriggerRef.current?.focus();
            return;
        }
        onFrequencyEnter?.();
    }, [typeOptions.length, onFrequencyEnter]);

    const inactive = onHas && !on;

    const inactiveStyle = useMemo(() => ({
        ...(inactive && { opacity: filterInactiveOpacity }),
        transition: 'opacity 0.15s ease',
    }), [inactive]);

    return (
        <>
            <Flex style={{ ...filterLabelCellStyle, ...inactiveStyle }}>
                <Box
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: color,
                        flexShrink: 0,
                    }}
                />
                <Text size={textSize} weight="medium" wrap="nowrap">
                    { t(name) }
                </Text>
            </Flex>
            <Flex style={{ ...filterFrequencyCellStyle, ...inactiveStyle }}>
                {frequencyHas && frequency !== undefined ? (
                    <FrequencyInput
                        inputRef={frequencyInputRef}
                        value={frequency}
                        set={frequencySet}
                        minimum={minimum}
                        maximum={maximum}
                        onEnter={handleFrequencyEnter}
                        size={textSize}
                        width="100%"
                        minWidth="0"
                    />
                ) : (
                    <Box flexGrow="1" />
                )}
                <Text size={textSize} color="gray" wrap="nowrap">Hz</Text>
            </Flex>
            <Flex style={{ ...filterKnobsCellStyle, ...inactiveStyle }}>
                {showGain && (
                    <FilterGain busId={busId} parameterId={parameterId} name={name} />
                )}
                {showQ && (
                    <FilterQ busId={busId} parameterId={parameterId} name={name} />
                )}
            </Flex>
            <Flex style={filterControlsCellStyle}>
                {type !== undefined && typeOptions.length > 1 ? (
                    <DropdownSelect.Root set={typeSet}>
                        <DropdownSelect.Trigger
                            ref={typeTriggerRef}
                            square
                            size={textSize}
                            variant="soft"
                            color="gray"
                        >
                            <Text size={textSize} wrap="nowrap">{ t(typeOption?.name || '') }</Text>
                        </DropdownSelect.Trigger>
                        <DropdownSelect.Content>
                            {typeOptions.map(o => (
                                <DropdownSelect.Option
                                    key={o.id}
                                    id={o.id}
                                    selected={type === o.id}
                                >
                                    <Text size="2">{ t(o.name) }</Text>
                                </DropdownSelect.Option>
                            ))}
                        </DropdownSelect.Content>
                    </DropdownSelect.Root>
                ) : null}
                {onHas && (
                    <IconButton
                        size={textSize}
                        variant="soft"
                        radius="full"
                        color="gray"
                        onClick={onToggle}
                        disabled={disabled}
                        aria-label={on ? t('On') : t('Off')}
                        style={filterOnSlotStyle}
                    >
                        {!!on && <Power style={ICON_STYLE} />}
                        {!on && <PowerOff style={ICON_STYLE} />}
                    </IconButton>
                )}
            </Flex>
        </>
    );
};


const ParametricFilters = ({ busId }) => {
    const { options } = useBusEqualizerParametricOptions(busId);
    const focusRefs = useRef([]);

    const focusNextRow = useCallback((index) => {
        const next = focusRefs.current[index + 1];
        if (!next) return;
        next.focus();
        next.select?.();
    }, []);

    return (
        <Box style={filtersGridStyle}>
            {options.map((o, index) => (
                <ParametricFilterRow
                    key={o.id}
                    busId={busId}
                    parameterId={o.id}
                    name={o.name}
                    onFrequencyEnter={() => focusNextRow(index)}
                    frequencyInputRef={(el) => { focusRefs.current[index] = el; }}
                />
            ))}
        </Box>
    );
};


const ParametricReset = ({ busId, children }) => {
    const { has } = useBusEqualizerParametric(busId);
    const { reset } = useBusEqualizerParametricReset(busId);
    if (!has) return null;
    return children({ reset });
};


const GraphicReset = ({ busId, children }) => {
    const { has } = useBusEqualizerGraphic(busId);
    const { reset } = useBusEqualizerGraphicReset(busId);
    if (!has) return null;
    return children({ reset });
};


const TrueReset = ({ busId, children }) => {
    const { has } = useBusEqualizerTrue(busId);
    const { reset } = useBusEqualizerTrueReset(busId);
    if (!has) return null;
    return children({ reset });
};


const ResetWhich = ({ busId, children }) => {
    const { has, is } = useBusEqualizerMode(busId);
    if (!has || is('Parametric')) {
        return <ParametricReset busId={busId}>{ children }</ParametricReset>;
    }
    if (!has || is('Graphic')) {
        return <GraphicReset busId={busId}>{ children }</GraphicReset>;
    }
    if (!has || is('True')) {
        return <TrueReset busId={busId}>{ children }</TrueReset>;
    }
    return null;
};


const HasEditableFilters = ({ busId, children }) => {
    const { has: modeHas, is: modeIs } = useBusEqualizerMode(busId);
    const { options } = useBusEqualizerParametricOptions(busId);

    const isParametric = useMemo(() => !modeHas || modeIs('Parametric'), [modeIs, modeHas]);

    if (!isParametric || options.length === 0) return null;

    return children;
};


const EditPanel = ({ busId }) => {
    const { editOpen } = useEqualizer();
    if (!editOpen) return null;

    return (
        <HasEditableFilters busId={busId}>
            <Flex
                width="100%"
                minHeight="0"
                flexShrink="1"
                flexGrow="0"
                pb="1"
                style={editPanelStyle}
            >
                <ParametricFilters busId={busId} />
            </Flex>
        </HasEditableFilters>
    );
};


// Exported
export { HasEditableFilters, ResetWhich };

export default EditPanel;
