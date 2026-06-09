// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Dialog } from '@radix-ui/themes';
import { useBusPan, useDevice } from '@magical-mixing/mixers-react';
import { scaleLinear } from 'd3';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import DecimalInput from '../../../components/base/decimalInput';
import DialogHeader from '../../../components/base/dialogHeader';
import { Knob } from '../../../components/base/knob';
import { ONE } from '../../../helpers/values';
import { useBusNameTranslated } from './name';


// Internal
const Pan = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    const { name } = useBusNameTranslated(busId);

    const {
        value, set, minimum, maximum,
    } = useBusPan(busId);

    const panToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum])
        .range([0, ONE]), [minimum, maximum]);

    const decimalToPan = useMemo(() => panToDecimal.invert, [panToDecimal]);

    const [opened, setOpened] = useState(false);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const onRightClick = useCallback(() => setOpened(true), [setOpened]);

    const ariaLabel = useMemo(() => `${t('Pan')}: ${name}`, [t, name]);

    return (
        <>
            <Knob
                value={value}
                set={set}
                valueToDecimal={panToDecimal}
                decimalToValue={decimalToPan}
                minimum={minimum}
                maximum={maximum}
                onRightClick={onRightClick}
                ariaLabel={ariaLabel}
                orientation="horizontal"
                disabled={disabled}
            />
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        { name }
                    </DialogHeader>
                    <Dialog.Description size={textSize} mb="4">
                        { t('Set the pan') }
                    </Dialog.Description>
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
        </>
    );
};


// Exported
export default ({ busId }) => {
    const { has } = useBusPan(busId);

    if (!has) return null;

    return <Pan busId={busId} />;
};
