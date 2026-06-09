// Requirements
import { createContext, useMemo, useState } from 'react';


// Variables
export const HeaderTrailContextState = createContext({});


// Exported
export const HeaderTrailContext = ({ children }) => {
    const emptyObject = useMemo(() => ({}), []);
    const [headerTrail, setHeaderTrail] = useState(emptyObject);

    const state = useMemo(() => ({
        headerTrail, setHeaderTrail,
    }), [headerTrail, setHeaderTrail]);

    return (
        <HeaderTrailContextState.Provider value={state}>
            {children}
        </HeaderTrailContextState.Provider>
    );
};
