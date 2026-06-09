// Requirements
import { easeLinear, line } from 'd3';
import { COLORS } from './constants';


// Internal
const getPoints = (chart, parameters) => {
    const { dbMinimum, dbMaximum } = chart;
    const { gainReduction, isOff } = parameters;

    if ([isOff, gainReduction].includes(undefined) || isOff) return [];

    return [
        [dbMinimum, dbMaximum],
        [dbMinimum, gainReduction],
    ];
};


// Exported
export const createGainReduction = (chart, parameters) => {
    const { gainReductionContainer, xScale, yScaleLeft } = chart;

    const points = getPoints(chart, parameters);

    // Build the function for creating the line
    chart.gainReductionLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]));

    // Creating the line
    gainReductionContainer.selectAll('#gateLineGainReduction')
        .data([points])
        .enter()
        .append('path')
        .attr('id', 'gateLineGainReduction')
        .attr('fill', 'none')
        .attr('stroke', COLORS.gainReduction)
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 10)
        .attr('d', chart.gainReductionLine);
};


export const updateGainReduction = (chart, parameters) => {
    const { gainReductionContainer, gainReductionLine } = chart;

    const points = getPoints(chart, parameters);

    gainReductionContainer.selectAll('#gateLineGainReduction')
        .data([points])
        .transition()
        .duration(150)
        .ease(easeLinear)
        .attr('d', gainReductionLine);
};
