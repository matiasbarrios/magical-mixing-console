// Requirements
import {
    curveCardinal, easeLinear, transition, axisLeft,
    scaleLinear, axisBottom, scaleLog, select,
    axisRight,
} from 'd3';
import {
    COLORS,
    RTA_DB_MAXIMUM,
    RTA_DB_MINIMUM,
    EQ_DB_RANGE,
    FONT,
    FREQUENCY_MAX,
    FREQUENCY_MIN,
    TOP_MARGIN,
    X_AXIS_HEIGHT,
    X_MARGIN,
    Y_AXIS_LEFT_WIDTH,
    Y_AXIS_RIGHT_WIDTH,
} from './constants';
import { createRTA } from './rta';
import { spectrumColorScale } from './spectrum';


// Internal
const removeAnySVG = e => select(e)
    .selectAll('svg').remove();


const createSVG = (e) => {
    const svg = select(e)
        .append('svg')
        .attr('width', e.clientWidth)
        .attr('height', e.clientHeight);
    return {
        svg,
        width: e.clientWidth,
        height: e.clientHeight,
    };
};

const createClip = (chart) => {
    const { svg, width, height } = chart;
    svg.append('defs')
        .append('clipPath')
        .attr('id', 'eqClip')
        .append('rect')
        .attr('width', width - (X_MARGIN + Y_AXIS_LEFT_WIDTH) - (X_MARGIN + Y_AXIS_RIGHT_WIDTH))
        .attr('height', height - X_AXIS_HEIGHT - TOP_MARGIN)
        .attr('x', X_MARGIN + Y_AXIS_LEFT_WIDTH)
        .attr('y', 0);
};


const createXAxis = (chart) => {
    const { svg, width, height } = chart;
    const xScale = scaleLog()
        .domain([FREQUENCY_MIN, FREQUENCY_MAX])
        .range([X_MARGIN + Y_AXIS_LEFT_WIDTH, width - (X_MARGIN + Y_AXIS_RIGHT_WIDTH)]);

    const xAxiscale = axisBottom()
        .scale(xScale);
    const xAxis = svg.append('g')
        .attr('transform', `translate(0, ${height - X_AXIS_HEIGHT})`)
        .call(xAxiscale)
        .call(g => g.selectAll('.tick line')
            .attr('y1', 0)
            // Margin added because it was not translated
            // And all who use it are translated by it
            .attr('y2', 0 - (height - X_AXIS_HEIGHT) + TOP_MARGIN)
            .attr('stroke', COLORS.axis));
    xAxis.selectAll('.tick text')
        .attr('font-size', FONT.size)
        .attr('font-family', FONT.family)
        .style('fill', FONT.color)
        .style('fill-opacity', FONT.opacity);
    xAxis.selectAll('.domain')
        .attr('stroke-width', 0);

    chart.xScale = xScale;
};


const createYAxis = (chart) => {
    const {
        svg, width, height, dbRange, rtaMin,
    } = chart;

    const yScaleLeft = scaleLinear()
        .domain([-1 * dbRange, dbRange])
        .range([height - X_AXIS_HEIGHT - TOP_MARGIN, 0]);

    const yAxisLeftScale = axisLeft()
        .scale(yScaleLeft);
    const yAxisLeft = svg.append('g')
        .attr('transform', `translate(${X_MARGIN + Y_AXIS_LEFT_WIDTH}, ${TOP_MARGIN})`)
        .call(yAxisLeftScale)
        .call(g => g.selectAll('.tick line')
            .attr('x1', 0)
            .attr('x2', width - (X_MARGIN + Y_AXIS_LEFT_WIDTH) - (X_MARGIN + Y_AXIS_RIGHT_WIDTH))
            .attr('stroke', COLORS.axis));
    yAxisLeft.selectAll('.tick text')
        .attr('font-size', FONT.size)
        .attr('font-family', FONT.family)
        .style('fill', FONT.color)
        .style('fill-opacity', FONT.opacity);

    yAxisLeft.selectAll('.domain')
        .attr('stroke-width', 0);

    chart.yScaleLeft = yScaleLeft;

    const yScaleRight = scaleLinear()
        .domain([rtaMin, RTA_DB_MAXIMUM])
        .range([height - X_AXIS_HEIGHT - TOP_MARGIN, 0]);

    const yAxisRightScale = axisRight()
        .scale(yScaleRight);
    const yAxisRight = svg.append('g')
        .attr('transform', `translate(${width - X_MARGIN}, ${TOP_MARGIN})`) // It is drawn from right to left
        .call(yAxisRightScale);
    yAxisRight.selectAll('.tick text')
        .attr('font-size', FONT.size)
        .attr('font-family', FONT.family)
        .style('fill', FONT.color)
        .style('fill-opacity', FONT.opacity)
        .attr('text-anchor', 'end');
    yAxisRight.selectAll('.tick line')
        .attr('stroke-opacity', 0);
    yAxisRight.selectAll('.domain')
        .attr('stroke-width', 0);

    chart.yScaleRight = yScaleRight;
};


const createZeroLine = (chart) => {
    const { svg, width, height } = chart;
    chart.zeroLineY = Math.round((height - X_AXIS_HEIGHT - TOP_MARGIN) / 2);
    svg.append('g')
        .attr('transform', `translate(0, ${chart.zeroLineY + TOP_MARGIN})`)
        .append('line')
        .attr('x1', X_MARGIN + Y_AXIS_LEFT_WIDTH)
        .attr('x2', width - (X_MARGIN + Y_AXIS_RIGHT_WIDTH))
        .style('stroke', COLORS.zeroLine)
        .style('stroke-width', '1px');
};


const createContainer = (chart) => {
    const { svg } = chart;

    // This order is important for the z order
    chart.spectrumContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#eqClip)');
    chart.rtaContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#eqClip)');
    chart.areasContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#eqClip)');
    chart.linesContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#eqClip)');
    chart.resultContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#eqClip)');
    chart.pointsContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#eqClip)');
};


const createOther = (chart) => {
    chart.areaFade = () => transition().duration(350).ease(easeLinear);
    chart.lineCurve = curveCardinal.tension(0.3);
    chart.colorScale = spectrumColorScale();
};


// Exported
export const createChart = (e, dbRange = EQ_DB_RANGE, rtaMin = RTA_DB_MINIMUM) => {
    removeAnySVG(e);
    const chart = createSVG(e);
    chart.dbRange = dbRange;
    chart.rtaMin = rtaMin;
    createClip(chart);
    createXAxis(chart);
    createYAxis(chart);
    createZeroLine(chart);
    createContainer(chart);
    createOther(chart);
    createRTA(chart);
    chart.created = true;
    chart.disabled = false;
    chart.editable = true;
    return chart;
};


export const updateChart = (chart) => {
    let opacity = 1;
    if (!chart.editable) opacity = 0.3;
    else if (chart.disabled) opacity = 0.5;
    chart.pointsContainer
        .attr('opacity', opacity)
        .style('cursor', !chart.editable ? 'not-allowed' : 'default');
    chart.linesContainer.attr('opacity', opacity);
    chart.areasContainer.attr('opacity', opacity);
};
