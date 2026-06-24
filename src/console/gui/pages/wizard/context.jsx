// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router';
import { useBusOptions, useDevice, useDeviceReset } from '@magical-mixing/mixers-react';
import { useFallbackBusIcons } from '../../components/fallback/bus/icon';
import { useFallbackBusColors } from '../../components/fallback/bus/color';
import { useActiveDeviceScene } from '../../components/activeScene';
import { buildBusPath } from '../bus/view/useBusViewTab';
import SetupNewWizard from './setupNew';


// Variables
const SetupWizardContext = createContext(null);


// Internal
const FreshStartEffectsStub = ({ runFreshStartRef }) => {
    useEffect(() => {
        runFreshStartRef.current = () => {};
    }, [runFreshStartRef]);

    return null;
};


const FreshStartEffectsConnected = ({
    runFreshStartRef, setWizardOpen,
}) => {
    const navigate = useNavigate();
    const { mainOne } = useBusOptions();
    const { reset } = useDeviceReset();
    const { iconsReset } = useFallbackBusIcons();
    const { colorsReset } = useFallbackBusColors();
    const { clearLoadedScene } = useActiveDeviceScene();

    const onFreshStartComplete = useCallback(() => {
        iconsReset();
        colorsReset();
        if (mainOne) navigate(buildBusPath(mainOne.id, 'from'));
    }, [colorsReset, iconsReset, mainOne, navigate]);

    useEffect(() => {
        runFreshStartRef.current = ({ closeWizardFirst = false } = {}) => {
            if (closeWizardFirst) setWizardOpen(false);
            clearLoadedScene();
            reset({ onComplete: onFreshStartComplete });
        };
        return () => {
            runFreshStartRef.current = () => {};
        };
    }, [clearLoadedScene, onFreshStartComplete, reset, runFreshStartRef, setWizardOpen]);

    return null;
};


const FreshStartEffects = (props) => {
    const { deviceId } = useDevice();
    if (!deviceId) return <FreshStartEffectsStub {...props} />;
    return <FreshStartEffectsConnected {...props} />;
};


// Exported
export const SetupWizardProvider = ({ children }) => {
    const [wizardOpen, setWizardOpen] = useState(false);
    const runFreshStartRef = useRef(() => {});

    const openWizard = useCallback(() => {
        setWizardOpen(true);
    }, []);

    const closeWizard = useCallback(() => {
        setWizardOpen(false);
    }, []);

    const runFreshStart = useCallback((options) => {
        runFreshStartRef.current(options);
    }, []);

    const value = useMemo(() => ({
        wizardOpen,
        openWizard,
        closeWizard,
        runFreshStart,
    }), [wizardOpen, openWizard, closeWizard, runFreshStart]);

    return (
        <SetupWizardContext.Provider value={value}>
            { children }
            <SetupNewWizard open={wizardOpen} onOpenChange={setWizardOpen} />
            <FreshStartEffects
                runFreshStartRef={runFreshStartRef}
                setWizardOpen={setWizardOpen}
            />
        </SetupWizardContext.Provider>
    );
};


export const useSetupWizard = () => {
    const context = useContext(SetupWizardContext);
    if (!context) {
        throw new Error('useSetupWizard must be used within SetupWizardProvider');
    }
    return context;
};
