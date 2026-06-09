// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { getCurrentFeatures } from '../device/featuresBridge';
import { pathHas, pathSet } from './path';
import { pendingHasDoCount, waitForPendingHasDo } from './feature';


// Constants
const defaultOption = undefined;

const maxChangesRanBeforePause = 100;

const pause = 300; // milliseconds

const syncPendingPollMs = 50;


// Variables
const ChangesContextRoot = createContext({});


// Internal
const wait = milliseconds => new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
});


const measureSyncPending = () => {
    const features = getCurrentFeatures();
    const queue = features?.sendQueueOutstanding?.() ?? 0;
    return pendingHasDoCount() + queue;
};


// Exported
export { defaultOption };


export const ChangesContext = ({ children }) => {
    const changesScheduled = useRef([]);
    const changesRunning = useRef(false);
    const changesRan = useRef(0);
    const changesOnComplete = useRef(null);
    const pathHasPending = useRef(0);
    const pathHasFlushResolve = useRef(null);
    const [changesRemaining, setChangesRemaining] = useState(0);
    const [changesTotal, setChangesTotal] = useState(0);
    const [batchTotal, setBatchTotal] = useState(0);
    const [syncPending, setSyncPending] = useState(0);
    const [awaitingDesk, setAwaitingDesk] = useState(false);

    const state = useMemo(() => ({
        changesScheduled,
        changesRunning,
        changesRan,
        pathHasPending,
        pathHasFlushResolve,
        changesRemaining,
        setChangesRemaining,
        changesTotal,
        setChangesTotal,
        batchTotal,
        setBatchTotal,
        syncPending,
        setSyncPending,
        changesOnComplete,
        awaitingDesk,
        setAwaitingDesk,
    }), [changesRemaining, changesTotal, batchTotal, syncPending, awaitingDesk]);

    return (
        <ChangesContextRoot.Provider value={state}>
            {children}
        </ChangesContextRoot.Provider>
    );
};


export const useChanges = () => {
    const {
        changesScheduled, changesRunning, changesRan,
        pathHasPending, pathHasFlushResolve,
        changesRemaining, setChangesRemaining,
        changesTotal, setChangesTotal,
        batchTotal, setBatchTotal,
        syncPending, setSyncPending,
        changesOnComplete,
        awaitingDesk, setAwaitingDesk,
    } = useContext(ChangesContextRoot);

    useEffect(() => {
        if (changesTotal <= 0 && !awaitingDesk) {
            setSyncPending(0);
            return undefined;
        }

        const tick = () => setSyncPending(measureSyncPending());
        tick();
        const id = setInterval(tick, syncPendingPollMs);
        return () => clearInterval(id);
    }, [changesTotal, awaitingDesk, setSyncPending]);

    const flushPathHas = useCallback(() => new Promise((resolve) => {
        if (pathHasPending.current === 0) {
            resolve();
            return;
        }
        pathHasFlushResolve.current = resolve;
    }), [pathHasPending, pathHasFlushResolve]);

    const changeSchedule = useCallback((feature, change) => {
        if (typeof feature !== 'object' || !change || !Array.isArray(change)) return;
        pathHasPending.current += 1;
        pathHas(feature, change[0], (has) => {
            pathHasPending.current -= 1;
            if (has) changesScheduled.current.push({ feature, change });
            if (pathHasPending.current === 0 && pathHasFlushResolve.current) {
                pathHasFlushResolve.current();
                pathHasFlushResolve.current = null;
            }
        });
    }, [changesScheduled, pathHasFlushResolve, pathHasPending]);

    const changesRunNext = useCallback(async (myself) => {
        if (!changesScheduled.current.length) {
            if (changesRunning.current) changesRunning.current = false;
            setChangesTotal(0);
            setChangesRemaining(0);
            if (changesOnComplete.current) changesOnComplete.current();
            changesOnComplete.current = null;
            return;
        }
        if (!myself && changesRunning.current) return;

        if (!myself) {
            changesRunning.current = true;
            const pending = changesScheduled.current.length;
            setBatchTotal(pending);
            setChangesTotal(pending);
            setChangesRemaining(pending);
        }

        const { feature, change } = changesScheduled.current.shift();
        setChangesRemaining(changesScheduled.current.length);
        try {
            if (changesRan.current === maxChangesRanBeforePause) {
                await wait(pause);
                changesRan.current = 0;
            } else {
                changesRan.current += 1;
            }
            pathSet(feature, change);
        } catch (e) {
            console.error('Failed change', { change, error: e.message });
        }

        await changesRunNext(true);
    }, [
        changesScheduled, changesRunning, changesRan,
        setChangesRemaining, setChangesTotal, changesOnComplete, setBatchTotal,
    ]);

    const changesSchedule = useCallback((feature, changes) => {
        if (typeof feature !== 'object' || !changes || !Array.isArray(changes)) return;
        changes.forEach((change) => {
            changeSchedule(feature, change);
        });
    }, [changeSchedule]);

    const changesRun = useCallback((onComplete) => {
        changesOnComplete.current = onComplete || null;
        if (!changesScheduled.current.length) {
            if (onComplete) onComplete();
            return;
        }
        setTimeout(changesRunNext);
    }, [changesScheduled, changesRunNext, changesOnComplete]);

    const changesRunAsync = useCallback(() => new Promise((resolve) => {
        changesRun(resolve);
    }), [changesRun]);

    const runScheduled = useCallback(async (schedule) => {
        schedule(changeSchedule);
        await flushPathHas();
        await changesRunAsync();

        const features = getCurrentFeatures();
        if (!features) return;

        setAwaitingDesk(true);
        try {
            await waitForPendingHasDo();
            if (features.sendQueueDrained) await features.sendQueueDrained();
            if (features.cacheRefetch) features.cacheRefetch({ purgeFrozen: true });
        } finally {
            setAwaitingDesk(false);
            setBatchTotal(0);
        }
    }, [
        changeSchedule, changesRunAsync, flushPathHas,
        setAwaitingDesk, setBatchTotal,
    ]);

    return {
        changeSchedule,
        changesSchedule,
        changesRun,
        changesRunAsync,
        runScheduled,
        changesRemaining,
        changesTotal,
        batchTotal,
        syncPending,
        awaitingDesk,
    };
};

