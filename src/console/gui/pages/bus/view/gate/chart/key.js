// Requirements
import { easeLinear, line } from 'd3';
import { COLORS } from './constants';


// Internal
const getPoints = (chart, parameters) => {
    const { dbMinimum } = chart;
    const { key, gainReduction, isOff } = parameters;

    if ([isOff, key, gainReduction].includes(undefined) || isOff) return [];

    const outputGain = key + gainReduction;
    return [
        [key, dbMinimum],
        [key, outputGain],
        [dbMinimum, outputGain],
    ];
};


// Exported
export const createKey = (chart, parameters) => {
    const { keyContainer, xScale, yScaleLeft } = chart;

    const points = getPoints(chart, parameters);

    // Build the function for creating the line
    chart.keyLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]));

    // Creating the line
    keyContainer.selectAll('#gateLineKey')
        .data([points])
        .enter()
        .append('path')
        .attr('id', 'gateLineKey')
        .attr('fill', 'none')
        .attr('stroke', COLORS.key)
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 2)
        .attr('d', chart.keyLine);
};


export const updateKey = (chart, parameters) => {
    const { keyContainer, keyLine } = chart;

    const points = getPoints(chart, parameters);

    keyContainer.selectAll('#gateLineKey')
        .data([points])
        .transition()
        .duration(150)
        .ease(easeLinear)
        .attr('d', keyLine);
};
