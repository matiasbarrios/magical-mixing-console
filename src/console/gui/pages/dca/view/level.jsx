// Requirements
import { useCallback, useState } from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';
import { Meter, MeterSlider } from '../../../components/base/meterSlider';
import { decimalToMinus90To10, minus60To0ToDecimal, minus90To10ToDecimal } from '../../../helpers/values';
import { FallbackDcaLevel, FallbackDcaName } from '../../../components/fallback';
import { FallbackDcaLevelPost, FallbackDcaMeterLevelPostHas } from '../../../components/fallback/dca/level';
import { DcaFinalName } from './name';


// Internal
const DcaMeterLevelPost = ({ dcaId, isVertical }) => (
    <FallbackDcaLevelPost dcaId={dcaId}>
        {({ value }) => (
            <Meter
                value={value}
                valueToDecimal={minus60To0ToDecimal}
                valuesShow
                isVertical={isVertical}
            />
        )}
    </FallbackDcaLevelPost>
);


const DcaMeterSlider = ({
    dcaId, value, set, minimum, maximum, onDisplayedValueClicked, disabled, onResetValueClicked,
    ariaLabel, label, trackStart, isVertical,
}) => (
    <FallbackDcaMeterLevelPostHas dcaId={dcaId}>
        {({ has }) => (
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
                meter={has && <DcaMeterLevelPost dcaId={dcaId} isVertical={isVertical} />}
                meterNotAvailable={!has}
                valueShowAlways
                showPlusIfPositive
                trackStart={isVertical ? undefined : (trackStart ?? label)}
                isVertical={isVertical}
            />
        )}
    </FallbackDcaMeterLevelPostHas>
);


const Level = ({
    dcaId, has, value, set, minimum, maximum, minWidth = '20dvw', fullWidth, label, trackStart,
    isVertical = false,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const doReset = useCallback(() => { set(0); }, [set]);

    if (!has) return null;

    return (
        <FallbackDcaName dcaId={dcaId}>
            {({ has: nameHas, value: nameValue, defaultName }) => {
                const dcaName = (!nameHas || !nameValue) ? defaultName : nameValue;
                const ariaLabel = `${t('Level')}: ${dcaName}`;

                return (
                    <Flex
                        align="center"
                        direction={isVertical ? 'column' : 'row'}
                        flexGrow="1"
                        minWidth={isVertical ? '0' : minWidth}
                        width={fullWidth ? '100%' : undefined}
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
                            <DcaMeterSlider
                                dcaId={dcaId}
                                value={value}
                                set={set}
                                minimum={minimum}
                                maximum={maximum}
                                onDisplayedValueClicked={doOpen}
                                onResetValueClicked={doReset}
                                ariaLabel={ariaLabel}
                                label={label}
                                trackStart={trackStart}
                                isVertical={isVertical}
                            />
                        </Flex>
                        <Dialog.Root open={opened} onOpenChange={setOpened}>
                            <Dialog.Content aria-describedby={undefined}>
                                <DialogHeader>
                                    <DcaFinalName dcaId={dcaId} />
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
            }}
        </FallbackDcaName>
    );
};


// Exported
export default ({
    dcaId, minWidth = '20dvw', fullWidth, label, trackStart, isVertical = false,
}) => (
    <FallbackDcaLevel dcaId={dcaId}>
        {({
            has, value, set, minimum, maximum,
        }) => (
            <Level
                dcaId={dcaId}
                has={has}
                value={value}
                set={set}
                minimum={minimum}
                maximum={maximum}
                minWidth={minWidth}
                fullWidth={fullWidth}
                label={label}
                trackStart={trackStart}
                isVertical={isVertical}
            />
        )}
    </FallbackDcaLevel>
);
