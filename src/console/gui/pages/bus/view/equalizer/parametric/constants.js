// Constants


// I doubled it because of the behaviour of pass filters in their limit
export const SAMPLE_RATE = 88200;


// Discrete points for curves
export const DISCRETE_POINTS = 100;


// X axis
export const X_MARGIN = 10;
export const X_AXIS_HEIGHT = 20;
export const FREQUENCY_MIN = 20;
export const FREQUENCY_MAX = 20000;


// Y axis
export const TOP_MARGIN = 10;
export const Y_AXIS_LEFT_WIDTH = 20;
export const Y_AXIS_RIGHT_WIDTH = 20;
export const EQ_DB_RANGE = 20;
export const RTA_DB_MINIMUM = -100;
export const RTA_DB_MAXIMUM = 0;


// Spectrum
export const SPECTRUM_LENGTH = 100;


// Colors
export const COLORS = {
    axis: 'var(--gray-a5)',
    zeroLine: 'var(--gray-a8)',
    parameters: {
        '0': '#94CE9A', // Grass 7
        '1': '#30A46C', // Green 9
        '2': '#8EC8F6', // Blue 7
        '3': '#0D74CE', // Blue 11
        '4': '#E4C767', // Yellow 7
        '5': '#E5484D', // Red 9
    },
    result: '#FFE629', // Yellow 9
    rtaLine: '#8D8D8D', // Gray 9
};


// Font
export const FONT = {
    size: '10px',
    color: 'var(--gray-a9)',
    family: 'var(--default-font-family)',
    opacity: 1,
};
