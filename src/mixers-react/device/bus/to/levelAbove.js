// Constants
/** Bottom 1% of the level range — at or below this, a level-only send is "off". */
const OFF_THRESHOLD_RATIO = 0.01;

/** Slider floor for an active level-only send — well above the off threshold (OSC rounding). */
const SLIDER_MINIMUM_RATIO = 0.10;


// Internal
const levelRange = (minimum, maximum) => maximum - minimum;


// Exported
export const busToLevelOffThreshold = (minimum, maximum) => (
    minimum + levelRange(minimum, maximum) * OFF_THRESHOLD_RATIO
);


export const busToLevelSliderMinimum = (minimum, maximum) => (
    minimum + levelRange(minimum, maximum) * SLIDER_MINIMUM_RATIO
);


/** Lowest level that still counts as an active level-only send — used when turning a send on. */
export const busToLevelDefaultOn = busToLevelSliderMinimum;


export const isBusToLevelAbove = (level, minimum, maximum) => (
    level !== undefined && level > busToLevelOffThreshold(minimum, maximum)
);


export const clampBusToLevelAbove = (level, minimum, maximum) => {
    if (level === undefined) return level;
    const threshold = busToLevelOffThreshold(minimum, maximum);
    if (level <= threshold) return busToLevelSliderMinimum(minimum, maximum);
    return level;
};
