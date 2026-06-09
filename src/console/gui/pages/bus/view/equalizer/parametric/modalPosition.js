// Requirements
import {
    TOP_MARGIN, X_AXIS_HEIGHT, Y_AXIS_LEFT_WIDTH, Y_AXIS_RIGHT_WIDTH,
} from './constants';


// Constants
const MODAL_MARGIN = 15;
const MODAL_GAP = 8;
const POINT_HIT_RADIUS = 12;

const MODAL_DEFAULT_WIDTH = 106;
const MODAL_DEFAULT_WIDTH_Q = 222;
const MODAL_DEFAULT_HEIGHT = 50;


// Internal
const layoutPositionEqual = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.left === b.left && a.right === b.right && a.top === b.top;
};


const parameterModalLayoutEqual = layoutPositionEqual;


const computeParameterModalPosition = ({
    chart, position, modalWidth, modalHeight, qVisible, fixedVertical,
}) => {
    const defaultWidth = qVisible ? MODAL_DEFAULT_WIDTH_Q : MODAL_DEFAULT_WIDTH;
    const defaultHeight = MODAL_DEFAULT_HEIGHT;
    const divWidth = Math.max(modalWidth || defaultWidth, defaultWidth);
    const divHeight = Math.max(modalHeight || defaultHeight, defaultHeight);

    let right;
    let left = (position.x + Y_AXIS_LEFT_WIDTH - Math.round(divWidth / 2));
    if (left + divWidth + Y_AXIS_RIGHT_WIDTH + MODAL_MARGIN > chart.width) {
        left = chart.width - divWidth - Y_AXIS_RIGHT_WIDTH - MODAL_MARGIN;
        right = Y_AXIS_RIGHT_WIDTH + MODAL_MARGIN;
    }

    if (left < Y_AXIS_LEFT_WIDTH + MODAL_MARGIN) {
        left = Y_AXIS_LEFT_WIDTH + MODAL_MARGIN;
    }

    const plotTop = TOP_MARGIN + MODAL_MARGIN;
    const plotBottom = chart.height - X_AXIS_HEIGHT - MODAL_MARGIN;
    const pointY = position.y + TOP_MARGIN;

    if (fixedVertical) {
        let top = plotBottom - divHeight - Math.round(MODAL_MARGIN / 4);
        if (top < pointY + MODAL_MARGIN) {
            top = plotTop;
        }
        return {
            left: right === undefined ? left : undefined,
            right,
            top,
        };
    }

    const topBelow = pointY + POINT_HIT_RADIUS + MODAL_GAP;
    const topAbove = pointY - divHeight - POINT_HIT_RADIUS - MODAL_GAP;

    const fitsBelow = topBelow + divHeight <= plotBottom;
    const fitsAbove = topAbove >= plotTop;

    let top;
    if (fitsBelow) {
        top = topBelow;
    } else if (fitsAbove) {
        top = topAbove;
    } else {
        const spaceBelow = plotBottom - pointY;
        const spaceAbove = pointY - plotTop;
        if (spaceBelow >= spaceAbove) {
            top = Math.min(topBelow, plotBottom - divHeight);
        } else {
            top = Math.max(topAbove, plotTop);
        }
    }

    return {
        left: right === undefined ? left : undefined,
        right,
        top,
    };
};


export {
    MODAL_DEFAULT_WIDTH,
    MODAL_DEFAULT_WIDTH_Q,
    MODAL_DEFAULT_HEIGHT,
    parameterModalLayoutEqual,
    computeParameterModalPosition,
};
