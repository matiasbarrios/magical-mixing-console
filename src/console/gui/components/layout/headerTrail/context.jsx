// Requirements
import { createContext, useMemo, useState } from 'react';


// Variables
export const HeaderTrailContext = createContext({});


// Exported
export const HeaderTrailProvider = ({ children }) => {
    const emptyObject = useMemo(() => ({}), []);
    const [headerTrail, setHeaderTrail] = useState(emptyObject);

    const state = useMemo(() => ({
        headerTrail, setHeaderTrail,
    }), [headerTrail, setHeaderTrail]);

    return (
        <HeaderTrailContext.Provider value={state}>
            {children}
        </HeaderTrailContext.Provider>
    );
};
