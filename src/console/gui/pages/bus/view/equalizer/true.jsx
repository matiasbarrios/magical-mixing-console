// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import {
    useBusEqualizerTrue, useBusEqualizerTrueGain,
    useBusEqualizerTrueOptions, useBusRTA, useDevice,
} from '@magical-mixing/mixers-react';
import { scaleLinear } from 'd3';
import DecimalInput from '../../../../components/base/decimalInput';
import ConditionalScrollX from '../../../../components/base/conditionalScrollX';
import DialogHeader from '../../../../components/base/dialogHeader';
import { useLanguage } from '../../../../components/language';
import { Meter, MeterSlider } from '../../../../components/base/meterSlider';
import { minus60To0ToDecimal, ONE } from '../../../../helpers/values';
import { useUiSize } from '../../../../components/theme';
import { useEqualizer } from './context';


// Constants
const labelStyle = {
    fontSize: '10px',
    color: 'var(--gray-a9)',
};


// Internal
const RtaValues = ({ busId, frequency }) => {
    const { value: values } = useBusRTA(busId);

    const rtaIndex = useRef(-1);

    const value = useMemo(() => {
        if (!rtaIndex || rtaIndex.current === -1) return null;
        return values[rtaIndex.current][1];
    }, [values, rtaIndex]);

    useEffect(() => {
        if (!values) return;
        if (rtaIndex.current !== -1) return;
        let lastF = 0;
        let index = -1;
        values.forEach(([f], i) => {
            if ((f > frequency) && (Math.abs(f - frequency) >= Math.abs(lastF - frequency))) return;
            lastF = f;
            index = i;
        });
        rtaIndex.current = index;
    }, [values, frequency]);

    if (value === null) return null;

    return (
        <Meter
            value={value}
            valueToDecimal={minus60To0ToDecimal}
            isVertical
            valuesShow
        />
    );
};

const TrueMeter = ({ busId, frequency }) => {
    const { has } = useBusRTA(busId);
    if (!has) return null;
    return <RtaValues busId={busId} frequency={frequency} />;
};


const True = ({ busId, graph }) => {
    const { disabled } = useDevice();
    const {
        has, value, set, minimum, maximum,
    } = useBusEqualizerTrueGain(busId, graph.id);
    const { rtaOn } = useEqualizer();
    const { meterSliderTrackSizePx, textSize } = useUiSize();
    const { t } = useLanguage();

    const [opened, setOpened] = useState(false);
    const doOpen = useCallback(() => setOpened(true), [setOpened]);
    const doClose = useCallback(() => setOpened(false), [setOpened]);

    const meter = useMemo(() => {
        if (!rtaOn) return null;
        return <TrueMeter busId={busId} frequency={graph.frequency} />;
    }, [rtaOn, busId, graph.frequency]);

    const gainToDecimal = useMemo(() => scaleLinear()
        .domain([minimum, maximum]).range([0, ONE]), [minimum, maximum]);
    const decimalToGain = useMemo(() => gainToDecimal.invert, [gainToDecimal]);

    const doReset = useCallback(() => { set(0); }, [set]);

    if (!has) return null;

    return (
        <Flex
            direction="column"
            align="center"
            flexShrink="0"
            minWidth={`${meterSliderTrackSizePx}px`}
            maxWidth={`${meterSliderTrackSizePx}px`}
        >
            <Flex flexGrow="1" align="center">
                <MeterSlider
                    value={value}
                    set={set}
                    minimum={minimum}
                    maximum={maximum}
                    valueToDecimal={gainToDecimal}
                    decimalToValue={decimalToGain}
                    onDisplayedValueClicked={doOpen}
                    onResetValueClicked={doReset}
                    ariaLabel={graph.name}
                    disabled={disabled}
                    isVertical
                    meter={meter}
                    valueShowAlways
                />
                <Dialog.Root open={opened} onOpenChange={setOpened}>
                    <Dialog.Content aria-describedby={undefined}>
                        <DialogHeader>
                            { graph.name }
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
            <Flex align="center" justify="center" height="20px">
                <span style={labelStyle}>{ graph.name }</span>
            </Flex>
        </Flex>
    );
};


const TrueOptions = ({ busId, height }) => {
    const { options } = useBusEqualizerTrueOptions(busId);
    return (
        <ConditionalScrollX>
            <Flex gapX="1" height={height} px="1" pb="2" width="max-content" align="stretch">
                {options.map(o => <True key={o.id} busId={busId} graph={o} />)}
            </Flex>
        </ConditionalScrollX>
    );
};


// Exported
export default ({ busId, height }) => {
    const { has } = useBusEqualizerTrue(busId);
    if (!has) return null;
    return <TrueOptions busId={busId} height={height} />;
};
