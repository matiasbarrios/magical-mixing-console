// Requirements
import { scaleLinear } from 'd3';
import { RTA_DB_MAXIMUM, RTA_DB_MINIMUM, SPECTRUM_LENGTH } from './constants';


// Exported
export const spectrumColorScale = () => {
    // Define percentages as fractions:
    const greenEnd = 0.5; // 50% → still green
    const yellowStart = 0.8; // 80% → yellow
    const redStart = 0.95; // 95% → red

    // Calculate thresholds dynamically:
    const greenEndValue = RTA_DB_MINIMUM + (RTA_DB_MAXIMUM - RTA_DB_MINIMUM) * greenEnd;
    const yellowStartValue = RTA_DB_MINIMUM + (RTA_DB_MAXIMUM - RTA_DB_MINIMUM) * yellowStart;
    const redStartValue = RTA_DB_MINIMUM + (RTA_DB_MAXIMUM - RTA_DB_MINIMUM) * redStart;

    const colorScale = scaleLinear()
        .domain([RTA_DB_MINIMUM, greenEndValue, yellowStartValue, redStartValue, RTA_DB_MAXIMUM])
        .range([
            '#30A46C', // Green 9
            '#30A46C', // Green 9
            '#FFE629', // Yellow 9
            '#E5484D', // Red 9
            '#E5484D', // Red 9
        ]);

    return colorScale;
};


export const updateSpectrum = (chart, points) => {
    const {
        spectrumContainer, xScale, yScaleRight, colorScale, width, height, rtaMin,
    } = chart;

    const cellWidth = points.length && points[0].length ? width / points[0].length : 0;
    const cellHeight = height / SPECTRUM_LENGTH;

    const pointsFinal = [];
    points.forEach((pointInTime, timeIndex) => {
        pointInTime.forEach((point) => {
            pointsFinal.push({
                x: point[0],
                y: timeIndex * (rtaMin / SPECTRUM_LENGTH), // rtaMin is negative already
                v: point[1],
            });
        });
    });

    const cells = spectrumContainer.selectAll('rect')
        .data(pointsFinal, d => `${d.x}-${d.y}`);

    // Update
    cells.attr('x', d => xScale(d.x))
        .attr('y', d => yScaleRight(d.y))
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', d => colorScale(d.v));

    // ENTER
    cells.enter()
        .append('rect')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScaleRight(d.y))
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', d => colorScale(d.v));

    // Exit
    cells.exit().remove();
};
