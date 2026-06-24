// Requirements
import {
    useCallback, useEffect, useLayoutEffect, useMemo, useRef,
} from 'react';
import {
    useBusCompressor,
    useBusCompressorGain,
    useBusCompressorKnee,
    useBusCompressorMode,
    useBusCompressorOn,
    useBusCompressorRatio,
    useBusCompressorThreshold,
    useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import {
    createMiniChart, setMiniChartDisabled, updateMiniChart,
} from '../../compressor/chart/miniChart';
import { PREVIEW_COMPRESSOR_ROAM_ID } from '../../../../../helpers/hotkeys/focusRoam';
import { MINI_PREVIEW_CHART_STYLE, MiniPreviewContainer, MiniPreviewPlaceholder } from './miniPreviewContainer';
import { useProcessingPreview } from './previewDialog';


// Internal
const Preview = ({ busIdFrom }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { openPreview } = useProcessingPreview();
    const { has: onHas, value: on } = useBusCompressorOn(busIdFrom);
    const inactive = useMemo(() => onHas && !on, [onHas, on]);
    const {
        has: thresholdHas, value: threshold, minimum, maximum,
    } = useBusCompressorThreshold(busIdFrom);
    const {
        has: ratioHas, value: ratioId, options: ratioOptions,
    } = useBusCompressorRatio(busIdFrom);
    const { has: kneeHas, value: kneeValue } = useBusCompressorKnee(busIdFrom);
    const {
        has: modeHas, value: modeId, options: modeOptions,
    } = useBusCompressorMode(busIdFrom);
    const { has: gainHas, value: gainValue } = useBusCompressorGain(busIdFrom);

    const ratio = useMemo(() => {
        if (!ratioHas) return undefined;
        const option = ratioOptions.find(o => o.id === ratioId);
        return option ? parseFloat(option.name) : undefined;
    }, [ratioHas, ratioOptions, ratioId]);

    const mode = useMemo(() => {
        if (!modeHas) return undefined;
        const option = modeOptions.find(o => o.id === modeId);
        return option?.name;
    }, [modeHas, modeOptions, modeId]);

    const knee = useMemo(() => (kneeHas ? kneeValue : undefined), [kneeHas, kneeValue]);
    const makeupGain = useMemo(() => (gainHas ? gainValue : undefined), [gainHas, gainValue]);

    const chartRef = useRef(null);
    const parametersRef = useRef({});
    const containerRef = useRef(null);

    const refreshChart = useCallback(() => {
        if (!chartRef.current?.created) return;
        updateMiniChart(chartRef.current, parametersRef.current);
    }, []);

    const buildChart = useCallback(() => {
        if (!containerRef.current || !thresholdHas) return;
        chartRef.current = createMiniChart(containerRef.current, minimum, maximum);
        refreshChart();
    }, [thresholdHas, minimum, maximum, refreshChart]);

    useLayoutEffect(() => {
        buildChart();
        return () => {
            chartRef.current = null;
        };
    }, [busIdFrom, buildChart]);

    useEffect(() => {
        window.addEventListener('resize', buildChart);
        return () => window.removeEventListener('resize', buildChart);
    }, [buildChart]);

    useEffect(() => {
        parametersRef.current = {
            threshold,
            ratio,
            knee,
            mode,
            makeupGain,
        };
        refreshChart();
    }, [threshold, ratio, knee, mode, makeupGain, refreshChart]);

    useEffect(() => {
        if (!chartRef.current?.created) return;
        setMiniChartDisabled(chartRef.current, inactive || disabled);
        refreshChart();
    }, [inactive, disabled, refreshChart]);

    const onOpen = useCallback((e) => {
        e.stopPropagation();
        openPreview({ busId: busIdFrom, section: 'compressor' });
    }, [busIdFrom, openPreview]);

    if (!thresholdHas) return <MiniPreviewPlaceholder />;

    return (
        <MiniPreviewContainer
            aria-label={t('Compressor')}
            onClick={onOpen}
            disabled={disabled}
            opacity={inactive || disabled ? 0.5 : 1}
            focusRoam={PREVIEW_COMPRESSOR_ROAM_ID}
        >
            <div ref={containerRef} style={MINI_PREVIEW_CHART_STYLE} />
        </MiniPreviewContainer>
    );
};


// Exported
export default ({ busIdFrom }) => {
    const { has } = useBusCompressor(busIdFrom);
    if (!has) return <MiniPreviewPlaceholder />;
    return <Preview busIdFrom={busIdFrom} />;
};
