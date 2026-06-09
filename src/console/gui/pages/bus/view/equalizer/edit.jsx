// Requirements
import { useCallback, useMemo, useRef } from 'react';
import { Power, PowerOff } from 'lucide-react';
import {
    Box, Dialog, Flex, IconButton, Text,
} from '@radix-ui/themes';
import {
    useBusEqualizerGraphic, useBusEqualizerGraphicReset,
    useBusEqualizerMode, useBusEqualizerParametric,
    useBusEqualizerParametricFrequency, useBusEqualizerParametricOn,
    useBusEqualizerParametricOptions, useBusEqualizerParametricReset,
    useBusEqualizerParametricType,
    useBusEqualizerTrue, useBusEqualizerTrueReset,
    useDevice,
} from '@magical-mixing/mixers-react';
import ResetIcon from '../../../../components/base/resetIcon';
import { ICON_STYLE } from '../../../../helpers/values';
import FrequencyInput from '../../../../components/base/frequencyInput';
import { DropdownSelect } from '../../../../components/base/dropdownSelect';
import DialogHeader from '../../../../components/base/dialogHeader';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { COLORS } from './parametric/constants';


// Internal
const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    columnGap: 'var(--space-2)',
    rowGap: 'var(--space-3)',
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


const ParametricFilterRow = ({
    busId, parameterId, name, autoFocus, onFrequencyEnter, frequencyInputRef,
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
                        autoFocus={autoFocus}
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
                    autoFocus={index === 0}
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


const EditContent = ({ busId }) => (
    <HasEditableFilters busId={busId}>
        <ParametricFilters busId={busId} />
    </HasEditableFilters>
);


// Exported
export { HasEditableFilters, ResetWhich };

export default ({ busId, open, onOpenChange }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { t('Edit equalizer') }
                </DialogHeader>
                <EditContent busId={busId} />
                <ResetWhich busId={busId}>
                    {({ reset }) => (
                        <Flex gap="3" mt="4" justify="end">
                            <IconButton
                                size={textSize}
                                variant="soft"
                                color="gray"
                                onClick={reset}
                                disabled={disabled}
                                aria-label={t('Reset')}
                            >
                                <ResetIcon />
                            </IconButton>
                        </Flex>
                    )}
                </ResetWhich>
            </Dialog.Content>
        </Dialog.Root>
    );
};
