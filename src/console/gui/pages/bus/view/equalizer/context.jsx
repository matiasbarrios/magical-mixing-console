import {
    createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import { useDeviceSettings } from '../../../../components/global/settings';
import { EQ_DB_RANGE, RTA_DB_MINIMUM } from './parametric/constants';


// Variables
const Context = createContext({});


// Exported
export const EqualizerProvider = ({ children }) => {
    const [rtaOn, setRtaOn] = useState(false);
    const [rtaMin, setRtaMin] = useDeviceSettings('bus-equalizer-rta-min', RTA_DB_MINIMUM);
    const [spectrumActive, setSpectrumActive] = useState(false);
    const [dbRange, setDbRange] = useDeviceSettings('bus-equalizer-db-range', EQ_DB_RANGE);

    const state = useMemo(() => ({
        rtaOn,
        setRtaOn,
        rtaMin,
        setRtaMin,
        dbRange,
        setDbRange,
        spectrumActive,
        setSpectrumActive,
    }), [rtaOn, setRtaOn, rtaMin, setRtaMin, dbRange, setDbRange,
        spectrumActive, setSpectrumActive]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};


export const useEqualizer = () => {
    const {
        rtaOn, setRtaOn, rtaMin, setRtaMin, dbRange,
        setDbRange, spectrumActive, setSpectrumActive,
    } = useContext(Context);

    const spectrumActiveToggle = useCallback(() => {
        setSpectrumActive(!spectrumActive);
    }, [setSpectrumActive, spectrumActive]);

    return {
        rtaOn,
        setRtaOn,
        rtaMin,
        setRtaMin,
        dbRange,
        setDbRange,
        spectrumActive,
        setSpectrumActive,
        spectrumActiveToggle,
    };
};

