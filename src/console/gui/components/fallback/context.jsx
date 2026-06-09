// Requirements
import { createContext, useMemo, useState } from 'react';
import { useDeviceSettings } from '../global/settings';


// Variables
const Context = createContext({});


// Exported
export const FallbackContextRoot = Context;


export const FallbackContext = ({ children }) => {
    const emptyArray = useMemo(() => [], []);
    const emptyObject = useMemo(() => ({}), []);

    const [sortedIds, setSortedIds] = useDeviceSettings('bus-sorted', emptyArray);
    const [sortedBuses, setSortedBuses] = useState([]);

    const [icons, setIcons] = useDeviceSettings('icons', emptyObject);
    const [colors, setColors] = useDeviceSettings('colors', emptyObject);
    const [names, setNames] = useDeviceSettings('names', emptyObject);

    const [dcaOptions, setDcaOptions] = useDeviceSettings('dca-options', emptyArray);
    const [mgOptions, setMgOptions] = useDeviceSettings('mg-options', emptyArray);

    const state = useMemo(() => ({
        sortedIds,
        setSortedIds,
        sortedBuses,
        setSortedBuses,
        icons,
        setIcons,
        colors,
        setColors,
        names,
        setNames,
        dcaOptions,
        setDcaOptions,
        mgOptions,
        setMgOptions,
    }), [sortedIds, setSortedIds, sortedBuses, setSortedBuses, icons,
        setIcons, colors, setColors, names, setNames, dcaOptions, setDcaOptions,
        mgOptions, setMgOptions,
    ]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};
