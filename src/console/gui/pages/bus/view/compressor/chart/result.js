// Requirements
import { line } from 'd3';
import { COLORS, DISCRETE_POINTS } from './constants';


// Internal
const cubicHermiteSpline = ({
    inputGain, x1, y1, x2, y2, m1, m2,
}) => {
    const t = (inputGain - x1) / (x2 - x1);

    const h00 = (1 + 2 * t) * (1 - t) ** 2;
    const h10 = t * (1 - t) ** 2;
    const h01 = t ** 2 * (3 - 2 * t);
    const h11 = t ** 2 * (t - 1);

    return h00 * y1 + h10 * (x2 - x1) * m1 + h01 * y2 + h11 * (x2 - x1) * m2;
};


const outputGainGet = (inputGain, parameters) => {
    const {
        threshold, ratio, knee, mode, makeupGain,
    } = parameters;

    // Not ready
    if ([threshold, ratio, knee, makeupGain].includes(undefined)) return inputGain;

    // Soft knee
    const kneeStart = threshold - (knee / 2);
    const kneeEnd = threshold + (knee / 2);

    // Compressor mode
    if (mode === 'Compressor') {
        // Below threshold (and soft knee range)
        if (inputGain <= kneeStart) return inputGain + makeupGain;

        // Inside soft knee range
        if (inputGain <= kneeEnd) {
            return cubicHermiteSpline({
                inputGain,
                x1: kneeStart,
                y1: kneeStart,
                x2: kneeEnd,
                y2: threshold + ((kneeEnd - threshold) / ratio),
                m1: 1,
                m2: 1 / ratio,
            }) + makeupGain;
        }

        // Hard knee
        return threshold + ((inputGain - threshold) / ratio) + makeupGain;
    }

    // Expander mode
    if (mode === 'Expander') {
        if (inputGain >= kneeEnd) return inputGain + makeupGain;

        // Below threshold (and soft knee range)
        if (inputGain <= kneeStart) {
            return threshold + ((inputGain - threshold) * ratio) + makeupGain;
        }

        return cubicHermiteSpline({
            inputGain,
            x1: kneeStart,
            y1: threshold + ((kneeStart - threshold) * ratio),
            x2: kneeEnd,
            y2: kneeEnd,
            m1: ratio,
            m2: 1,
        }) + makeupGain;
    }

    // Otherwhise, the same, should not happen!
    return inputGain + makeupGain;
};


const getResultPoints = (chart, parameters) => {
    const { xScale, width } = chart;
    const points = [];
    for (let i = 0; i < DISCRETE_POINTS; i += 1) {
        const inputGain = xScale.invert((i * width) / DISCRETE_POINTS);
        const outputGain = outputGainGet(inputGain, parameters);
        points.push([inputGain, outputGain]);
    }
    return points;
};


export { getResultPoints };


export const createResult = (chart, parameters) => {
    const {
        resultContainer, xScale, yScaleLeft,
    } = chart;

    const points = getResultPoints(chart, parameters);

    // Build the function for creating the line
    chart.resultLine = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]));

    // Creating the line
    resultContainer.selectAll('#compLineResult')
        .data([points])
        .enter()
        .append('path')
        .attr('id', 'compLineResult')
        .attr('fill', 'none')
        .attr('stroke', COLORS.result)
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 2)
        .attr('d', chart.resultLine);
};


export const updateResult = (chart, parameters) => {
    const { resultContainer, resultLine } = chart;

    const points = getResultPoints(chart, parameters);

    // Creating the line
    resultContainer.selectAll('#compLineResult')
        .data([points])
        .attr('d', resultLine);
};
