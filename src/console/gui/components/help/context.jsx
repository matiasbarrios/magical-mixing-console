// Requirements
import {
    createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import HelpDialog from './helpDialog';


// Variables
const HelpContext = createContext(null);


// Exported
export const HelpProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const openHelp = useCallback(() => {
        setOpen(true);
    }, []);

    const closeHelp = useCallback(() => {
        setOpen(false);
    }, []);

    const value = useMemo(() => ({
        openHelp,
        closeHelp,
    }), [openHelp, closeHelp]);

    return (
        <HelpContext.Provider value={value}>
            { children }
            <HelpDialog open={open} onOpenChange={setOpen} />
        </HelpContext.Provider>
    );
};


export const useHelp = () => {
    const context = useContext(HelpContext);
    if (!context) {
        throw new Error('useHelp must be used within HelpProvider');
    }
    return context;
};
