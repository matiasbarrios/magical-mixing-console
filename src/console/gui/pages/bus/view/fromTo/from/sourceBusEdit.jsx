// Requirements
import {
    createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import Edit from '../../edit';


// Variables
const SourceBusEditContext = createContext(null);


// Internal
const SourceBusEditHost = ({ busIdEditing, onEditClose }) => {
    if (busIdEditing === null) return null;

    return (
        <Edit busId={busIdEditing} open onOpenChange={onEditClose} />
    );
};


// Exported
export const SourceBusEditProvider = ({ children }) => {
    const [busIdEditing, setBusIdEditing] = useState(null);

    const openEdit = useCallback((busId) => {
        setBusIdEditing(busId);
    }, []);

    const closeEdit = useCallback(() => {
        setBusIdEditing(null);
    }, []);

    const value = useMemo(() => ({ openEdit }), [openEdit]);

    return (
        <SourceBusEditContext.Provider value={value}>
            { children }
            <SourceBusEditHost busIdEditing={busIdEditing} onEditClose={closeEdit} />
        </SourceBusEditContext.Provider>
    );
};


export const useSourceBusEdit = () => {
    const context = useContext(SourceBusEditContext);
    if (!context) {
        throw new Error('useSourceBusEdit must be used within SourceBusEditProvider');
    }
    return context;
};
