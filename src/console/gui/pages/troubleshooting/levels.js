// Constants
const LEVEL_FLOOR_DB = -90;

const PAN_HARD = 80;

const GATE_CLOSED_DB = -1;


// Internal
const isLevelAtMinimum = (value, minimum) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return false;
    const floor = typeof minimum === 'number' ? minimum : LEVEL_FLOOR_DB;
    return value <= floor + 0.05;
};


const isPanHard = value => (
    typeof value === 'number' && Math.abs(value) >= PAN_HARD
);


const isGateClosed = value => (
    typeof value === 'number' && value < GATE_CLOSED_DB
);


const localInputForChannel = (bus, options) => {
    if (!bus || !options?.length) return undefined;
    return options.find(option => (
        (option.type === 'preamp' || option.type === 'line')
        && String(option.number) === String(bus.number)
    ));
};


// Exported
export {
    isLevelAtMinimum,
    isPanHard,
    isGateClosed,
    localInputForChannel,
};
