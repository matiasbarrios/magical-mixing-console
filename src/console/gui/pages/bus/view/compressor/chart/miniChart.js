// Requirements
import { line, scaleLinear, select } from 'd3';
import { COLORS } from './constants';
import { getResultPoints } from './result';


// Constants
const PADDING = 2;


// Internal
const removeAnySVG = e => select(e).selectAll('svg').remove();


const centerPoints = dbMinimum => [
    [dbMinimum, dbMinimum],
    [0, 0],
];


// Exported
export const createMiniChart = (e, dbMinimum, dbMaximum) => {
    removeAnySVG(e);

    const width = e.clientWidth;
    const height = e.clientHeight;

    const svg = select(e)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xScale = scaleLinear()
        .domain([dbMinimum, dbMaximum])
        .range([PADDING, width - PADDING]);

    const yScaleLeft = scaleLinear()
        .domain([dbMinimum, dbMaximum])
        .range([height - PADDING, PADDING]);

    const centerLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]));

    svg.append('path')
        .attr('id', 'compLineCenter')
        .attr('fill', 'none')
        .attr('stroke', COLORS.center)
        .attr('stroke-dasharray', '3 2')
        .attr('stroke-opacity', 0.7)
        .attr('stroke-width', 1)
        .attr('d', centerLine(centerPoints(dbMinimum)));

    const resultLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]));

    const resultContainer = svg.append('g');
    resultContainer.append('path')
        .attr('id', 'compLineResult')
        .attr('fill', 'none')
        .attr('stroke', COLORS.result)
        .attr('stroke-opacity', 0.85)
        .attr('stroke-width', 1.5)
        .attr('d', resultLine([]));

    return {
        width,
        height,
        xScale,
        yScaleLeft,
        dbMinimum,
        dbMaximum,
        resultContainer,
        resultLine,
        created: true,
        disabled: false,
    };
};


export const updateMiniChart = (chart, parameters) => {
    if (!chart?.created) return;

    const points = getResultPoints(chart, parameters);

    chart.resultContainer.select('#compLineResult')
        .data([points])
        .attr('d', chart.resultLine)
        .attr('opacity', chart.disabled ? 0.45 : 1);
};

export const setMiniChartDisabled = (chart, disabled) => {
    if (!chart?.created) return;
    chart.disabled = disabled;
};
