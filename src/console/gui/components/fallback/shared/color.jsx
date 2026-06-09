// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { FallbackContextRoot } from '../context';


// Constants
const colorOptions = [
    { id: 'gray', name: 'Gray' },
    { id: 'gold', name: 'Gold' },
    { id: 'bronze', name: 'Bronze' },
    { id: 'brown', name: 'Brown' },
    { id: 'yellow', name: 'Yellow' },
    { id: 'amber', name: 'Amber' },
    { id: 'orange', name: 'Orange' },
    { id: 'tomato', name: 'Tomato' },
    { id: 'red', name: 'Red' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'crimson', name: 'Crimson' },
    { id: 'pink', name: 'Pink' },
    { id: 'plum', name: 'Plum' },
    { id: 'purple', name: 'Purple' },
    { id: 'violet', name: 'Violet' },
    { id: 'iris', name: 'Iris' },
    { id: 'indigo', name: 'Indigo' },
    { id: 'blue', name: 'Blue' },
    { id: 'cyan', name: 'Cyan' },
    { id: 'teal', name: 'Teal' },
    { id: 'jade', name: 'Jade' },
    { id: 'green', name: 'Green' },
    { id: 'grass', name: 'Grass' },
    { id: 'lime', name: 'Lime' },
    { id: 'mint', name: 'Mint' },
    { id: 'sky', name: 'Sky' },
];


const deviceColorToOptionId = {
    red: 'red',
    green: 'green',
    yellow: 'yellow',
    blue: 'blue',
    magenta: 'pink',
    cyan: 'cyan',
    white: 'gray',
    gray: 'gray',
    'red border': 'red',
    'green border': 'green',
    'yellow border': 'yellow',
    'blue border': 'blue',
    'magenta border': 'pink',
    'cyan border': 'cyan',
    'white border': 'gray',
};


// Internal
const colorOptionGet = id => colorOptions.find(c => c.id === id);


const deviceColorOptionGet = id => colorOptionGet(deviceColorToOptionId[id]);


// Exported
export { colorOptions };


export const useFallbackColors = (type) => {
    const { colors, setColors } = useContext(FallbackContextRoot);

    const colorGet = useCallback(id => colors[id], [colors]);

    const colorSet = useCallback((id, value) => {
        const n = { ...colors };
        n[id] = value;
        setColors(n);
    }, [colors, setColors]);

    const colorsReset = useCallback(() => {
        const n = { ...colors };
        Object.keys(n).forEach((k) => {
            if (k.startsWith(`${type}-`)) delete n[k];
        });
        setColors(n);
    }, [setColors, type, colors]);

    return { colorGet, colorSet, colorsReset };
};


export const useFallbackColor = (type, id) => {
    const { colorGet, colorSet } = useFallbackColors(type);

    const value = useMemo(() => colorGet(`${type}-${id}`) || null, [type, id, colorGet]);
    const set = useCallback(v => colorSet(`${type}-${id}`, v), [type, id, colorSet]);

    return { value, set };
};


export const useFallbackColorValueSet = (deviceColor, fallbackColor, defaultValue) => {
    const {
        has: deviceHas, value: deviceValue, set: deviceSet,
        options: deviceOptions, noneOption: deviceNoneOption,
    } = deviceColor;
    const { value: fallbackValue, set: fallbackSet } = fallbackColor;
    const value = useMemo(() => {
        let o = null;
        if (deviceHas === false || (deviceNoneOption && deviceValue === deviceNoneOption.id)) {
            o = colorOptionGet(fallbackValue);
        } else if (deviceOptions[deviceValue]) {
            o = deviceColorOptionGet(deviceOptions[deviceValue].name);
        }
        return o?.id || defaultValue || null;
    }, [deviceHas, deviceNoneOption, deviceValue, deviceOptions, defaultValue, fallbackValue]);

    const set = useCallback((id) => {
        fallbackSet(id);
        if (deviceHas && deviceNoneOption) {
            const found = deviceOptions.find(o => o.name === id);
            deviceSet(found ? found.id : deviceNoneOption.id);
        }
    }, [deviceHas, deviceNoneOption, deviceOptions, deviceSet, fallbackSet]);

    return { value, set };
};
