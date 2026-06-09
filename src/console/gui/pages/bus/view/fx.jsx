// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    useBusFx, useBusFxId, useDevice, useBusFxGain,
    useBusFxOn, useFxInsertHas, useFxInsertOn,
} from '@magical-mixing/mixers-react';
import {
    Dialog, Flex, Text,
} from '@radix-ui/themes';
import { scaleLinear } from 'd3';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';
import { useFxNameTranslated } from '../../fx/view/name';
import { useSelectOptions } from '../../../components/base/selectOptions';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../components/base/labelControlTable';
import { ONE } from '../../../helpers/values';
import { MeterSlider } from '../../../components/base/meterSlider';
import { DropdownSelect } from '../../../components/base/dropdownSelect';
import Link from '../../../components/base/link';
import { ActiveToggleButton } from '../../../components/base/activeToggleButton';
import Parameters from '../../fx/view/parameters';
import Type from '../../fx/view/type';


// Internal
const Gain = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const {
        has, value, set, minimum, maximum,
    } = useBusFxGain(busId);

    const valueToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => valueToDecimal.invert, [valueToDecimal]);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const doReset = useCallback(() => { set(0); }, [set]);

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Gain') }
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
                        onResetValueClicked={doReset}
                        ariaLabel={t('Gain')}
                        disabled={disabled}
                        valueShowAlways
                    />
                </Flex>
                <Dialog.Root open={opened} onOpenChange={setOpened}>
                    <Dialog.Content aria-describedby={undefined}>
                        <DialogHeader>
                            { t('Gain') }
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
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const useFxDisplayName = (fxId) => {
    const { t } = useLanguage();
    const { name } = useFxNameTranslated(fxId);
    const { has: insertHas } = useFxInsertHas(fxId);
    const { has, value } = useFxInsertOn(fxId);

    return useMemo(() => {
        if (!insertHas) return name;
        const isInserted = !has || value;
        return `${name}${isInserted ? ` | ${t('Insert mode')}` : ''}`;
    }, [insertHas, name, has, value, t]);
};


const FxName = ({ fxId }) => {
    const displayName = useFxDisplayName(fxId);
    return <Text size="2" color="gray" wrap="nowrap">{ displayName }</Text>;
};


const NullOption = ({ option, selectedOptionId }) => {
    const { translateOption } = useLanguage();
    const name = translateOption(option);
    return (
        <DropdownSelect.Option selected={selectedOptionId === option.id} id={option.id}>
            <Text size="2">{ name }</Text>
        </DropdownSelect.Option>
    );
};


const FxOption = ({ option, selectedOptionId }) => (
    <DropdownSelect.Option selected={selectedOptionId === option.id} id={option.id}>
        <FxName fxId={option.id} />
    </DropdownSelect.Option>
);


const stopDropdownOpen = (e) => {
    e.stopPropagation();
};


const FxSelectLabel = ({ fxId, withLink = false }) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const displayName = useFxDisplayName(fxId);

    if (!withLink) {
        return <Text size={textSize} wrap="nowrap">{ displayName }</Text>;
    }

    return (
        <Link size={textSize} variant="ghost" color="gray" to={`/fx/${fxId}`} disabled={disabled}>
            { displayName }
        </Link>
    );
};


const FxSelect = ({ busId }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const busFxId = useBusFxId(busId);

    const {
        selected, selectedOption, onChange, nullOptions, otherOptions, hideOptions,
    } = useSelectOptions(busFxId);

    if (!busFxId.has || busFxId.value === undefined) return null;

    const displayValue = selectedOption
        ? <FxSelectLabel fxId={selectedOption.id} withLink />
        : <Text size={textSize} wrap="nowrap">{ t('Unassigned') }</Text>;

    const displayValueInTrigger = selectedOption && !hideOptions
        ? <span onPointerDown={stopDropdownOpen}>{ displayValue }</span>
        : displayValue;

    if (hideOptions) {
        return displayValue;
    }

    return (
        <DropdownSelect.Root set={onChange}>
            <DropdownSelect.Trigger square size={textSize} variant="soft" color="gray">
                { displayValueInTrigger }
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('FX') }</DropdownSelect.Label>
                {nullOptions.map(o => (
                    <NullOption
                        key={o.id}
                        option={o}
                        selectedOptionId={selected}
                    />
                ))}
                {otherOptions.map(o => (
                    <FxOption
                        key={o.id}
                        option={o}
                        selectedOptionId={selected}
                    />
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const StatusRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, toggle } = useBusFxOn(busId);

    if (!has || value === undefined) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Status') }
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


const EffectRow = ({ busId }) => {
    const { t } = useLanguage();

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('FX') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    <FxSelect busId={busId} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const FxType = ({ busId }) => {
    const { has, value } = useBusFxId(busId);
    if (!has || value === undefined || value === null) return null;
    return <Type fxId={value} />;
};


const ParametersIFHas = ({ busId }) => {
    const { has, value } = useBusFxId(busId);
    if (!has || value === undefined || value === null) return null;
    return <Parameters fxId={value} />;
};


// Exported
export default ({ busId }) => {
    const { has } = useBusFx(busId);

    if (!has) return null;

    return (
        <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
            <Gain busId={busId} />
            <StatusRow busId={busId} />
            <EffectRow busId={busId} />
            <FxType busId={busId} />
            <ParametersIFHas busId={busId} />
        </LabelControlTable.List>
    );
};
