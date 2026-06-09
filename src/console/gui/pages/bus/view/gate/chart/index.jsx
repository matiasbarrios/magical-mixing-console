// Requirements
import { Box } from '@radix-ui/themes';
import {
    useCallback, useEffect, useMemo, useRef,
} from 'react';
import {
    useBusGateGainReduction, useBusGateKey, useBusGateMode,
    useBusGateOn, useBusGateRange, useBusGateThreshold, useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import { createChart } from './chart';
import { createResult, updateResult } from './result';
import { createOrUpdateThreshold } from './threshold';
import { createGainReduction, updateGainReduction } from './gainReduction';
import { createKey, updateKey } from './key';
import { createCenter } from './center';


// Exported
export default ({ busId }) => {
    const { t } = useLanguage();

    const { disabled } = useDevice();

    const { has: onHas, value: on } = useBusGateOn(busId);

    const isOff = useMemo(() => onHas === true && on === false, [onHas, on]);

    const {
        has: gainReductionHas,
        value: gainReductionValue,
    } = useBusGateGainReduction(busId);

    const gainReduction = useMemo(() => (gainReductionHas ? gainReductionValue : 0),
        [gainReductionHas, gainReductionValue]);

    const {
        has: keyHas,
        value: keyValue,
    } = useBusGateKey(busId);

    const key = useMemo(() => (keyHas ? keyValue : 0), [keyHas, keyValue]);

    const {
        has: thresholdHas, value: threshold, set: thresholdSet, minimum, maximum,
    } = useBusGateThreshold(busId);

    const {
        has: modeHas, value: modeId, options: modeOptions,
    } = useBusGateMode(busId);

    const modeOption = useMemo(() => modeOptions.find(o => o.id === modeId),
        [modeOptions, modeId]);

    const mode = useMemo(() => (modeHas && modeOption
        ? modeOption.name : ''), [modeOption, modeHas]);

    const {
        has: rangeHas, value: rangeValue,
    } = useBusGateRange(busId);

    const range = useMemo(() => (rangeHas ? rangeValue : 0),
        [rangeHas, rangeValue]);

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
        parametersRef.current.mode = mode;
        parametersRef.current.range = range;
        updateResult(chartRef.current, parametersRef.current);
        updateKey(chartRef.current, parametersRef.current);
    }, [mode, range]);

    useEffect(() => {
        if (!chartRef.current?.created) return;
        parametersRef.current.disabled = disabled;
        parametersRef.current.threshold = threshold;
        updateResult(chartRef.current, parametersRef.current);
        createOrUpdateThreshold(chartRef.current, parametersRef
            .current, onThresholdChanged, thresholdLabel);
    }, [threshold, onThresholdChanged, thresholdLabel, disabled]);

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
