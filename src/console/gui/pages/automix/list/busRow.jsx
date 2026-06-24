// Requirements
import {
    useAutomixOptions, useBusAutomixGainReduction, useBusAutomixId,
    useBusAutomixWeight, useDevice,
} from '@magical-mixing/mixers-react';
import {
    Dialog, Flex, Text,
} from '@radix-ui/themes';
import { useCallback, useMemo, useState } from 'react';
import { scaleLinear } from 'd3';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { LetterIconButton } from '../../../components/base/letterIconButton';
import { SourceIcon, SourceViewBus } from '../../bus/view/fromTo/from/openFrom';
import { BusIconNameLabeled, useBusNameTranslated } from '../../bus/view/name';
import { minus60To0ToDecimal, ONE } from '../../../helpers/values';
import { Meter, MeterSlider } from '../../../components/base/meterSlider';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';


// Internal
const WeightTrackStart = ({ busId, label }) => (
    <Flex align="center" gapX="1" wrap="nowrap">
        <SourceIcon busIdFrom={busId} hideIdentifier size="1" />
        <Text size="1" color="gray" wrap="nowrap">
            { label }
        </Text>
    </Flex>
);


const WeightAndGainReduction = ({ busId, trackStart }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { has: gainReductionHas, value: gainReductionValue } = useBusAutomixGainReduction(busId);
    const { name } = useBusNameTranslated(busId);

    const {
        value, set, minimum, maximum,
    } = useBusAutomixWeight(busId);

    const weightToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum])
        .range([0, ONE]), [minimum, maximum]);

    const decimalToWeight = useMemo(() => weightToDecimal.invert, [weightToDecimal]);

    const [opened, setOpened] = useState(false);
    const doClose = useCallback(() => setOpened(false), []);
    const onRightClick = useCallback(() => setOpened(true), []);
    const doReset = useCallback(() => { set(0); }, [set]);

    const dialogTitle = useMemo(() => `${t('Weight of')} ${name}`, [t, name]);

    return (
        <Flex align="center" flexGrow="1" minWidth="0" width="100%">
            <MeterSlider
                value={value}
                set={set}
                minimum={minimum}
                maximum={maximum}
                valueToDecimal={weightToDecimal}
                decimalToValue={decimalToWeight}
                onDisplayedValueClicked={onRightClick}
                onResetValueClicked={doReset}
                ariaLabel={dialogTitle}
                trackStart={trackStart}
                disabled={disabled}
                valueShowAlways
                showPlusIfPositive
                meter={(gainReductionHas && gainReductionValue !== undefined) && (
                    <Meter
                        value={gainReductionValue}
                        valueToDecimal={minus60To0ToDecimal}
                        valuesShow
                        paintOpposite
                    />
                )}
            />
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader mb="0">
                        { dialogTitle }
                    </DialogHeader>
                    <DecimalInput
                        value={value}
                        set={set}
                        onEnter={doClose}
                        allowNegativeValue
                        minimum={minimum}
                        maximum={maximum}
                        disabled={disabled}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </Flex>
    );
};


const AutomixGroups = ({ busId }) => {
    const { disabled } = useDevice();
    const { value, set } = useBusAutomixId(busId);
    const { noneOption, options } = useAutomixOptions();

    const optionsFinal = useMemo(() => options
        .filter(o => o.id !== noneOption.id), [noneOption, options]);

    const optionSelected = useCallback(optionId => () => {
        if (optionId === value) {
            set(noneOption.id);
        } else {
            set(optionId);
        }
    }, [set, value, noneOption.id]);

    return (
        <Flex align="center" justify="end" gapX="1" flexShrink="0">
            {optionsFinal.map(o => (
                <LetterIconButton
                    key={o.id}
                    letter={o.name}
                    color={value === o.id ? 'blue' : 'gray'}
                    disabled={disabled}
                    onClick={optionSelected(o.id)}
                    aria-pressed={value === o.id}
                />
            ))}
        </Flex>
    );
};


const BusRowInner = ({ busId }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { noneOption } = useAutomixOptions();
    const { value } = useBusAutomixId(busId);

    const extended = useMemo(() => value !== undefined
        && value !== noneOption.id, [value, noneOption.id]);

    const weightTrackStart = useMemo(() => (
        <WeightTrackStart busId={busId} label={t('Weight')} />
    ), [busId, t]);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0">
                {extended ? (
                    <SourceViewBus busIdFrom={busId} />
                ) : (
                    <BusIconNameLabeled busId={busId} size={textSize} />
                )}
            </Flex>
            {extended ? (
                <Flex flexGrow="1" minWidth="0">
                    <WeightAndGainReduction
                        busId={busId}
                        trackStart={weightTrackStart}
                    />
                </Flex>
            ) : (
                <Flex flexGrow="1" minWidth="0" />
            )}
            <AutomixGroups busId={busId} />
        </Flex>
    );
};


// Exported
export default ({ busId }) => <BusRowInner busId={busId} />;
