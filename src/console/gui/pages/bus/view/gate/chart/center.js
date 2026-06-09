// Requirements
import { line } from 'd3';
import { COLORS } from './constants';

// Exported
export const createCenter = (chart) => {
    const {
        centerContainer, xScale, yScaleLeft, dbMinimum,
    } = chart;

    // Create the points
    const points = [
        [dbMinimum, dbMinimum],
        [0, 0],
    ];

    // Build the function for creating the line
    chart.centerLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]));

    // Creating the line
    centerContainer.selectAll('#gateLineCenter')
        .data([points])
        .enter()
        .append('path')
        .attr('id', 'gateLineCenter')
        .attr('fill', 'none')
        .attr('stroke', COLORS.center)
        .attr('stroke-dasharray', '4 2')
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 2)
        .attr('d', chart.centerLine);
};
