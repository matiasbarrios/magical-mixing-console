// Requirements
import { area, line } from 'd3';
import {
    COLORS, DISCRETE_POINTS, SAMPLE_RATE,
} from './constants';
import { biquadFilterGet, noQNeeded } from './biquad';


// Internal
export const getResultPoints = (chart, parameters) => {
    const { xScale, width } = chart;
    if (Object.values(parameters).some(f => (noQNeeded(f.type)
        ? [f.type, f.frequency, f.gain].includes(undefined)
        : [f.type, f.frequency, f.q, f.gain].includes(undefined)))) {
        return [];
    }

    const frequencyToGains = Object.values(parameters)
        .filter(f => f.on)
        .map(f => biquadFilterGet({
            type: f.type,
            frequency: f.frequency,
            gain: f.gain,
            q: f.q,
            sampleRate: SAMPLE_RATE,
        }));

    const resultFrequencyToGain = f => frequencyToGains
        .reduce((g, frequencyToGain) => g + frequencyToGain(f), 0);

    // This is the total width we want the resulting line and area to cover
    // Adjust it if some areas of the chart are not being reached by them
    const widthToCover = width;

    const points = [];
    for (let i = 0; i < DISCRETE_POINTS; i += 1) {
        const frequency = xScale.invert((i * widthToCover) / DISCRETE_POINTS);
        points.push([frequency, resultFrequencyToGain(frequency)]);
    }
    return points;
};


export const createResult = (chart, parameters) => {
    const {
        resultContainer, xScale,
        yScaleLeft, zeroLineY, areaFade, lineCurve,
    } = chart;

    const points = getResultPoints(chart, parameters);

    // Build the function for creating the line
    chart.resultLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]))
        .curve(lineCurve);

    // Build the function for creating the line
    chart.resultArea = area()
        .x(d => xScale(d[0]))
        .y0(Math.round(zeroLineY))
        .y1(d => yScaleLeft(d[1]))
        .curve(lineCurve);

    // Creating the line
    resultContainer.selectAll('#eqLineResult')
        .data([points])
        .enter()
        .append('path')
        .attr('id', 'eqLineResult')
        .attr('fill', 'none')
        .attr('stroke', COLORS.result)
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 2)
        .attr('d', chart.resultLine);

    // Creating the area
    const areaPath = resultContainer.selectAll('#eqAreaResult')
        .data([points])
        .enter()
        .append('path');
    areaPath.attr('id', 'eqAreaResult')
        .attr('fill', COLORS.result)
        .attr('fill-opacity', 0.075)
        .on('mousemove', () => {
            areaPath.transition(areaFade).attr('fill-opacity', 0.15);
        })
        .on('mouseout', () => {
            areaPath.transition(areaFade).attr('fill-opacity', 0.075);
        })
        .attr('stroke-width', 0)
        .attr('d', chart.resultArea);
};


export const updateResult = (chart, parameters) => {
    const {
        resultContainer, resultLine, resultArea,
    } = chart;

    const points = getResultPoints(chart, parameters);

    // Creating the line
    resultContainer.selectAll('#eqLineResult')
        .data([points])
        .attr('d', resultLine);

    // Creating the area
    resultContainer.selectAll('#eqAreaResult')
        .data([points])
        .attr('d', resultArea);
};
