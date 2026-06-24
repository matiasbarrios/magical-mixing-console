// Requirements
import { line } from 'd3';
import { COLORS, DISCRETE_POINTS } from './constants';


// Constants
const ratios = {
    'Exp 2:1': 2,
    'Exp 3:1': 3,
    'Exp 4:1': 4,
};


// Internal
const outputGainGet = (inputGain, parameters) => {
    const { threshold, mode, range } = parameters;

    // Not ready
    if ([threshold, mode, range].includes(undefined)) return inputGain;

    // Expander mode
    if (['Exp 2:1', 'Exp 3:1', 'Exp 4:1'].includes(mode)) {
        const ratio = ratios[mode];

        // No attenuation
        if (inputGain > threshold) return inputGain;

        // Apply expansion
        const delta = inputGain - threshold;
        let outputGain = threshold + delta * ratio;

        // Calculate the actual attenuation (positive value)
        const attenuation = inputGain - outputGain;

        // Limit the attenuation to the maximum range
        if (attenuation > range) {
            outputGain = inputGain - range;
        }

        return outputGain;
    }

    // Gate mode
    if (mode === 'Gate') {
        if (inputGain > threshold) return inputGain;
        return inputGain - range;
    }

    // Ducker mode
    if (mode === 'Ducker') {
        if (inputGain > threshold) return inputGain - range;
        return inputGain;
    }

    return inputGain;
};


const getResultPoints = (chart, parameters) => {
    const { xScale, width } = chart;
    const points = [];
    for (let i = 0; i < DISCRETE_POINTS; i += 1) {
        const inputGain = xScale.invert((i * width) / DISCRETE_POINTS);
        const outputGain = outputGainGet(inputGain, parameters);
        points.push([inputGain, outputGain]);
    }
    return points;
};


export { getResultPoints };


// Exported
export const createResult = (chart, parameters) => {
    const {
        resultContainer, xScale, yScaleLeft,
    } = chart;

    const points = getResultPoints(chart, parameters);

    // Build the function for creating the line
    chart.resultLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]));

    // Creating the line
    resultContainer.selectAll('#gateLineResult')
        .data([points])
        .enter()
        .append('path')
        .attr('id', 'gateLineResult')
        .attr('fill', 'none')
        .attr('stroke', COLORS.result)
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 2)
        .attr('d', chart.resultLine);
};


export const updateResult = (chart, parameters) => {
    const { resultContainer, resultLine } = chart;

    const points = getResultPoints(chart, parameters);

    // Creating the line
    resultContainer.selectAll('#gateLineResult')
        .data([points])
        .attr('d', resultLine);
};
