// Requirements
import {
    createContext,
    useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { scaleLinear, scaleLog } from 'd3';
import {
    useDevice, useFxParameters, useFxParametersParameter, useFxType,
} from '@magical-mixing/mixers-react';
import {
    Button, Dialog, Flex, Text,
} from '@radix-ui/themes';
import { ActiveToggleButton } from '../../../components/base/activeToggleButton';
import { useLanguage } from '../../../components/language';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';
import { Label, LabelControlTable, LABEL_WIDTH } from '../../../components/base/labelControlTable';
import { MeterSlider } from '../../../components/base/meterSlider';
import { ONE } from '../../../helpers/values';
import { Knob } from '../../../components/base/knob';
import { DropdownSelect } from '../../../components/base/dropdownSelect';


// Constants
const TAP_ACTIVE_TIMEOUT = 200;


// Variables
const Context = createContext({});


// Internal
const ParametersContext = ({ children }) => {
    const [abLinked, setABLinked] = useState(false);

    const state = useMemo(() => ({ abLinked, setABLinked }), [abLinked, setABLinked]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};


const useParameters = () => {
    const { abLinked, setABLinked } = useContext(Context);
    return { abLinked, setABLinked };
};


const TapTempo = ({
    parameter, value, set, controlSize = '2',
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();

    const tapInterval = useRef(null);
    const [lastTap, setLastTap] = useState(null);
    const [tapButtonState, setTapButtonState] = useState('idle');

    const activateButton = useCallback(() => {
        setTapButtonState('active');
        setTimeout(() => {
            setTapButtonState('idle');
        }, TAP_ACTIVE_TIMEOUT);
    }, []);

    useEffect(() => {
        if (value && value >= parameter.minimum && value <= parameter.maximum) {
            activateButton();
            if (tapInterval.current) clearInterval(tapInterval.current);

            let interval = null;
            if (parameter.unit === 'ms') {
                interval = value;
            } else if (parameter.unit === 'Hz') {
                interval = 1000 / value;
            }

            if (interval) {
                tapInterval.current = setInterval(() => {
                    activateButton();
                }, interval);
            }
        }

        return () => {
            if (!tapInterval.current) return;
            clearInterval(tapInterval.current);
            tapInterval.current = null;
        };
    }, [value, parameter.minimum, parameter.maximum, activateButton, parameter.unit]);

    const onTapClicked = useCallback(() => {
        activateButton();
        if (!lastTap) {
            setLastTap(Date.now());
            return;
        }
        const now = Date.now();
        setLastTap(now);
        let diff = 0;
        if (parameter.unit === 'ms') {
            diff = now - lastTap;
        } else if (parameter.unit === 'Hz') {
            diff = 1000 / (now - lastTap);
        }
        if (diff >= parameter.minimum && diff <= parameter.maximum) {
            set(diff);
        }
    }, [activateButton, lastTap, parameter.minimum, parameter.maximum, parameter.unit, set]);

    return (
        <Button size={controlSize} variant="soft" color={tapButtonState === 'active' ? 'blue' : 'gray'} onClick={onTapClicked} disabled={disabled}>
            { t('Tap tempo') }
        </Button>
    );
};


const ParameterLinear = ({ parameter, value, set }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { minimum, maximum } = parameter;

    const valueToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => valueToDecimal.invert, [valueToDecimal]);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const ariaLabel = useMemo(() => t(parameter.name), [t, parameter.name]);

    return (
        <>
            {parameter.component === 'knob' && (
                <Knob
                    value={value}
                    set={set}
                    valueToDecimal={valueToDecimal}
                    decimalToValue={decimalToValue}
                    minimum={minimum}
                    maximum={maximum}
                    onRightClick={doOpen}
                    ariaLabel={ariaLabel}
                    disabled={disabled}
                    decimalsToShow={parameter.precision}
                />
            )}
            {parameter.component !== 'knob' && (
                <MeterSlider
                    value={value}
                    set={set}
                    minimum={minimum}
                    maximum={maximum}
                    valueToDecimal={valueToDecimal}
                    decimalToValue={decimalToValue}
                    onDisplayedValueClicked={doOpen}
                    ariaLabel={ariaLabel}
                    disabled={disabled}
                    valueShowAlways
                    decimalsToShow={parameter.precision}
                />
            )}
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        { t(parameter.name) }
                    </DialogHeader>
                    <DecimalInput
                        value={value}
                        set={set}
                        onEnter={doClose}
                        allowNegativeValue
                        minimum={minimum}
                        maximum={maximum}
                        decimalsLimit={parameter.precision}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </>
    );
};


const ParameterLog = ({ parameter, value, set }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { minimum, maximum } = parameter;

    const valueToDecimal = useMemo(() => scaleLog()
        .domain([minimum, maximum])
        .range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => valueToDecimal.invert, [valueToDecimal]);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const ariaLabel = useMemo(() => t(parameter.name), [t, parameter.name]);

    return (
        <>
            {parameter.component === 'knob' && (
                <Knob
                    value={value}
                    set={set}
                    valueToDecimal={valueToDecimal}
                    decimalToValue={decimalToValue}
                    minimum={minimum}
                    maximum={maximum}
                    onRightClick={doOpen}
                    ariaLabel={ariaLabel}
                    disabled={disabled}
                    decimalsToShow={parameter.precision}
                />
            )}
            {parameter.component !== 'knob' && (
                <MeterSlider
                    value={value}
                    set={set}
                    minimum={minimum}
                    maximum={maximum}
                    valueToDecimal={valueToDecimal}
                    decimalToValue={decimalToValue}
                    onDisplayedValueClicked={doOpen}
                    ariaLabel={ariaLabel}
                    disabled={disabled}
                    valueShowAlways
                    decimalsToShow={parameter.precision}
                />
            )}
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        { t(parameter.name) }
                    </DialogHeader>
                    <DecimalInput
                        value={value}
                        set={set}
                        onEnter={doClose}
                        allowNegativeValue
                        minimum={minimum}
                        maximum={maximum}
                        decimalsLimit={parameter.precision}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </>
    );
};


const ParameterDouble = ({
    parameter, value, set, controlSize = '2',
}) => {
    const { abLinked } = useParameters();
    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { abLinked ? parameter.name.replace('A | ', '') : parameter.name }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                {value !== undefined && (
                    <Flex align="center" justify="end" gapX="2" width="100%" minWidth="0">
                        {parameter.style === 'tap' && (
                            <Flex flexShrink="0">
                                <TapTempo
                                    parameter={parameter}
                                    value={value}
                                    set={set}
                                    controlSize={controlSize}
                                />
                            </Flex>
                        )}
                        <Flex
                            flexGrow="1"
                            minWidth="0"
                            width="100%"
                            align="center"
                            justify={parameter.component === 'knob' ? 'end' : undefined}
                        >
                            {parameter.scale === 'linear' && (
                                <ParameterLinear parameter={parameter} value={value} set={set} />
                            )}
                            {parameter.scale === 'log' && (
                                <ParameterLog parameter={parameter} value={value} set={set} />
                            )}
                        </Flex>
                    </Flex>
                )}
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const ParameterBoolean = ({
    parameter, value, set, controlSize = '2',
}) => {
    const { abLinked } = useParameters();
    const { disabled } = useDevice();
    const toggle = useCallback(() => set(!value), [value, set]);
    const checked = useMemo(() => {
        if (parameter.style === 'offOn') return !value;
        return value;
    }, [parameter.style, value]);

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { abLinked ? parameter.name.replace('A | ', '') : parameter.name }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                {value !== undefined && (
                    <Flex align="center" justify="end" gapX="1" width="100%" minWidth="0">
                        {(parameter.style === 'onOff'
                            || parameter.style === 'offOn'
                            || parameter.style === 'toggle') && (
                            <ActiveToggleButton
                                active={checked}
                                onClick={toggle}
                                disabled={disabled}
                                size={controlSize}
                            />
                        )}
                    </Flex>
                )}
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const ParameterSelect = ({
    parameter, value, set, controlSize = '2',
}) => {
    const { t } = useLanguage();
    const { abLinked } = useParameters();

    const option = useMemo(() => parameter.options
        .find(o => o.id === value), [parameter.options, value]);

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { abLinked ? parameter.name.replace('A | ', '') : parameter.name }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                {value !== undefined && (
                    <Flex align="center" justify="end" gapX="1" width="100%" minWidth="0">
                        <DropdownSelect.Root set={set}>
                            <DropdownSelect.Trigger square size={controlSize} variant="soft" color="gray">
                                <Text size={controlSize} wrap="nowrap">{ option ? option.name : t('Unassigned') }</Text>
                            </DropdownSelect.Trigger>
                            <DropdownSelect.Content>
                                {parameter.options.map(o => (
                                    <DropdownSelect.Option
                                        key={o.id}
                                        id={o.id}
                                        selected={value === o.id}
                                    >
                                        <Text size={controlSize}>{ o.name }</Text>
                                    </DropdownSelect.Option>
                                ))}
                            </DropdownSelect.Content>
                        </DropdownSelect.Root>
                    </Flex>
                )}
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const ParameterWithOpposite = ({
    fxId, typeId, parameter, value, set, opposite, controlSize = '2',
}) => {
    const {
        has: oppositeHas,
        set: oppositeSet,
    } = useFxParametersParameter(fxId, typeId, opposite.id);

    const setFinal = useCallback((v) => {
        set(v);
        if (oppositeHas) oppositeSet(v);
    }, [set, oppositeHas, oppositeSet]);

    if (parameter.type === 'double') return <ParameterDouble parameter={parameter} value={value} set={setFinal} controlSize={controlSize} />;
    if (parameter.type === 'boolean') return <ParameterBoolean parameter={parameter} value={value} set={setFinal} controlSize={controlSize} />;
    if (parameter.type === 'select') return <ParameterSelect parameter={parameter} value={value} set={setFinal} controlSize={controlSize} />;

    return null;
};


const Parameter = ({
    fxId, typeId, parameter, opposite, controlSize = '2',
}) => {
    const { has, value, set } = useFxParametersParameter(fxId, typeId, parameter.id);

    if (!has) return null;

    if (opposite) {
        if (opposite.name.startsWith('A | ')) return null;
        return (
            <ParameterWithOpposite
                fxId={fxId}
                typeId={typeId}
                parameter={parameter}
                value={value}
                set={set}
                opposite={opposite}
                controlSize={controlSize}
            />
        );
    }

    if (parameter.type === 'double') return <ParameterDouble parameter={parameter} value={value} set={set} controlSize={controlSize} />;
    if (parameter.type === 'boolean') return <ParameterBoolean parameter={parameter} value={value} set={set} controlSize={controlSize} />;
    if (parameter.type === 'select') return <ParameterSelect parameter={parameter} value={value} set={set} controlSize={controlSize} />;

    return null;
};


const LinkAB = ({ options, controlSize = '2' }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { abLinked, setABLinked } = useParameters();

    const hasAB = useMemo(() => options.some(o => o.name.startsWith('A | ')), [options]);

    if (!hasAB) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Link A & B') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" gapX="1" width="100%" minWidth="0">
                    <ActiveToggleButton
                        active={abLinked}
                        onClick={() => setABLinked(!abLinked)}
                        disabled={disabled}
                        size={controlSize}
                    />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const Parameters = ({
    fxId, typeId, options, controlSize = '2',
}) => {
    const { abLinked } = useParameters();

    const getOpposite = useCallback((p) => {
        const b = options.find((o) => {
            if (p.id === o.id) return false;
            if (p.name.startsWith('A | ')) return p.name.replace('A | ', 'B | ') === o.name;
            if (p.name.startsWith('B | ')) return p.name.replace('B | ', 'A | ') === o.name;
            return false;
        });
        return b || null;
    }, [options]);

    return (
        <>
            <LinkAB options={options} controlSize={controlSize} />
            {options.map(p => (
                <Parameter
                    key={p.id}
                    fxId={fxId}
                    typeId={typeId}
                    parameter={p}
                    opposite={abLinked ? getOpposite(p) : null}
                    controlSize={controlSize}
                />
            ))}
        </>
    );
};


const ParametersOfType = ({ fxId, typeId, controlSize = '2' }) => {
    const { has, options } = useFxParameters(fxId, typeId);

    if (!has) return null;

    return (
        <ParametersContext>
            <Parameters fxId={fxId} typeId={typeId} options={options} controlSize={controlSize} />
        </ParametersContext>
    );
};


// Exported
export default ({ fxId, controlSize = '2' }) => {
    const { has, value } = useFxType(fxId);

    if (!has) return null;

    return <ParametersOfType fxId={fxId} typeId={value} controlSize={controlSize} />;
};

