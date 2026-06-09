// Requirements
import {
    useEffect, useMemo, useState, useCallback,
} from 'react';
import { searchNew } from '@magical-mixing/mixers';


// Exported
export const useSearch = () => {
    const search = useMemo(searchNew, []);

    const emptyArray = useMemo(() => [], []);
    const [found, setFound] = useState(emptyArray);

    // Functions
    const searchInIPPort = useCallback(async (ip, port, onFound, onNotFound) => {
        await search.inIPPort(ip, port, onFound, onNotFound);
    }, [search]);

    const searchStart = useCallback(async (ip, port) => {
        setFound([]);
        await search.start(ip, port);
    }, [search]);

    const searchStop = useCallback(async () => {
        await search.stop();
    }, [search]);

    const getFound = useCallback(async (ip, port) => {
        const d = await search.getFound(ip, port);
        return d;
    }, [search]);

    // On load. We don't make a copy because we know it's already one
    useEffect(() => {
        search.onUpdate(setFound);
        return () => { search.onUpdate(null); };
    }, [search]);

    return {
        found,
        searchInIPPort,
        searchStart,
        searchStop,
        getFound,
    };
};
