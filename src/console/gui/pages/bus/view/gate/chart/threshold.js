// Requirements
import { drag } from 'd3';
import {
    COLORS, TOP_MARGIN, X_AXIS_HEIGHT, FONT,
    Y_AXIS_LEFT_WIDTH,
    X_MARGIN,
    THRESHOLD_MARGIN,
} from './constants';


// Internal
const pointDragged = (chart, onThresholdChanged, event) => {
    // Data
    const {
        height, xScale, dbMinimum, dbMaximum, thresholdContainer,
    } = chart;
    let { x } = event;

    // Calculate values
    let threshold = xScale.invert(event.x);

    // Ignore out of range values
    if (threshold < dbMinimum) {
        threshold = dbMinimum;
        x = xScale(threshold);
    } else if (threshold > dbMaximum) {
        threshold = dbMaximum;
        x = xScale(threshold);
    }

    // Move the point group
    const thresholdButtonY = ((height + TOP_MARGIN) / 2) - X_AXIS_HEIGHT;
    thresholdContainer.selectAll('#gateThresholdButton')
        .attr('transform', `translate(${x}, ${thresholdButtonY})`);

    onThresholdChanged(threshold);
};


// Exported
export const createOrUpdateThreshold = (chart, parameters, onThresholdChanged, label) => {
    const {
        xScale, height, thresholdCreated, thresholdContainer,
    } = chart;
    const { threshold } = parameters;

    if (threshold === undefined) return;

    const thresholdButtonY = ((height + TOP_MARGIN) / 2) - X_AXIS_HEIGHT;

    const x = xScale(threshold);

    if (thresholdCreated) {
        thresholdContainer.select('#gateThreshold')
            .attr('transform', `translate(${x}, 0)`)
            .select('line')
            .attr('y1', 0)
            .attr('y2', height - TOP_MARGIN - X_AXIS_HEIGHT);

        // Update the threshold button position
        thresholdContainer.select('#gateThresholdButton')
            .attr('transform', `translate(${x}, ${thresholdButtonY})`)
            .style('cursor', parameters.disabled ? 'not-allowed' : 'default');

        // Update the threshold label
        thresholdContainer
            .select('#gateThreshold text')
            .text(label)
            .attr('y', x < FONT.thresholdTextLineHeight + X_MARGIN + Y_AXIS_LEFT_WIDTH
                ? THRESHOLD_MARGIN : -FONT.thresholdTextLineHeight)
            .style('fill', parameters.disabled ? COLORS.thresholdDisabled : COLORS.thresholdText);

        // Update the icon color
        thresholdContainer
            .select('#gateThresholdButton path')
            .attr('fill', parameters.disabled ? COLORS.thresholdDisabled : COLORS.thresholdButtonText);

        return;
    }

    // Creating the line
    const thresholdGroup = thresholdContainer.append('g')
        .attr('id', 'gateThreshold')
        .attr('transform', `translate(${x}, 0)`);

    thresholdGroup.append('line')
        .attr('y1', 0)
        .attr('y2', height - TOP_MARGIN - X_AXIS_HEIGHT)
        .attr('data-accent-color', 'gray')
        .style('stroke', COLORS.thresholdLine)
        .style('stroke-width', '1px');

    // Add vertical text label
    thresholdGroup.append('text')
        .attr('x', -THRESHOLD_MARGIN)
        .attr('y', x < FONT.thresholdTextLineHeight + X_MARGIN + Y_AXIS_LEFT_WIDTH
            ? THRESHOLD_MARGIN : -FONT.thresholdTextLineHeight)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'hanging')
        .attr('transform', 'rotate(-90, 0, 0)')
        .style('font-family', FONT.family)
        .style('font-size', FONT.size)
        .attr('data-accent-color', 'gray')
        .style('fill', parameters.disabled ? COLORS.thresholdDisabled : COLORS.thresholdText)
        .text(label);

    // Creating the dot
    const dotGroup = thresholdContainer.selectAll('#gateThresholdButton')
        .data([[threshold, threshold]])
        .enter()
        .append('g');

    dotGroup.attr('id', 'gateThresholdButton')
        .attr('transform', d => `translate(${xScale(d[0])}, ${thresholdButtonY})`)
        .style('cursor', parameters.disabled ? 'not-allowed' : 'default');

    // Making it draggable
    const pointElement = thresholdContainer.select('#gateThresholdButton');
    pointElement.call(drag().on('start', (event) => {
        if (parameters.disabled) return;
        event.on('drag', (...args) => pointDragged(chart, onThresholdChanged, ...args));
    }));

    // Add the circle
    dotGroup.append('circle')
        .attr('data-accent-color', 'gray')
        .attr('fill', COLORS.thresholdButtonBackground)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 12)
        .style('filter', 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.08))')
        .attr('r', 12);

    // Drag icons
    const iconGroup = dotGroup.append('g');
    iconGroup.append('path')
        .attr('d', 'M3.31812 5.818C3.49386 5.64227 3.49386 5.35734 3.31812 5.18161C3.14239 5.00587 2.85746 5.00587 2.68173 5.18161L0.681729 7.18161C0.505993 7.35734 0.505993 7.64227 0.681729 7.818L2.68173 9.818C2.85746 9.99374 3.14239 9.99374 3.31812 9.818C3.49386 9.64227 3.49386 9.35734 3.31812 9.18161L2.08632 7.9498H5.50017C5.7487 7.9498 5.95017 7.74833 5.95017 7.4998C5.95017 7.25128 5.7487 7.0498 5.50017 7.0498H2.08632L3.31812 5.818ZM12.3181 5.18161C12.1424 5.00587 11.8575 5.00587 11.6817 5.18161C11.506 5.35734 11.506 5.64227 11.6817 5.818L12.9135 7.0498H9.50017C9.25164 7.0498 9.05017 7.25128 9.05017 7.4998C9.05017 7.74833 9.25164 7.9498 9.50017 7.9498H12.9135L11.6817 9.18161C11.506 9.35734 11.506 9.64227 11.6817 9.818C11.8575 9.99374 12.1424 9.99374 12.3181 9.818L14.3181 7.818C14.4939 7.64227 14.4939 7.35734 14.3181 7.18161L12.3181 5.18161Z')
        .attr('data-accent-color', 'gray')
        .attr('fill', parameters.disabled ? COLORS.thresholdDisabled : COLORS.thresholdButtonText)
        .attr('transform', 'translate(-7.5, -7.5)');

    chart.thresholdCreated = true;
};
