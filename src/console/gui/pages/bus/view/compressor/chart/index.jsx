// Requirements
import { Box } from '@radix-ui/themes';
import {
    useCallback, useEffect, useMemo, useRef,
} from 'react';
import {
    useBusCompressorGain, useBusCompressorGainReduction, useBusCompressorKey, useBusCompressorKnee,
    useBusCompressorMode, useBusCompressorOn, useBusCompressorRatio, useBusCompressorThreshold,
    useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import { useUiSize } from '../../../../../components/theme';
import { createChart } from './chart';
import { createResult, updateResult } from './result';
import { createOrUpdateThreshold } from './threshold';
import { createGainReduction, updateGainReduction } from './gainReduction';
import { createKey, updateKey } from './key';
import { createCenter } from './center';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const { disabled } = useDevice();

    const { has: onHas, value: on } = useBusCompressorOn(busId);

    const isOff = useMemo(() => onHas === true && on === false, [onHas, on]);

    const {
        has: gainReductionHas,
        value: gainReductionValue,
    } = useBusCompressorGainReduction(busId);

    const gainReduction = useMemo(() => (gainReductionHas ? gainReductionValue : 0),
        [gainReductionHas, gainReductionValue]);

    const {
        has: keyHas,
        value: keyValue,
    } = useBusCompressorKey(busId);

    const key = useMemo(() => (keyHas ? keyValue : 0), [keyHas, keyValue]);

    const {
        has: thresholdHas, value: threshold, set: thresholdSet, minimum, maximum,
    } = useBusCompressorThreshold(busId);

    const {
        has: ratioHas, value: ratioId, options: ratioOptions,
    } = useBusCompressorRatio(busId);

    const ratioOption = useMemo(() => ratioOptions.find(o => o.id === ratioId),
        [ratioOptions, ratioId]);

    const ratio = useMemo(() => (ratioHas && ratioOption
        ? parseFloat(ratioOption.name) : 1), [ratioOption, ratioHas]);

    const { has: kneeHas, value: kneeValue } = useBusCompressorKnee(busId);

    const knee = useMemo(() => (kneeHas ? kneeValue : 0), [kneeHas, kneeValue]);

    const {
        has: modeHas, value: modeId, options: modeOptions,
    } = useBusCompressorMode(busId);

    const modeOption = useMemo(() => modeOptions.find(o => o.id === modeId),
        [modeOptions, modeId]);

    const mode = useMemo(() => (modeHas && modeOption
        ? modeOption.name : ''), [modeOption, modeHas]);

    const { has: gainHas, value: gainValue } = useBusCompressorGain(busId);

    const gain = useMemo(() => (gainHas ? gainValue : 0), [gainHas, gainValue]);

    const thresholdLabel = useMemo(() => t('Threshold', undefined, true), [t]);

    const boxRef = useRef(null);
    const chartRef = useRef({});
    const parametersRef = useRef({});

    const onThresholdChanged = useCallback((v) => {
        updateResult(chartRef.current, parametersRef.current);
        createOrUpdateThreshold(chartRef.current, parametersRef
            .current, onThresholdChanged, thresholdLabel);
        thresholdSet(v);
    }, [thresholdSet, thresholdLabel]);

    const createRefs = useCallback(() => {
        if (!boxRef.current) return;
        chartRef.current = createChart(boxRef.current, minimum, maximum);
        createCenter(chartRef.current);
        createResult(chartRef.current, parametersRef.current);
        createGainReduction(chartRef.current, parametersRef.current);
        createKey(chartRef.current, parametersRef.current);
        createOrUpdateThreshold(chartRef.current, parametersRef
            .current, onThresholdChanged, thresholdLabel);
    }, [minimum, maximum, onThresholdChanged, thresholdLabel]);

    useEffect(() => {
        createRefs();
        return () => { chartRef.current = null; };
    }, [busId, createRefs]);

    // On resize
    useEffect(() => {
        window.addEventListener('resize', createRefs);
        return () => window.removeEventListener('resize', createRefs);
    }, [createRefs]);

    useEffect(() => {
        if (!chartRef.current?.created) return;
        parametersRef.current.ratio = ratio;
        parametersRef.current.knee = knee;
        parametersRef.current.mode = mode;
        parametersRef.current.makeupGain = gain;
        updateResult(chartRef.current, parametersRef.current);
        updateKey(chartRef.current, parametersRef.current);
    }, [ratio, knee, mode, gain]);

    useEffect(() => {
        if (!chartRef.current?.created) return;
        parametersRef.current.disabled = disabled;
        parametersRef.current.threshold = threshold;
        updateResult(chartRef.current, parametersRef.current);
        createOrUpdateThreshold(chartRef.current, parametersRef
            .current, onThresholdChanged, thresholdLabel);
    }, [threshold, onThresholdChanged, thresholdLabel, disabled, textSize]);

    useEffect(() => {
        if (!chartRef.current?.created) return;
        parametersRef.current.isOff = isOff;
        parametersRef.current.gainReduction = gainReduction;
        updateGainReduction(chartRef.current, parametersRef.current);
        updateKey(chartRef.current, parametersRef.current);
    }, [gainReduction, isOff]);

    useEffect(() => {
        if (!chartRef.current?.created) return;
        parametersRef.current.key = key;
        updateKey(chartRef.current, parametersRef.current);
    }, [key]);

    if (!thresholdHas) return null;

    return (
        <Box minWidth="100%" maxWidth="100%" height="100%" ref={boxRef} />
    );
};
