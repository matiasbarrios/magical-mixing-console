// Requirements
import {
    useCallback, useEffect, useLayoutEffect, useMemo, useRef,
} from 'react';
import {
    useBusEqualizerOn,
    useBusEqualizerParametric,
    useBusEqualizerParametricFrequency,
    useBusEqualizerParametricGain,
    useBusEqualizerParametricOn,
    useBusEqualizerParametricOptions,
    useBusEqualizerParametricQ,
    useBusEqualizerParametricType,
    useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import { createMiniChart, setMiniChartDisabled, updateMiniChart } from '../../equalizer/parametric/miniChart';
import { PREVIEW_EQ_ROAM_ID } from '../../../../../helpers/hotkeys/focusRoam';
import { MINI_PREVIEW_CHART_STYLE, MiniPreviewContainer, MiniPreviewPlaceholder } from './miniPreviewContainer';
import { useProcessingPreview } from './previewDialog';


// Internal
const ParameterSync = ({
    busId, parameter, onUpdated,
}) => {
    const { parameterId } = parameter;

    const { has: typeHas, value: type, options: typeOptions } = useBusEqualizerParametricType(busId, parameterId);
    const { has: onHas, value: on } = useBusEqualizerParametricOn(busId, parameterId);
    const {
        has: frequencyHas, value: frequency, minimum, maximum,
    } = useBusEqualizerParametricFrequency(busId, parameterId);
    const { has: qHas, value: q } = useBusEqualizerParametricQ(busId, parameterId);
    const { has: gainHas, value: gain } = useBusEqualizerParametricGain(busId, parameterId);

    useEffect(() => {
        parameter.type = typeHas ? typeOptions?.find(t => t.id === type)?.preset : undefined;
        parameter.on = onHas ? on : true;
        parameter.frequency = frequencyHas ? frequency : undefined;
        parameter.frequencyMinimum = minimum;
        parameter.frequencyMaximum = maximum;
        parameter.q = qHas ? q : undefined;
        parameter.gain = gainHas ? gain : undefined;
        onUpdated();
    }, [
        parameter, onUpdated,
        typeHas, type, typeOptions,
        onHas, on,
        frequencyHas, frequency, minimum, maximum,
        qHas, q,
        gainHas, gain,
    ]);

    return null;
};


const Preview = ({ busIdFrom }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { options } = useBusEqualizerParametricOptions(busIdFrom);
    const { has: onHas, value: on } = useBusEqualizerOn(busIdFrom);
    const inactive = useMemo(() => onHas && !on, [onHas, on]);
    const { openPreview } = useProcessingPreview();

    const chartRef = useRef(null);
    const parametersRef = useRef([]);
    const containerRef = useRef(null);

    const parameters = useMemo(() => options.map(o => ({
        parameterId: o.id,
        type: undefined,
        frequency: undefined,
        q: undefined,
        gain: undefined,
        on: true,
    })), [options]);

    useEffect(() => {
        parametersRef.current = parameters;
    }, [parameters]);

    const refreshChart = useCallback(() => {
        if (!chartRef.current?.created) return;
        updateMiniChart(chartRef.current, parametersRef.current);
    }, []);

    const createChart = useCallback(() => {
        if (!containerRef.current) return;
        chartRef.current = createMiniChart(containerRef.current);
        refreshChart();
    }, [refreshChart]);

    useLayoutEffect(() => {
        createChart();
        return () => {
            chartRef.current = null;
        };
    }, [busIdFrom, createChart]);

    useEffect(() => {
        window.addEventListener('resize', createChart);
        return () => window.removeEventListener('resize', createChart);
    }, [createChart]);

    useEffect(() => {
        if (!chartRef.current?.created) return;
        setMiniChartDisabled(chartRef.current, inactive || disabled);
        refreshChart();
    }, [inactive, disabled, refreshChart]);

    const onOpen = useCallback((e) => {
        e.stopPropagation();
        openPreview({ busId: busIdFrom, section: 'eq' });
    }, [busIdFrom, openPreview]);

    return (
        <>
            <MiniPreviewContainer
                aria-label={t('Equalizer')}
                onClick={onOpen}
                disabled={disabled}
                opacity={inactive || disabled ? 0.5 : 1}
                focusRoam={PREVIEW_EQ_ROAM_ID}
            >
                <div ref={containerRef} style={MINI_PREVIEW_CHART_STYLE} />
            </MiniPreviewContainer>
            {parameters.map(parameter => (
                <ParameterSync
                    key={parameter.parameterId}
                    busId={busIdFrom}
                    parameter={parameter}
                    onUpdated={refreshChart}
                />
            ))}
        </>
    );
};


// Exported
export default ({ busIdFrom }) => {
    const { has } = useBusEqualizerParametric(busIdFrom);
    if (!has) return <MiniPreviewPlaceholder />;
    return <Preview busIdFrom={busIdFrom} />;
};
