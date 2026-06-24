// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import { useBusLevel, useBusLevelPost } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';
import { Meter, MeterSlider } from '../../../components/base/meterSlider';
import { decimalToMinus90To10, minus60To0ToDecimal, minus90To10ToDecimal } from '../../../helpers/values';
import { useBusNameTranslated } from './name';


// Internal
const BusMeterLevelPost = ({ busId, isVertical }) => {
    const { value } = useBusLevelPost(busId);
    return (
        <Meter
            value={value}
            valueToDecimal={minus60To0ToDecimal}
            valuesShow
            isVertical={isVertical}
        />
    );
};


const BusMeterSlider = ({
    busId, onDisplayedValueClicked, disabled, onResetValueClicked, ariaLabel, label, trackStart,
    isVertical,
}) => {
    const {
        value, set, minimum, maximum,
    } = useBusLevel(busId);

    return (
        <MeterSlider
            value={value}
            set={set}
            minimum={minimum}
            maximum={maximum}
            valueToDecimal={minus90To10ToDecimal}
            decimalToValue={decimalToMinus90To10}
            onDisplayedValueClicked={onDisplayedValueClicked}
            onResetValueClicked={onResetValueClicked}
            ariaLabel={ariaLabel}
            disabled={disabled}
            valueShowAlways
            showPlusIfPositive
            trackStart={trackStart ?? label}
            isVertical={isVertical}
            meter={<BusMeterLevelPost busId={busId} isVertical={isVertical} />}
        />
    );
};


// Exported
export default ({
    busId, minWidth, maxWidth, label, trackStart, isVertical = false,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const {
        has, value, set, minimum, maximum,
    } = useBusLevel(busId);

    const { name } = useBusNameTranslated(busId);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const doReset = useCallback(() => { set(0); }, [set]);

    const ariaLabel = useMemo(() => `${t('Level')}: ${name}`, [t, name]);

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
                <BusMeterSlider
                    busId={busId}
                    onDisplayedValueClicked={doOpen}
                    onResetValueClicked={doReset}
                    ariaLabel={ariaLabel}
                    label={isVertical ? undefined : (label ?? t('Level'))}
                    trackStart={isVertical ? undefined : trackStart}
                    isVertical={isVertical}
                />
            </Flex>
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        { name }
                    </DialogHeader>
                    <Dialog.Description size={textSize} mb="4">
                        { t('Set the level') }
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
