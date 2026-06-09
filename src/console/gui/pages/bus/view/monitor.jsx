// Requirements
import {
    useBusMonitor,
    useBusMonitorMono,
    useBusMonitorChannelLineEffectTap,
    useBusMonitorSecondaryTap,
    useDevice,
    useBusMonitorSource,
    useBusMonitorSourceId,
    useBusMonitorSourceTrim,
    useBusMonitorDim,
    useBusMonitorDimOn,
    useBusMonitorDimAttenuation,
    useBusMonitorDimAtPreLevel,
} from '@magical-mixing/mixers-react';
import {
    Dialog, Flex, Text,
} from '@radix-ui/themes';
import { scaleLinear } from 'd3';
import { useCallback, useMemo, useState } from 'react';
import { useLanguage } from '../../../components/language';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { MeterSlider } from '../../../components/base/meterSlider';
import { ONE } from '../../../helpers/values';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import { ActiveToggleButton } from '../../../components/base/activeToggleButton';


// Internal
const Mono = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, toggle } = useBusMonitorMono(busId);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Mono output?') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <ActiveToggleButton active={value} onClick={toggle} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const ChannelLineEffectTap = ({ busId }) => {
    const { t } = useLanguage();

    const {
        has, value, set, options, get,
    } = useBusMonitorChannelLineEffectTap(busId);

    const option = useMemo(() => get(value), [get, value]);

    if (!has || value === undefined) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Channel, line and effect buses tap to monitor') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <DropdownSelect.Root set={set}>
                        <DropdownSelect.Trigger square variant="soft" color="gray">
                            <Text size="1" wrap="nowrap">{ t(option?.name) }</Text>
                        </DropdownSelect.Trigger>
                        <DropdownSelect.Content>
                            {options.map(o => (
                                <DropdownSelect.Option
                                    key={o.id}
                                    id={o.id}
                                    selected={value === o.id}
                                >
                                    <Text size="1">{ t(o.name) }</Text>
                                </DropdownSelect.Option>
                            ))}
                        </DropdownSelect.Content>
                    </DropdownSelect.Root>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const SecondaryTap = ({ busId }) => {
    const { t } = useLanguage();
    const {
        has, value, set, options, get,
    } = useBusMonitorSecondaryTap(busId);

    const option = useMemo(() => get(value), [get, value]);

    if (!has || value === undefined) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Secondary buses tap to monitor') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <DropdownSelect.Root set={set}>
                        <DropdownSelect.Trigger square variant="soft" color="gray">
                            <Text size="1" wrap="nowrap">{ t(option?.name) }</Text>
                        </DropdownSelect.Trigger>
                        <DropdownSelect.Content>
                            {options.map(o => (
                                <DropdownSelect.Option
                                    key={o.id}
                                    id={o.id}
                                    selected={value === o.id}
                                >
                                    <Text size="1">{ t(o.name) }</Text>
                                </DropdownSelect.Option>
                            ))}
                        </DropdownSelect.Content>
                    </DropdownSelect.Root>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const SourceId = ({ busId }) => {
    const { t } = useLanguage();
    const {
        has, value, set, options, get,
    } = useBusMonitorSourceId(busId);

    const option = useMemo(() => get(value), [get, value]);

    if (!has || value === undefined) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Source') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <DropdownSelect.Root set={set}>
                        <DropdownSelect.Trigger square variant="soft" color="gray">
                            <Text size="1" wrap="nowrap">{ t(option?.name) }</Text>
                        </DropdownSelect.Trigger>
                        <DropdownSelect.Content>
                            {options.map(o => (
                                <DropdownSelect.Option
                                    key={o.id}
                                    id={o.id}
                                    selected={value === o.id}
                                >
                                    <Text size="1">{ t(o.name) }</Text>
                                </DropdownSelect.Option>
                            ))}
                        </DropdownSelect.Content>
                    </DropdownSelect.Root>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const SourceTrim = ({ busId }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const {
        has, value, set, minimum, maximum,
    } = useBusMonitorSourceTrim(busId);

    const valueToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => valueToDecimal.invert, [valueToDecimal]);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Source trim') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" flexGrow="1" minWidth="0" width="100%">
                    <MeterSlider
                        value={value}
                        set={set}
                        minimum={minimum}
                        maximum={maximum}
                        valueToDecimal={valueToDecimal}
                        decimalToValue={decimalToValue}
                        onDisplayedValueClicked={doOpen}
                        ariaLabel={t('Source trim')}
                        disabled={disabled}
                        valueShowAlways
                    />
                    <Dialog.Root open={opened} onOpenChange={setOpened}>
                        <Dialog.Content aria-describedby={undefined}>
                            <DialogHeader>
                                { t('Source trim') }
                            </DialogHeader>
                            <DecimalInput
                                value={value}
                                set={set}
                                onEnter={doClose}
                                allowNegativeValue
                                minimum={minimum}
                                maximum={maximum}
                            />
                        </Dialog.Content>
                    </Dialog.Root>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const Source = ({ busId }) => {
    const { has } = useBusMonitorSource(busId);
    if (!has) return null;
    return (
        <>
            <SourceId busId={busId} />
            <SourceTrim busId={busId} />
        </>
    );
};


const DimOn = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, toggle } = useBusMonitorDimOn(busId);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Dim') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <ActiveToggleButton active={value} onClick={toggle} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const DimAttenuation = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const {
        has, value, set, minimum, maximum,
    } = useBusMonitorDimAttenuation(busId);

    const valueToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => valueToDecimal.invert, [valueToDecimal]);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Dim attenuation') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" flexGrow="1" minWidth="0" width="100%">
                    <MeterSlider
                        value={value}
                        set={set}
                        minimum={minimum}
                        maximum={maximum}
                        valueToDecimal={valueToDecimal}
                        decimalToValue={decimalToValue}
                        onDisplayedValueClicked={doOpen}
                        ariaLabel={t('Dim attenuation')}
                        disabled={disabled}
                        valueShowAlways
                    />
                    <Dialog.Root open={opened} onOpenChange={setOpened}>
                        <Dialog.Content aria-describedby={undefined}>
                            <DialogHeader>
                                { t('Dim attenuation') }
                            </DialogHeader>
                            <DecimalInput
                                value={value}
                                set={set}
                                onEnter={doClose}
                                allowNegativeValue
                                minimum={minimum}
                                maximum={maximum}
                            />
                        </Dialog.Content>
                    </Dialog.Root>
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const DimAtPreLevel = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, toggle } = useBusMonitorDimAtPreLevel(busId);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Dim at pre level') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <ActiveToggleButton active={value} onClick={toggle} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const Dim = ({ busId }) => {
    const { has } = useBusMonitorDim(busId);
    const { has: hasOn, value: valueOn } = useBusMonitorDimOn(busId);

    if (!has) return null;

    return (
        <>
            <DimOn busId={busId} />
            {((hasOn && valueOn) || !hasOn) && (
                <>
                    <DimAttenuation busId={busId} />
                    <DimAtPreLevel busId={busId} />
                </>
            )}
        </>
    );
};


const Monitor = ({ busId }) => (
    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
        <Mono busId={busId} />
        <ChannelLineEffectTap busId={busId} />
        <SecondaryTap busId={busId} />
        <Dim busId={busId} />
        <Source busId={busId} />
    </LabelControlTable.List>
);


// Exported
export default ({ busId }) => {
    const { has } = useBusMonitor(busId);
    if (!has) return null;
    return <Monitor busId={busId} />;
};
