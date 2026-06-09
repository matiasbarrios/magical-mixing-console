// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Dialog } from '@radix-ui/themes';
import { useBusToPan, useDevice } from '@magical-mixing/mixers-react';
import { scaleLinear } from 'd3';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { useBusNameTranslated } from '../name';
import DecimalInput from '../../../../components/base/decimalInput';
import DialogHeader from '../../../../components/base/dialogHeader';
import { Knob } from '../../../../components/base/knob';
import { ONE } from '../../../../helpers/values';


// Internal
const Pan = ({ busIdFrom, busIdTo, readOnly }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    const { name: nameFrom } = useBusNameTranslated(busIdFrom);
    const { name: nameTo } = useBusNameTranslated(busIdTo);

    const {
        value, set, minimum, maximum,
    } = useBusToPan(busIdFrom, busIdTo);

    const panToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum])
        .range([0, ONE]), [minimum, maximum]);

    const decimalToPan = useMemo(() => panToDecimal.invert, [panToDecimal]);

    const [opened, setOpened] = useState(false);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const onRightClick = useCallback(() => setOpened(true), [setOpened]);

    const ariaLabel = useMemo(() => `${t('Pan')}, ${nameFrom} ${t('to')} ${nameTo}`,
        [t, nameFrom, nameTo]);

    return (
        <>
            <Knob
                value={value}
                set={readOnly ? undefined : set}
                valueToDecimal={panToDecimal}
                decimalToValue={decimalToPan}
                minimum={minimum}
                maximum={maximum}
                onRightClick={readOnly ? undefined : onRightClick}
                ariaLabel={ariaLabel}
                orientation="horizontal"
                disabled={disabled}
                readOnly={readOnly}
            />
            {!readOnly && (
                <Dialog.Root open={opened} onOpenChange={setOpened}>
                    <Dialog.Content aria-describedby={undefined}>
                        <DialogHeader>
                            { `${t('From')} ${nameFrom} ${t('to')} ${nameTo}` }
                        </DialogHeader>
                        <Dialog.Description size={textSize} mb="4">
                            { t('Set the sending pan') }
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
            )}
        </>
    );
};


// Exported
export default ({ busIdFrom, busIdTo, readOnly }) => {
    const { has } = useBusToPan(busIdFrom, busIdTo);
    if (!has) return null;
    return <Pan busIdFrom={busIdFrom} busIdTo={busIdTo} readOnly={readOnly} />;
};
