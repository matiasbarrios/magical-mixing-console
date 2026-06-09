// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo,
    useState,
} from 'react';
import { useBusFromOptions, useBusOptions, useBusToOn } from '@magical-mixing/mixers-react';
import { useDeviceSettings } from '../../global/settings';


// Variables
const Context = createContext({});


// Internal
const BusToSolo = ({ busId, soloId, setBusFromOn }) => {
    const { has, value: on } = useBusToOn(busId, soloId);
    useEffect(() => {
        setBusFromOn(busId, has && on);
    }, [has, on, setBusFromOn, busId]);
    return null;
};


// Exported
export const FooterContext = ({ children }) => {
    const [shown, setShown] = useDeviceSettings('footer-shown', false);
    const [mgShown, setMgShown] = useDeviceSettings('footer-mute-groups', 'auto');

    const { soloOne } = useBusOptions();
    const { options: busesFrom } = useBusFromOptions(soloOne.id);

    const emptyObject = useMemo(() => ({}), []);
    const [busesFromOn, setBusesFromOn] = useState(emptyObject);
    const soloOn = useMemo(() => Object.values(busesFromOn).some(on => !!on), [busesFromOn]);

    const setBusFromOn = useCallback((busId, on) => {
        setBusesFromOn(prev => ({ ...prev, [busId]: on }));
    }, []);

    const emptyObject2 = useMemo(() => ({}), []);
    const [overrideWithAction, setOverrideWithAction] = useState(emptyObject2);

    const state = useMemo(() => ({
        shown,
        setShown,
        soloOn,
        mgShown,
        setMgShown,
        overrideWithAction,
        setOverrideWithAction,
    }), [shown, setShown, soloOn, mgShown, setMgShown, overrideWithAction, setOverrideWithAction]);

    return (
        <Context.Provider value={state}>
            {busesFrom.map(bus => (
                <BusToSolo
                    key={bus.id}
                    busId={bus.id}
                    soloId={soloOne.id}
                    setBusFromOn={setBusFromOn}
                />
            ))}
            {children}
        </Context.Provider>
    );
};


export const useFooter = () => {
    const {
        shown, setShown, soloOn, mgShown, setMgShown,
        overrideWithAction, setOverrideWithAction,
    } = useContext(Context);

    const toggle = useCallback(() => { setShown(!shown); }, [shown, setShown]);
    const mgToggle = useCallback(() => { setMgShown(!mgShown); }, [mgShown, setMgShown]);

    const rendered = useMemo(() => shown || soloOn
        || !!overrideWithAction?.action, [shown, soloOn, overrideWithAction]);

    return {
        shown,
        toggle,
        soloOn,
        mgShown,
        mgToggle,
        overrideWithAction,
        setOverrideWithAction,
        rendered,
    };
};
