// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import { useBusToMeter, useBusToLevel, useBusToOn, useBusToPan } from '@magical-mixing/mixers-react';
import {
    busToLevelDefaultOn, busToLevelSliderMinimum, clampBusToLevelAbove,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import DecimalInput from '../../../../components/base/decimalInput';
import DialogHeader from '../../../../components/base/dialogHeader';
import { useBusNameTranslated } from '../name';
import { Meter, MeterSlider } from '../../../../components/base/meterSlider';
import { decimalToMinus90To10, minus60To0ToDecimal, minus90To10ToDecimal } from '../../../../helpers/values';


const linearRangeValueToDecimal = (assignableMinimum, maximum) => (value) => {
    const span = maximum - assignableMinimum;
    if (span <= 0) return 0;
    const clamped = Math.max(assignableMinimum, Math.min(maximum, value));
    return (clamped - assignableMinimum) / span;
};


const linearRangeDecimalToValue = (assignableMinimum, maximum) => (decimal) => {
    const span = maximum - assignableMinimum;
    const clamped = Math.max(0, Math.min(1, decimal));
    return assignableMinimum + clamped * span;
};


// Internal
const toLinear = db => 10 ** (db / 20);


const toDB = lin => Math.min(20 * Math.log10(Math.max(lin, 1e-10)), 0);


const BusToMeterSingle = ({ busIdFrom, busIdTo }) => {
    const { value } = useBusToMeter(busIdFrom, busIdTo);
    const { has: panHas, value: panValue } = useBusToPan(busIdFrom, busIdTo);

    const valueFinal = useMemo(() => {
        if (panHas && panValue === 0 && value?.length
            && Math.round(value[0]) === Math.round(value[1])) return value[0];
        return value;
    }, [panHas, panValue, value]);

    return (
        <Meter
            value={valueFinal}
            valueToDecimal={minus60To0ToDecimal}
            valuesShow
        />
    );
};


const BusToMeterStereoLinked = ({ busIdFrom, busIdTo, busIdStereoLinked }) => {
    const { value } = useBusToMeter(busIdFrom, busIdTo);
    const { has: panHas, value: panValue } = useBusToPan(busIdFrom, busIdTo);

    const { value: stereoLinkedValue } = useBusToMeter(busIdStereoLinked, busIdTo);
    const {
        has: stereoLinkedPanHas,
        value: stereoLinkedPanValue,
    } = useBusToPan(busIdStereoLinked, busIdTo);

    const valueFinal = useMemo(() => {
        const valueFromLeft = (panHas && panValue === 0 && value?.length) ? value[0] : value;
        const valueFromRight = (stereoLinkedPanHas && stereoLinkedPanValue === 0
            && stereoLinkedValue?.length) ? stereoLinkedValue[0] : stereoLinkedValue;

        const finalValueFromLeft = Array.isArray(valueFromLeft)
            ? valueFromLeft : [valueFromLeft, valueFromLeft];
        const finalValueFromRight = Array.isArray(valueFromRight)
            ? valueFromRight : [valueFromRight, valueFromRight];

        const left = toDB(toLinear(finalValueFromLeft[0]) + toLinear(finalValueFromRight[0]));
        const right = toDB(toLinear(finalValueFromLeft[1]) + toLinear(finalValueFromRight[1]));

        return [left, right];
    }, [panHas, panValue, value, stereoLinkedPanHas, stereoLinkedPanValue, stereoLinkedValue]);

    return (
        <Meter
            value={valueFinal}
            valueToDecimal={minus60To0ToDecimal}
            valuesShow
        />
    );
};


const BusToMeter = ({ busIdFrom, busIdTo, busIdStereoLinked }) => {
    if (!busIdStereoLinked) {
        return <BusToMeterSingle busIdFrom={busIdFrom} busIdTo={busIdTo} />;
    }
    return (
        <BusToMeterStereoLinked
            busIdFrom={busIdFrom}
            busIdTo={busIdTo}
            busIdStereoLinked={busIdStereoLinked}
        />
    );
};


const BusMeterSlider = ({
    busIdFrom, busIdTo, onDisplayedValueClicked, disabled,
    onResetValueClicked, busIdStereoLinked, ariaLabel, readOnly, trackStart,
    assignableMinimum,
    valueToDecimal, decimalToValue,
}) => {
    const {
        value, set, minimum, maximum,
    } = useBusToLevel(busIdFrom, busIdTo);
    const { has: hasMeter } = useBusToMeter(busIdFrom, busIdTo);

    const setClamped = useCallback((next) => {
        set(clampBusToLevelAbove(next, minimum, maximum));
    }, [maximum, minimum, set]);

    return (
        <MeterSlider
            value={value}
            set={assignableMinimum === undefined ? set : setClamped}
            minimum={assignableMinimum ?? minimum}
            maximum={maximum}
            valueToDecimal={valueToDecimal}
            decimalToValue={decimalToValue}
            onDisplayedValueClicked={readOnly ? undefined : onDisplayedValueClicked}
            onResetValueClicked={readOnly ? undefined : onResetValueClicked}
            ariaLabel={ariaLabel}
            disabled={disabled}
            readOnly={readOnly}
            valueShowAlways
            showPlusIfPositive
            trackStart={trackStart}
            meter={hasMeter && (
                <BusToMeter
                    busIdFrom={busIdFrom}
                    busIdTo={busIdTo}
                    busIdStereoLinked={busIdStereoLinked}
                />
            )}
        />
    );
};


// Exported
const Level = ({
    busIdFrom, busIdTo, busIdStereoLinked, minWidth = '20dvw', maxWidth, readOnly, trackStart,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const { name: nameFrom } = useBusNameTranslated(busIdFrom);
    const { name: nameTo } = useBusNameTranslated(busIdTo);

    const {
        value, set, minimum, maximum,
    } = useBusToLevel(busIdFrom, busIdTo);
    const { has: hasOn } = useBusToOn(busIdFrom, busIdTo);

    const assignableMinimum = useMemo(() => {
        if (hasOn === true) return undefined;
        return busToLevelSliderMinimum(minimum, maximum);
    }, [hasOn, minimum, maximum]);

    const valueToDecimal = useMemo(() => {
        if (assignableMinimum === undefined) return minus90To10ToDecimal;
        return linearRangeValueToDecimal(assignableMinimum, maximum);
    }, [assignableMinimum, maximum]);

    const decimalToValue = useMemo(() => {
        if (assignableMinimum === undefined) return decimalToMinus90To10;
        return linearRangeDecimalToValue(assignableMinimum, maximum);
    }, [assignableMinimum, maximum]);

    const setClamped = useCallback((next) => {
        if (hasOn === true) {
            set(next);
            return;
        }
        set(clampBusToLevelAbove(next, minimum, maximum));
    }, [hasOn, maximum, minimum, set]);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const doReset = useCallback(() => {
        if (hasOn === true) {
            set(0);
            return;
        }
        set(busToLevelDefaultOn(minimum, maximum));
    }, [hasOn, minimum, maximum, set]);

    const ariaLabel = useMemo(() => `${t('Level')}, ${nameFrom} ${t('to')} ${nameTo}`,
        [t, nameFrom, nameTo]);

    return (
        <Flex align="center" flexGrow="1" minWidth={minWidth} maxWidth={maxWidth} width={trackStart ? '100%' : undefined}>
            <BusMeterSlider
                busIdFrom={busIdFrom}
                busIdTo={busIdTo}
                onDisplayedValueClicked={doOpen}
                onResetValueClicked={doReset}
                busIdStereoLinked={busIdStereoLinked}
                ariaLabel={ariaLabel}
                readOnly={readOnly}
                trackStart={trackStart}
                assignableMinimum={assignableMinimum}
                valueToDecimal={valueToDecimal}
                decimalToValue={decimalToValue}
            />
            {!readOnly && (
                <Dialog.Root open={opened} onOpenChange={setOpened}>
                    <Dialog.Content aria-describedby={undefined}>
                        <DialogHeader>
                            { `${t('From')} ${nameFrom} ${t('to')} ${nameTo}` }
                        </DialogHeader>
                        <Dialog.Description size={textSize} mb="4">
                            { t('Set the sending level') }
                        </Dialog.Description>
                        <DecimalInput
                            value={value}
                            set={setClamped}
                            onEnter={doClose}
                            allowNegativeValue
                            minimum={assignableMinimum ?? minimum}
                            maximum={maximum}
                        />
                    </Dialog.Content>
                </Dialog.Root>
            )}
        </Flex>
    );
};


// Exported
export default ({
    busIdFrom, busIdTo, busIdStereoLinked, minWidth, maxWidth, readOnly, trackStart,
}) => {
    const { has } = useBusToLevel(busIdFrom, busIdTo);
    if (!has) return null;
    return (
        <Level
            busIdFrom={busIdFrom}
            busIdTo={busIdTo}
            busIdStereoLinked={busIdStereoLinked}
            minWidth={minWidth}
            maxWidth={maxWidth}
            readOnly={readOnly}
            trackStart={trackStart}
        />
    );
};
