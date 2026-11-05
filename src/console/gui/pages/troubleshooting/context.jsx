// Requirements
import {
    createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import TroubleshootingDialog from './dialog';


// Variables
const TroubleshootingContext = createContext(null);


// Internal
const TroubleshootingProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const openTroubleshooting = useCallback(() => {
        setOpen(true);
    }, []);

    const closeTroubleshooting = useCallback(() => {
        setOpen(false);
    }, []);

    const value = useMemo(() => ({
        openTroubleshooting,
        closeTroubleshooting,
    }), [openTroubleshooting, closeTroubleshooting]);

    return (
        <TroubleshootingContext.Provider value={value}>
            { children }
            <TroubleshootingDialog open={open} onOpenChange={setOpen} />
        </TroubleshootingContext.Provider>
    );
};


const useTroubleshooting = () => {
    const context = useContext(TroubleshootingContext);
    if (!context) {
        throw new Error('useTroubleshooting must be used within TroubleshootingProvider');
    }
    return context;
};


// Exported
export { TroubleshootingProvider, useTroubleshooting };
