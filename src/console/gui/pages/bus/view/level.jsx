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
const BusMeterLevelPost = ({ busId }) => {
    const { value } = useBusLevelPost(busId);
    return (
        <Meter value={value} valueToDecimal={minus60To0ToDecimal} valuesShow />
    );
};


const BusMeterSlider = ({
    busId, onDisplayedValueClicked, disabled, onResetValueClicked, ariaLabel, label, trackStart,
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
            meter={<BusMeterLevelPost busId={busId} />}
        />
    );
};


// Exported
export default ({
    busId, minWidth, maxWidth, fullWidth, label, trackStart,
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
            flexGrow="1"
            minWidth={minWidth}
            maxWidth={maxWidth}
            width={fullWidth ? '100%' : undefined}
        >
            <BusMeterSlider
                busId={busId}
                onDisplayedValueClicked={doOpen}
                onResetValueClicked={doReset}
                ariaLabel={ariaLabel}
                label={label ?? t('Level')}
                trackStart={trackStart}
            />
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
