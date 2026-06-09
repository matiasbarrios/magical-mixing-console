// Requirements
import {
    axisBottom, axisLeft, scaleLinear, select,
} from 'd3';
import {
    COLORS,
    FONT,
    TOP_MARGIN,
    X_AXIS_HEIGHT,
    Y_AXIS_LEFT_WIDTH,
    X_MARGIN,
} from './constants';


// Internal
const removeAnySVG = e => select(e)
    .selectAll('svg').remove();


const createSVG = (e, width, height) => {
    const svg = select(e)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    return {
        svg,
        width,
        height: height - 2, // Mystery! To avoid the axis to be cut. Borders maybe?
    };
};

const createClip = (chart) => {
    const { svg, width, height } = chart;

    const finalWidth = width - (X_MARGIN + Y_AXIS_LEFT_WIDTH) - X_MARGIN;
    const finalHeight = height - X_AXIS_HEIGHT - TOP_MARGIN;

    if (finalWidth < 0 || finalHeight < 0) return;

    svg.append('defs')
        .append('clipPath')
        .attr('id', 'compClip')
        .append('rect')
        .attr('width', finalWidth)
        .attr('height', finalHeight)
        .attr('x', X_MARGIN + Y_AXIS_LEFT_WIDTH)
        .attr('y', 0);
};


const createXAxis = (chart) => {
    const {
        svg, width, height, dbMinimum, dbMaximum,
    } = chart;
    const xScale = scaleLinear()
        .domain([dbMinimum, dbMaximum])
        .range([X_MARGIN + Y_AXIS_LEFT_WIDTH, width - X_MARGIN]);

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
        svg, width, height, dbMinimum, dbMaximum,
    } = chart;

    const yScaleLeft = scaleLinear()
        .domain([dbMinimum, dbMaximum])
        .range([height - X_AXIS_HEIGHT - TOP_MARGIN, 0]);

    const yAxisLeftScale = axisLeft()
        .scale(yScaleLeft);
    const yAxisLeft = svg.append('g')
        .attr('transform', `translate(${X_MARGIN + Y_AXIS_LEFT_WIDTH}, ${TOP_MARGIN})`)
        .call(yAxisLeftScale)
        .call(g => g.selectAll('.tick line')
            .attr('x1', 0)
            .attr('x2', width - (X_MARGIN + Y_AXIS_LEFT_WIDTH) - X_MARGIN)
            .attr('stroke', COLORS.axis));
    yAxisLeft.selectAll('.tick text')
        .attr('font-size', FONT.size)
        .attr('font-family', FONT.family)
        .style('fill', FONT.color)
        .style('fill-opacity', FONT.opacity);

    yAxisLeft.selectAll('.domain')
        .attr('stroke-width', 0);

    chart.yScaleLeft = yScaleLeft;
};


const createContainer = (chart) => {
    const { svg } = chart;
    chart.thresholdContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#compClip)');
    chart.centerContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#compClip)');
    chart.keyContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#compClip)');
    chart.resultContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#compClip)');
    chart.gainReductionContainer = svg.append('g')
        .attr('transform', `translate(0, ${TOP_MARGIN})`)
        .attr('clip-path', 'url(#compClip)');
};


// Exported
export const createChart = (e, dbMinimum, dbMaximum) => {
    removeAnySVG(e);
    const chart = createSVG(e, e.clientWidth, e.clientHeight);
    chart.dbMinimum = dbMinimum;
    chart.dbMaximum = dbMaximum;
    createClip(chart);
    createXAxis(chart);
    createYAxis(chart);
    createContainer(chart);
    chart.created = true;
    return chart;
};

