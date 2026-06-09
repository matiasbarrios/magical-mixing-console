// Requirements
import {
    useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { Power, PowerOff } from 'lucide-react';
import {
    Button, Dialog, Flex, IconButton, Text,
} from '@radix-ui/themes';
import {
    useBusEqualizerParametricFrequency,
    useBusEqualizerParametricOn, useBusEqualizerParametricOptions, useBusEqualizerParametricQ,
    useBusEqualizerParametricType, useBusEqualizerOn, useBusRTA,
    useDevice, useBusEqualizerParametric, useBusEqualizerParametricGain,
} from '@magical-mixing/mixers-react';
import { scaleLinear } from 'd3';
import { noDecimals } from '../../../../../helpers/format';
import { useEqualizer } from '../context';
import { ONE, ICON_STYLE } from '../../../../../helpers/values';
import { Knob } from '../../../../../components/base/knob';
import DecimalInput from '../../../../../components/base/decimalInput';
import DialogHeader from '../../../../../components/base/dialogHeader';
import { useLanguage } from '../../../../../components/language';
import { useUiSize } from '../../../../../components/theme';
import { DropdownSelect } from '../../../../../components/base/dropdownSelect';
import { isMobile } from '../../../../../platform';
import { createChart, updateChart } from './chart';
import { SPECTRUM_LENGTH } from './constants';
import {
    computeParameterModalPosition,
    MODAL_DEFAULT_HEIGHT,
    parameterModalLayoutEqual,
} from './modalPosition';
import { createParameters, updateParameter } from './parameter';
import { createResult, updateResult } from './result';
import { updateRTA } from './rta';
import { updateSpectrum } from './spectrum';


// Internal
const RtaValues = ({ busId, chart }) => {
    const { value } = useBusRTA(busId);
    const spectrum = useRef(null);
    const { spectrumActive } = useEqualizer();

    useEffect(() => {
        if (!chart.created) return;
        updateRTA(chart, value || []);
    }, [chart, value]);

    // Initialize and destroy the spectrum data
    useEffect(() => {
        spectrum.current = [];
        return () => {
            spectrum.current = null;
        };
    }, [busId]);

    // Save spectrum data
    useEffect(() => {
        if (!spectrumActive) {
            spectrum.current = [];
        }
        // If max length reached, remove last element
        if (spectrum.current.length >= SPECTRUM_LENGTH) {
            spectrum.current = spectrum.current.slice(0, SPECTRUM_LENGTH);
        }
        // Add the new value at the beginning
        if (spectrumActive && value) {
            spectrum.current.unshift(value);
        }
        updateSpectrum(chart, spectrum.current);
    }, [chart, value, spectrumActive]);

    return null;
};


const Rta = ({ busId, chart }) => {
    const { has } = useBusRTA(busId);
    const { rtaOn } = useEqualizer();

    useEffect(() => {
        if (has && !rtaOn) updateRTA(chart, []);
    }, [chart, has, rtaOn]);

    if (!has || !rtaOn) return null;

    return <RtaValues busId={busId} chart={chart} />;
};


const ParameterModal = ({
    chart, parameters, busId, parameterId, onClose, position,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const parameter = useMemo(() => parameters
        .find(f => f.parameterId === parameterId), [parameters, parameterId]);

    const {
        has: onHas, value: on, toggle: onToggle,
    } = useBusEqualizerParametricOn(busId, parameterId);
    const {
        value: type, set: typeSet, options: typeOptions,
    } = useBusEqualizerParametricType(busId, parameterId);
    const {
        value: q, set: qSet, minimum: qMinimum, maximum: qMaximum,
    } = useBusEqualizerParametricQ(busId, parameterId);

    const {
        value: frequency, set: frequencySet, maximum: frequencyMaximum,
    } = useBusEqualizerParametricFrequency(busId, parameterId);

    const qVisible = useMemo(() => {
        const typeName = typeOptions.find(y => y.id === type)?.name;
        return ['Parametric', 'Vintage'].includes(typeName);
    }, [type, typeOptions]);

    const doOnToggle = useCallback(() => {
        onToggle();
        parameter.on = !parameter.on;
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
    }, [chart, parameter, parameters, onToggle]);

    const parameterTypeChanged = useCallback((id) => {
        const idInt = parseInt(id, 10);
        const v = typeOptions.find(y => y.id === idInt);
        parameter.type = v.preset;
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
        typeSet(v.id);
    }, [chart, parameters, parameter, typeSet, typeOptions]);

    const parameterQChanged = useCallback((v) => {
        parameter.q = v;
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
        qSet(v);
    }, [chart, parameters, parameter, qSet]);

    const rootRef = useRef(null);
    const frequencyDialogRef = useRef(null);
    const qDialogRef = useRef(null);
    const typeSelectRef = useRef(null);
    const [measuredLayout, setMeasuredLayout] = useState(null);

    useLayoutEffect(() => {
        if (!position || !chart?.created || !rootRef.current) {
            setMeasuredLayout(prev => (prev === null ? prev : null));
            return;
        }
        const el = rootRef.current;
        const next = computeParameterModalPosition({
            chart,
            position,
            modalWidth: el.offsetWidth,
            modalHeight: isMobile ? MODAL_DEFAULT_HEIGHT : el.offsetHeight,
            qVisible,
            fixedVertical: isMobile,
        });
        setMeasuredLayout(prev => (parameterModalLayoutEqual(prev, next) ? prev : next));
    }, [position, chart, qVisible, parameterId, type, onHas]);

    const rootStyle = useMemo(() => {
        if (!position || !chart?.created) return null;

        const {
            left, right, top,
        } = measuredLayout || computeParameterModalPosition({
            chart,
            position,
            qVisible,
            fixedVertical: isMobile,
            modalHeight: isMobile ? MODAL_DEFAULT_HEIGHT : undefined,
        });

        return {
            position: 'absolute',
            backgroundColor: 'var(--color-panel-solid)',
            opacity: 0.9,
            border: '1px solid var(--gray-a5)',
            borderRadius: '8px',
            ...(!right && left !== undefined && { left: `${left}px` }),
            top: `${top}px`,
            ...(right !== undefined && { right: `${right}px` }),
            ...(isMobile && { minHeight: `${MODAL_DEFAULT_HEIGHT}px` }),
            visibility: disabled ? 'hidden' : 'visible',
        };
    }, [disabled, position, chart, qVisible, measuredLayout]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (typeSelectRef.current?.contains(event.target)) return;
            if (rootRef.current?.contains(event.target)) return;
            if (qDialogRef.current?.contains(event.target)) return;
            if (frequencyDialogRef.current?.contains(event.target)) return;
            if (event.target.id.startsWith('eqParameterPoint')) return;
            onClose();
        };
        document.addEventListener('pointerdown', handleClickOutside);
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [onClose]);

    const typeOption = useMemo(() => typeOptions.find(y => y.id === type), [type, typeOptions]);

    const qValueToDecimal = useMemo(() => scaleLinear()
        .domain([qMinimum, qMaximum]).range([0, ONE]), [qMinimum, qMaximum]);
    const qDecimalToValue = useMemo(() => qValueToDecimal.invert, [qValueToDecimal]);

    const [frequencyOpened, setFrequencyOpened] = useState(false);
    const frequencyEditOpen = useCallback(() => setFrequencyOpened(true), [setFrequencyOpened]);
    const frequencyEditClose = useCallback(() => setFrequencyOpened(false), [setFrequencyOpened]);

    const [qOpened, setQOpened] = useState(false);
    const qEditOpen = useCallback(() => setQOpened(true), [setQOpened]);
    const qEditClose = useCallback(() => setQOpened(false), [setQOpened]);

    if (!position) return null;

    return (
        <Flex ref={rootRef} flexGrow="1" gapX="2" align="center" style={rootStyle} p="2">
            {frequency !== undefined && (
                <Button size={textSize} variant="soft" radius="small" color="gray" onClick={frequencyEditOpen}>
                    <Text size="1" weight="regular">{ `${noDecimals(frequency)} Hz` }</Text>
                </Button>
            )}
            {onHas && (
                <IconButton size={textSize} variant="ghost" radius="full" color="gray" onClick={doOnToggle} disabled={disabled}>
                    {!!on && <Power style={ICON_STYLE} />}
                    {!on && <PowerOff style={ICON_STYLE} />}
                </IconButton>
            )}
            {qVisible && (
                <Flex>
                    <Knob
                        value={q}
                        set={parameterQChanged}
                        valueToDecimal={qValueToDecimal}
                        decimalToValue={qDecimalToValue}
                        minimum={qMinimum}
                        maximum={qMaximum}
                        onRightClick={qEditOpen}
                        ariaLabel={`Q, ${noDecimals(frequency)} Hz`}
                        disabled={disabled}
                        decimalsToShow={2}
                        asButton
                        resetValue={qMinimum}
                        onFocusScale={1.5}
                    />
                </Flex>
            )}
            {typeOptions.length === 1 && (
                <Text size="1">{ typeOptions[0].name }</Text>
            )}
            {type !== undefined && typeOptions.length > 1 && (
                <DropdownSelect.Root set={parameterTypeChanged}>
                    <DropdownSelect.Trigger square variant="soft">
                        { t(typeOption?.name) }
                    </DropdownSelect.Trigger>
                    <DropdownSelect.Content ref={typeSelectRef}>
                        {typeOptions.map(y => (
                            <DropdownSelect.Option
                                key={y.id}
                                id={y.id}
                                selected={type === y.id}
                            >
                                <Text size="2">{ t(y.name) }</Text>
                            </DropdownSelect.Option>
                        ))}
                    </DropdownSelect.Content>
                </DropdownSelect.Root>
            )}
            <Dialog.Root open={qOpened} onOpenChange={setQOpened}>
                <Dialog.Content aria-describedby={undefined} ref={qDialogRef}>
                    <DialogHeader>
                        Q
                    </DialogHeader>
                    <DecimalInput
                        value={q}
                        decimalsLimit={2}
                        set={parameterQChanged}
                        onEnter={qEditClose}
                        maximum={qMaximum}
                    />
                </Dialog.Content>
            </Dialog.Root>
            <Dialog.Root open={frequencyOpened} onOpenChange={setFrequencyOpened}>
                <Dialog.Content
                    aria-describedby={undefined}
                    ref={frequencyDialogRef}
                >
                    <DialogHeader>
                        { t('Frequency') }
                    </DialogHeader>
                    <DecimalInput
                        value={frequency}
                        decimalsLimit={0}
                        set={frequencySet}
                        onEnter={frequencyEditClose}
                        maximum={frequencyMaximum}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </Flex>
    );
};


const ParameterOnDrag = ({ parameter, busId }) => {
    const { parameterId } = parameter;

    const { set: frequencySet } = useBusEqualizerParametricFrequency(busId, parameterId);
    const { set: gainSet } = useBusEqualizerParametricGain(busId, parameterId);

    useEffect(() => {
        parameter.frequencySet = frequencySet;
        parameter.gainSet = gainSet;
    }, [parameter, frequencySet, gainSet]);

    return null;
};


const ParameterGain = ({
    chart, parameters, parameter, busId,
}) => {
    const { parameterId } = parameter;

    const { has, value } = useBusEqualizerParametricGain(busId, parameterId);

    useEffect(() => {
        if (!has) return;
        parameter.gain = value;
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
    }, [chart, parameters, parameter, parameterId, value, has]);

    return null;
};


const ParameterQ = ({
    chart, parameters, parameter, busId,
}) => {
    const { parameterId } = parameter;

    const { has, value } = useBusEqualizerParametricQ(busId, parameterId);

    useEffect(() => {
        if (!has) return;
        parameter.q = value;
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
    }, [chart, parameters, parameter, parameterId, value, has]);

    return null;
};


const ParameterFrequency = ({
    chart, parameters, parameter, busId,
}) => {
    const { parameterId } = parameter;

    const {
        has, value, minimum, maximum,
    } = useBusEqualizerParametricFrequency(busId, parameterId);

    useEffect(() => {
        if (!has) return;
        parameter.frequency = value;
        parameter.frequencyMinimum = minimum;
        parameter.frequencyMaximum = maximum;
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
    }, [chart, parameters, parameter, parameterId, value, has, minimum, maximum]);

    return null;
};


const ParameterType = ({
    chart, parameters, parameter, busId,
}) => {
    const { parameterId } = parameter;

    const { has, value, options } = useBusEqualizerParametricType(busId, parameterId);

    useEffect(() => {
        if (!has) return;
        parameter.type = options?.find(t => t.id === value)?.preset || null;
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
    }, [chart, parameters, parameter, parameterId, value, has, options]);

    return null;
};


const ParameterOn = ({
    chart, parameters, parameter, busId,
}) => {
    const { parameterId } = parameter;

    const { has, value } = useBusEqualizerParametricOn(busId, parameterId);

    useEffect(() => {
        parameter.on = has ? value : true; // If not has, it means it is always on
        updateParameter(chart, parameter);
        updateResult(chart, parameters);
    }, [chart, parameters, parameter, parameterId, value, has]);

    return null;
};


const Parameter = ({
    chart, parameters, busId, parameter,
}) => (
    <>
        <ParameterOn chart={chart} parameters={parameters} busId={busId} parameter={parameter} />
        <ParameterType chart={chart} parameters={parameters} busId={busId} parameter={parameter} />
        <ParameterFrequency
            chart={chart}
            parameters={parameters}
            busId={busId}
            parameter={parameter}
        />
        <ParameterQ chart={chart} parameters={parameters} busId={busId} parameter={parameter} />
        <ParameterGain chart={chart} parameters={parameters} busId={busId} parameter={parameter} />
        <ParameterOnDrag busId={busId} parameter={parameter} />
    </>
);


const Chart = ({ busId, height }) => {
    const { disabled } = useDevice();
    const { has: onHas, value: on } = useBusEqualizerOn(busId);
    const { options } = useBusEqualizerParametricOptions(busId);
    const { dbRange, rtaMin } = useEqualizer();

    // Refs because we dont want rerenders on change of these
    const equalizerRef = useRef(null);
    const chartRef = useRef({});
    const parametersRef = useRef([]);

    const [chart, setChart] = useState(null);
    const [parameters, setParameters] = useState([]);
    const [parameterIdFocused, setParameterIdFocused] = useState(null);
    const [modalPosition, setModalPosition] = useState(null);
    const modalAnchorParameterIdRef = useRef(null);
    const onModalClose = useCallback(() => {
        modalAnchorParameterIdRef.current = null;
        setParameterIdFocused(null);
        setModalPosition(null);
    }, []);

    // The chart DOM that must not change on rerenders
    const createRefs = useCallback(() => {
        chartRef.current = createChart(equalizerRef.current, dbRange, rtaMin);
        setChart(chartRef.current);

        const onFrequencyGainChanged = (parameter, position) => {
            updateParameter(chartRef.current, parameter);
            updateResult(chartRef.current, parametersRef.current);

            if (parameter.frequencySet) {
                parameter.frequencySet(parameter.frequency);
            }
            if (parameter.gainSet) {
                parameter.gainSet(parameter.gain);
            }
            const parameterChanged = modalAnchorParameterIdRef.current !== parameter.parameterId;
            modalAnchorParameterIdRef.current = parameter.parameterId;
            setParameterIdFocused(parameter.parameterId);
            if (!isMobile) {
                setModalPosition(position);
            } else if (parameterChanged) {
                setModalPosition(position);
            }
        };

        parametersRef.current = createParameters(chartRef
            .current, options, onFrequencyGainChanged);
        setParameters(parametersRef.current);

        createResult(chartRef.current, parametersRef.current);
    }, [options, dbRange, rtaMin]);

    // On load
    useEffect(() => {
        createRefs();
        // Destroy the chart on leave
        return () => {
            chartRef.current = null;
            setChart(null);
            parametersRef.current = [];
            setParameters([]);
            modalAnchorParameterIdRef.current = null;
            setParameterIdFocused(null);
            setModalPosition(null);
        };
    }, [busId, createRefs]);

    // On resize
    useEffect(() => {
        window.addEventListener('resize', createRefs);
        return () => window.removeEventListener('resize', createRefs);
    }, [createRefs]);

    // On disabled
    useEffect(() => {
        if (!chart?.created) return;
        chart.disabled = disabled || (onHas && !on);
        chart.editable = !disabled;
        updateChart(chart);
    }, [chart, disabled, onHas, on]);

    const positionRelative = useMemo(() => ({ position: 'relative' }), []);

    return (
        <Flex flexGrow="1" height={height} direction="column" align="start" style={positionRelative}>
            <Flex flexGrow="1" width="100%" height="100%" ref={equalizerRef} align="stretch" justify="stretch" overflow="hidden" style={positionRelative}>
                {parameterIdFocused !== null && (
                    <ParameterModal
                        chart={chart}
                        parameters={parameters}
                        busId={busId}
                        parameterId={parameterIdFocused}
                        position={modalPosition}
                        onClose={onModalClose}
                    />
                )}
            </Flex>
            {!!chart && !!parameters && parameters.map(f => (
                <Parameter
                    key={f.parameterId}
                    chart={chart}
                    parameters={parameters}
                    busId={busId}
                    parameter={f}
                />
            ))}
            {!!chart && !!parameters && (
                <Rta busId={busId} chart={chart} />
            )}
        </Flex>
    );
};


// Exported
export default ({ busId, height }) => {
    const { has } = useBusEqualizerParametric(busId);

    if (!has) return null;

    return <Chart busId={busId} height={height} />;
};
