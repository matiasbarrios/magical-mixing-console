// Requirements
import {
    curveCardinal, line, scaleLinear, scaleLog, select,
} from 'd3';
import {
    COLORS, EQ_DB_RANGE, FREQUENCY_MAX, FREQUENCY_MIN,
} from './constants';
import { getResultPoints } from './result';


// Constants
const PADDING = 2;


// Internal
const removeAnySVG = e => select(e).selectAll('svg').remove();


// Exported
export const createMiniChart = (e, dbRange = EQ_DB_RANGE) => {
    removeAnySVG(e);

    const width = e.clientWidth;
    const height = e.clientHeight;

    const svg = select(e)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('line')
        .attr('x1', PADDING)
        .attr('x2', width - PADDING)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .attr('stroke', COLORS.zeroLine)
        .attr('stroke-width', 1);

    const xScale = scaleLog()
        .domain([FREQUENCY_MIN, FREQUENCY_MAX])
        .range([PADDING, width - PADDING]);

    const yScaleLeft = scaleLinear()
        .domain([-dbRange, dbRange])
        .range([height - PADDING, PADDING]);

    const lineCurve = curveCardinal.tension(0.3);
    const resultLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]))
        .curve(lineCurve);

    const resultContainer = svg.append('g');
    resultContainer.append('path')
        .attr('id', 'eqLineResult')
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
        resultContainer,
        resultLine,
        dbRange,
        created: true,
        disabled: false,
    };
};


export const updateMiniChart = (chart, parameters) => {
    if (!chart?.created) return;

    const points = getResultPoints(chart, parameters);

    chart.resultContainer.select('#eqLineResult')
        .data([points])
        .attr('d', chart.resultLine)
        .attr('opacity', chart.disabled ? 0.45 : 1);
};

export const setMiniChartDisabled = (chart, disabled) => {
    if (!chart?.created) return;
    chart.disabled = disabled;
};
