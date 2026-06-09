// Requirements
import { area, easeLinear, line } from 'd3';
import { COLORS, FREQUENCY_MAX, X_AXIS_HEIGHT } from './constants';


// Exported
export const createRTA = (chart) => {
    const {
        rtaContainer, height,
        xScale, yScaleRight, lineCurve,
    } = chart;

    const points = [];

    // Build the function for creating the line
    chart.rtaLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleRight(d[1]))
        .curve(lineCurve);

    // Build the function for creating the area
    chart.rtaArea = area()
        .x(d => xScale(d[0]))
        .y0(height - X_AXIS_HEIGHT)
        .y1(d => yScaleRight(d[1]))
        .curve(lineCurve);

    // Creating the line
    rtaContainer.selectAll('#rta_line')
        .data([points])
        .enter()
        .append('path')
        .attr('id', 'rta_line')
        .attr('fill', 'none')
        .attr('stroke', COLORS.rtaLine)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', 2)
        .attr('d', chart.rtaLine);

    // Creating the area
    const areaPath = rtaContainer.selectAll('#rta_area')
        .data([points])
        .enter()
        .append('path');
    areaPath.attr('id', 'rta_area')
        .attr('fill', COLORS.rtaLine)
        .attr('fill-opacity', 0.15)
        .attr('stroke-width', 0)
        .attr('d', chart.rtaArea);
};


export const updateRTA = (chart, points) => {
    // Get the line and area
    const { rtaContainer } = chart;

    // Let's add one last point to complete the curve
    // Dunno if this is good or not...
    if (points.length && points[points.length - 1][0] < FREQUENCY_MAX) {
        points.push([FREQUENCY_MAX, points[points.length - 1][1]]);
    }

    // Assign the new data, apply the draw function
    rtaContainer.selectAll('#rta_line')
        .data([points])
        .transition()
        .duration(150)
        .ease(easeLinear)
        .attr('d', chart.rtaLine);
    rtaContainer.selectAll('#rta_area')
        .data([points])
        .transition()
        .duration(150)
        .ease(easeLinear)
        .attr('d', chart.rtaArea);
};
