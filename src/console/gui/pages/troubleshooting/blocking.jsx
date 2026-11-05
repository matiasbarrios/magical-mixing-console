// Requirements
import {
    createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';


// Variables
const ReportContext = createContext(null);

const CountContext = createContext(0);


// Internal
const BlockingProvider = ({ children }) => {
    const [count, setCount] = useState(0);
    const idsRef = useRef(new Set());

    const report = useCallback((id, blocking) => {
        const ids = idsRef.current;
        const present = ids.has(id);
        if (blocking === present) return;
        if (blocking) ids.add(id);
        else ids.delete(id);
        setCount(ids.size);
    }, []);

    return (
        <ReportContext.Provider value={report}>
            <CountContext.Provider value={count}>
                { children }
            </CountContext.Provider>
        </ReportContext.Provider>
    );
};


const useBlockingCount = () => useContext(CountContext);


const useReportBlocking = (id, blocking) => {
    const report = useContext(ReportContext);

    useEffect(() => {
        if (!report) return undefined;
        report(id, blocking);
        return () => report(id, false);
    }, [report, id, blocking]);
};


// Exported
export { BlockingProvider, useBlockingCount, useReportBlocking };
