// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Dialog, Flex, Text } from '@radix-ui/themes';
import { scaleLinear } from 'd3';
import { useBusCompressorMix, useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import { Knob } from '../../../../../components/base/knob';
import DecimalInput from '../../../../../components/base/decimalInput';
import DialogHeader from '../../../../../components/base/dialogHeader';
import { ONE } from '../../../../../helpers/values';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();

    const {
        has, value, set, minimum, maximum,
    } = useBusCompressorMix(busId);

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);

    const valueToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToValue = useMemo(() => valueToDecimal.invert, [valueToDecimal]);

    const isValidValue = useMemo(() => !Number.isNaN(value)
        && value !== undefined && value !== null, [value]);

    if (!has || value === undefined) return null;

    return (
        <Flex direction="column" align="center" gapY="1">
            <Text size="1" color="gray" align="center">
                { t('Mix', undefined, true) }
            </Text>
            {isValidValue && (
                <Flex direction="column" align="center" justify="center" gapY="1">
                    <Knob
                        value={value}
                        set={set}
                        valueToDecimal={valueToDecimal}
                        decimalToValue={decimalToValue}
                        minimum={minimum}
                        maximum={maximum}
                        onRightClick={doOpen}
                        ariaLabel={t('Mix', undefined, true)}
                        disabled={disabled}
                        decimalsToShow={0}
                        asButton
                        resetValue={maximum}
                        onFocusScale={1.5}
                    />
                </Flex>
            )}
            <Dialog.Root open={opened} onOpenChange={setOpened}>
                <Dialog.Content aria-describedby={undefined}>
                    <DialogHeader>
                        { t('Mix', undefined, true) }
                    </DialogHeader>
                    <DecimalInput
                        value={value}
                        set={set}
                        onEnter={() => setOpened(false)}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </Flex>
    );
};
