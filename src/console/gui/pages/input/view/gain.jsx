// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import { useInputGain, useInputGainPost } from '@magical-mixing/mixers-react';
import { scaleLinear } from 'd3';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';
import { Meter, MeterSlider } from '../../../components/base/meterSlider';
import { minus60To0ToDecimal, ONE } from '../../../helpers/values';
import { InputName, useInputNameTranslated } from './name';


// Internal
const InputMeterGainPost = ({ inputId, isVertical }) => {
    const { value } = useInputGainPost(inputId);
    return (
        <Meter
            value={value}
            valueToDecimal={minus60To0ToDecimal}
            valuesShow
            isVertical={isVertical}
        />
    );
};


const GainMeterSlider = ({
    inputId, onDisplayedValueClicked, disabled, onResetValueClicked, ariaLabel, label,
    isVertical,
}) => {
    const {
        value, set, minimum, maximum,
    } = useInputGain(inputId);

    const gainToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToGain = useMemo(() => gainToDecimal.invert, [gainToDecimal]);

    return (
        <MeterSlider
            value={value}
            set={set}
            minimum={minimum}
            maximum={maximum}
            valueToDecimal={gainToDecimal}
            decimalToValue={decimalToGain}
            onDisplayedValueClicked={onDisplayedValueClicked}
            onResetValueClicked={onResetValueClicked}
            ariaLabel={ariaLabel}
            disabled={disabled}
            valueShowAlways
            showPlusIfPositive
            trackStart={isVertical ? undefined : label}
            isVertical={isVertical}
            meter={<InputMeterGainPost inputId={inputId} isVertical={isVertical} />}
        />
    );
};


// Exported
export default ({
    inputId, minWidth, maxWidth, label, isVertical = false,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const {
        has, value, set, minimum, maximum,
    } = useInputGain(inputId);

    const { name } = useInputNameTranslated(inputId);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const doReset = useCallback(() => { set(0); }, [set]);

    const ariaLabel = useMemo(() => `${t('Gain')}: ${name}`, [t, name]);

    if (!has) return null;

    return (
        <Flex
            align="center"
            direction={isVertical ? 'column' : 'row'}
            flexGrow="1"
            minWidth={isVertical ? '0' : minWidth}
            maxWidth={isVertical ? undefined : maxWidth}
            width="100%"
            height={isVertical ? '100%' : undefined}
            minHeight={isVertical ? '0' : undefined}
        >
            <Flex
                flexGrow="1"
                align="center"
                justify="center"
                minWidth={isVertical ? undefined : '0'}
                minHeight={isVertical ? '0' : undefined}
                width="100%"
            >
                <GainMeterSlider
                    inputId={inputId}
                    onDisplayedValueClicked={doOpen}
                    onResetValueClicked={doReset}
                    ariaLabel={ariaLabel}
                    label={label}
                    isVertical={isVertical}
                />
            </Flex>
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        <InputName inputId={inputId} />
                    </DialogHeader>
                    <Dialog.Description size={textSize} mb="4">
                        { t('Set the gain') }
                    </Dialog.Description>
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
    );
};
