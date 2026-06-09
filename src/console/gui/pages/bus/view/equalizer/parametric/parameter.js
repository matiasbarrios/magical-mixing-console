// Requirements
import {
    drag, area, line, select,
} from 'd3';
import {
    SAMPLE_RATE, DISCRETE_POINTS, FREQUENCY_MIN, FREQUENCY_MAX, COLORS,
} from './constants';
import { biquadFilterGet, gainAlwaysZero, noQNeeded } from './biquad';


// Internal
const getLineId = id => `eqParameterLine${id}`;


const getAreaId = id => `eqParameterArea${id}`;


const getPointId = id => `eqParameterPoint${id}`;


const pointDragged = (
    chart, parameter, onFrequencyGainChanged, event, d
) => {
    const isGainZero = gainAlwaysZero(parameter.type);

    // Ids
    const pointId = getPointId(parameter.parameterId);

    // Data
    const {
        pointsContainer, xScale, yScaleLeft, dbRange,
    } = chart;
    let { x, y } = event;

    // Calculate values
    let frequency = xScale.invert(event.x);
    let gain = isGainZero ? 0 : yScaleLeft.invert(event.y);

    // Ignore out of range values
    const frequencyMinimum = parameter.frequencyMinimum || FREQUENCY_MIN;
    const frequencyMaximum = parameter.frequencyMaximum || FREQUENCY_MAX;
    if (frequency < frequencyMinimum) {
        frequency = frequencyMinimum;
        x = xScale(frequency);
    } else if (frequency > frequencyMaximum) {
        frequency = frequencyMaximum;
        x = xScale(frequency);
    }

    if (gain < -dbRange) {
        gain = -dbRange;
        y = yScaleLeft(gain);
    } else if (gain > dbRange) {
        gain = dbRange;
        y = yScaleLeft(gain);
    }

    // Move the point
    d.x = x;
    d.y = y;
    pointsContainer.selectAll(`#${pointId}`)
        .attr('cx', x)
        .attr('cy', y);

    // Notify it
    parameter.frequency = frequency;
    parameter.gain = gain;
    onFrequencyGainChanged(parameter, { x, y });
};


const getPoints = (chart, parameter) => {
    const { xScale, width } = chart;
    const {
        type, frequency, q, gain,
    } = parameter;

    if (noQNeeded(type)
        ? [type, frequency, gain].includes(undefined)
        : [type, frequency, q, gain].includes(undefined)) return [];

    const frequencyToGain = biquadFilterGet({
        type,
        frequency,
        gain,
        q,
        sampleRate: SAMPLE_RATE,
    });

    // This is the total width we want the line and area to cover
    // Adjust it if some areas of the chart are not being reached by them
    const widthToCover = width;

    const data = [];
    for (let i = 0; i < DISCRETE_POINTS; i += 1) {
        const f = xScale.invert((i * widthToCover) / DISCRETE_POINTS);
        data.push([f, frequencyToGain(f)]);
    }

    return data;
};


const createParameter = (chart, parameter, onFrequencyGainChanged) => {
    const {
        linesContainer, areasContainer, pointsContainer,
        xScale, yScaleLeft, areaFade, lineCurve,
    } = chart;

    // Ids
    const lineId = getLineId(parameter.parameterId);
    const areaId = getAreaId(parameter.parameterId);
    const pointId = getPointId(parameter.parameterId);

    // Points
    const points = getPoints(chart, parameter);

    // Build the function for creating the line
    parameter.line = line()
        .x(d => xScale(d[0]))
        .y(d => yScaleLeft(d[1]))
        .curve(lineCurve);

    // Build the function for creating the area
    parameter.area = area()
        .x(d => xScale(d[0]))
        .y0(Math.round(chart.zeroLineY))
        .y1(d => yScaleLeft(d[1]))
        .curve(lineCurve);

    // Creating the line
    linesContainer.selectAll(`#${lineId}`)
        .data([points])
        .enter()
        .append('path')
        .attr('id', lineId)
        .attr('fill', 'none')
        .attr('stroke', COLORS.parameters[parameter.parameterId])
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', 2)
        .attr('d', parameter.line);

    // Creating the area
    const areaPath = areasContainer.selectAll(`#${areaId}`)
        .data([points])
        .enter()
        .append('path');
    areaPath.attr('id', areaId)
        .attr('fill', COLORS.parameters[parameter.parameterId])
        .attr('fill-opacity', 0.05)
        .on('mousemove', () => {
            areaPath.transition(areaFade).attr('fill-opacity', 0.15);
        })
        .on('mouseout', () => {
            areaPath.transition(areaFade).attr('fill-opacity', 0.05);
        })
        .attr('stroke-width', 0)
        .attr('d', parameter.area);

    // Creating the dot
    const notPrepared = [parameter.frequency, parameter.gain].includes(undefined);
    const dotCircle = pointsContainer.selectAll(`#${pointId}`)
        .data([notPrepared ? [FREQUENCY_MIN, 0] : [parameter.frequency, parameter.gain]])
        .enter()
        .append('circle');
    dotCircle.attr('id', pointId)
        .attr('fill', COLORS.parameters[parameter.parameterId])
        .attr('stroke', 'transparent')
        .attr('stroke-width', 12)
        .style('filter', 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.08))')
        .attr('r', notPrepared ? 0 : 5)
        .attr('cx', d => xScale(d[0]))
        .attr('cy', d => yScaleLeft(d[1]))
        .on('pointerdown', function onPointerDown() {
            if (parameter.frequency === undefined && parameter.gain === undefined) return;
            onFrequencyGainChanged(parameter, {
                x: parseFloat(select(this).attr('cx')),
                y: parseFloat(select(this).attr('cy')),
            });
        });

    // Making it draggable
    const pointCircle = pointsContainer.select(`#${pointId}`);
    pointCircle.call(drag().on('start', (event) => {
        if (!chart.editable || !parameter.on) return;
        areaPath.transition(areaFade).attr('fill-opacity', 0.1);
        event.on('drag', (...args) => pointDragged(chart, parameter, onFrequencyGainChanged, ...args));
    }).on('end', () => {
        areaPath.transition(areaFade).attr('fill-opacity', 0.05);
    }));

    // Flag it
    parameter.created = true;
};


export const updateParameter = (chart, parameter) => {
    // Get the line and area
    const {
        linesContainer, areasContainer, pointsContainer, xScale, yScaleLeft,
    } = chart;

    // Ids
    const lineId = getLineId(parameter.parameterId);
    const areaId = getAreaId(parameter.parameterId);
    const pointId = getPointId(parameter.parameterId);

    // Get the new points
    const points = getPoints(chart, parameter);

    // Assign the new data, apply the draw function
    linesContainer.selectAll(`#${lineId}`)
        .data([points])
        .attr('d', parameter.line);
    areasContainer.selectAll(`#${areaId}`)
        .data([points])
        .attr('d', parameter.area);

    const notPrepared = [parameter.frequency, parameter.gain].includes(undefined);
    pointsContainer.selectAll(`#${pointId}`)
        .data([notPrepared ? [FREQUENCY_MIN, 0] : [parameter.frequency, parameter.gain]])
        .attr('cx', d => xScale(d[0]))
        .attr('cy', d => yScaleLeft(d[1]))
        .attr('r', notPrepared ? 0 : 5);

    // On/off
    pointsContainer.selectAll(`#${pointId}`).attr('opacity', !parameter.on ? 0.5 : 1);
    linesContainer.selectAll(`#${lineId}`).attr('opacity', !parameter.on ? 0.5 : 1);
    areasContainer.selectAll(`#${areaId}`).attr('opacity', !parameter.on ? 0.5 : 1);
};


// Exported
export const createParameters = (chart, options, onFrequencyGainChanged) => {
    const parameters = options.map(f => ({
        parameterId: f.id,
        type: undefined,
        frequency: undefined,
        q: undefined,
        gain: undefined,
        on: true,
    }));

    parameters.forEach(parameter => createParameter(chart, parameter, onFrequencyGainChanged));

    return parameters;
};
