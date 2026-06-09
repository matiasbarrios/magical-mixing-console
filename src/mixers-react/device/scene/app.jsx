// Requirements
import {
    createContext, useCallback, useContext, useMemo, useRef, useState,
} from 'react';
import { hasCall, hasGetOnlyOnce } from '../../helpers/feature';
import { pathGet } from '../../helpers/path';
import { DeviceContextRoot } from '..';
import { useChanges } from '../../helpers/changes';
import { APP_SCENE_PATH_PREFIXES, runAppSceneCaptureDiscovery } from './capturePaths';


// Constants
const CAPTURE_CONCURRENCY = 12;
const CAPTURE_RETRY_ROUNDS = 3;
const CAPTURE_RETRY_DELAY = 500;
const PATH_FETCH_TIMEOUT = 15 * 1000;
const CAPTURE_WATCHDOG = 60 * 1000;


// Variables
const ContextRoot = createContext({});


// Exported
export const SceneAppContext = ({ children }) => {
    const runningCheckTimer = useRef(null);
    const runningLastUpdate = useRef(null);
    const pathsToGet = useRef({});
    const valuesCaptured = useRef([]);

    const [running, setRunning] = useState(false);
    const [remaining, setRemaining] = useState(0);
    const [captureTotal, setCaptureTotal] = useState(0);
    const [captureCompleted, setCaptureCompleted] = useState(0);

    const state = useMemo(() => ({
        runningCheckTimer,
        runningLastUpdate,
        pathsToGet,
        running,
        setRunning,
        valuesCaptured,
        remaining,
        setRemaining,
        captureTotal,
        setCaptureTotal,
        captureCompleted,
        setCaptureCompleted,
    }), [running, valuesCaptured, remaining, captureTotal, captureCompleted]);

    return (
        <ContextRoot.Provider value={state}>
            {children}
        </ContextRoot.Provider>
    );
};


export const useSceneApp = () => {
    const { features } = useContext(DeviceContextRoot);
    const {
        runningCheckTimer, runningLastUpdate, running, setRunning, pathsToGet,
        valuesCaptured, remaining, setRemaining,
        captureTotal, setCaptureTotal, captureCompleted, setCaptureCompleted,
    } = useContext(ContextRoot);
    const { runScheduled } = useChanges();

    const capture = useCallback((onComplete) => {
        if (runningCheckTimer.current !== null) return;

        setRunning(true);
        setRemaining(0);
        setCaptureTotal(0);
        setCaptureCompleted(0);
        valuesCaptured.current = [];
        pathsToGet.current = {};

        const pathQueue = [];
        const failedPaths = [];
        let activeGets = 0;
        let pendingDiscovery = 0;
        let retryRound = 0;
        let finishing = false;

        const onCompleteFinal = async () => {
            valuesCaptured.current.sort((a, b) => a[0].localeCompare(b[0]));
            const values = valuesCaptured.current.reduce((acc, [path, value]) => {
                acc[path] = value;
                return acc;
            }, {});
            if (onComplete) await onComplete(values);
        };

        const touchActivity = () => {
            runningLastUpdate.current = Date.now();
        };

        const finishCapture = () => {
            if (finishing) return;
            finishing = true;
            if (runningCheckTimer.current) {
                clearTimeout(runningCheckTimer.current);
                runningCheckTimer.current = null;
            }
            setRunning(false);
            setRemaining(0);
            onCompleteFinal();
        };

        let drainQueue;

        const maybeFinish = () => {
            if (finishing) return;
            if (pendingDiscovery > 0 || activeGets > 0 || pathQueue.length > 0) return;

            if (failedPaths.length > 0 && retryRound < CAPTURE_RETRY_ROUNDS) {
                retryRound += 1;
                const toRetry = failedPaths.splice(0);
                setTimeout(() => {
                    pathQueue.push(...toRetry);
                    drainQueue();
                }, CAPTURE_RETRY_DELAY * retryRound);
                return;
            }

            if (failedPaths.length > 0) {
                console.warn('Scene capture incomplete:', failedPaths.length, failedPaths);
            }

            finishCapture();
        };

        const fetchOnePath = path => new Promise((resolve) => {
            let settled = false;
            const finish = (result) => {
                if (settled) return;
                settled = true;
                resolve(result);
            };

            const timer = setTimeout(() => finish({ outcome: 'failed' }), PATH_FETCH_TIMEOUT);

            pathGet(
                features, path, (has) => {
                    if (!has) {
                        clearTimeout(timer);
                        finish({ outcome: 'skipped' });
                    }
                }, (v) => {
                    clearTimeout(timer);
                    finish({ outcome: 'ok', value: v });
                }, () => {
                    clearTimeout(timer);
                    finish({ outcome: 'failed' });
                }
            );
        });

        drainQueue = () => {
            while (activeGets < CAPTURE_CONCURRENCY && pathQueue.length > 0) {
                const path = pathQueue.shift();
                activeGets += 1;
                setRemaining(prev => prev + 1);
                pathsToGet.current[path] = true;
                touchActivity();

                fetchOnePath(path).then((result) => {
                    delete pathsToGet.current[path];
                    activeGets -= 1;
                    setRemaining(prev => prev - 1);
                    touchActivity();

                    if (result.outcome === 'ok') {
                        valuesCaptured.current.push([path, result.value]);
                        setCaptureCompleted(prev => prev + 1);
                    } else if (result.outcome === 'skipped') {
                        setCaptureCompleted(prev => prev + 1);
                    } else {
                        failedPaths.push(path);
                    }

                    drainQueue();
                    maybeFinish();
                });
            }
            maybeFinish();
        };

        const enqueuePath = (path) => {
            setCaptureTotal(prev => prev + 1);
            pathQueue.push(path);
            drainQueue();
        };

        const discover = (feature, ids, fn) => {
            pendingDiscovery += 1;
            hasCall(feature, ids, () => {
                fn();
                pendingDiscovery -= 1;
                maybeFinish();
            }, (has) => {
                if (!has) {
                    pendingDiscovery -= 1;
                    maybeFinish();
                }
            });
        };

        const discoverOnce = (feature, ids, onValue) => {
            pendingDiscovery += 1;
            let dropped = false;
            const drop = () => {
                if (dropped) return;
                dropped = true;
                pendingDiscovery -= 1;
                maybeFinish();
            };
            hasGetOnlyOnce(
                feature, ids, (value) => {
                    onValue(value);
                    drop();
                }, (has) => {
                    if (!has) drop();
                }, drop
            );
        };

        runningCheckTimer.current = setTimeout(() => {
            if (finishing) return;
            console.warn('Scene capture watchdog timed out', {
                pendingDiscovery,
                activeGets,
                queued: pathQueue.length,
                failed: failedPaths.length,
            });
            finishCapture();
        }, CAPTURE_WATCHDOG);
        touchActivity();

        runAppSceneCaptureDiscovery({
            enqueuePath,
            discover,
            discoverOnce,
        }, features);
    }, [runningCheckTimer, runningLastUpdate, setRunning, features,
        pathsToGet, setRemaining, setCaptureTotal, setCaptureCompleted,
        valuesCaptured]);

    const load = useCallback(async (pathsValues, onComplete) => {
        if (!pathsValues || typeof pathsValues !== 'object') {
            if (onComplete) await onComplete();
            return;
        }
        const changes = Object.keys(pathsValues)
            .filter(path => APP_SCENE_PATH_PREFIXES.some(prefix => path.startsWith(prefix)))
            .map(path => [path, pathsValues[path]]);
        await runScheduled((sched) => {
            changes.forEach(change => sched(features, change));
        });
        if (onComplete) await onComplete();
    }, [features, runScheduled]);

    return {
        capture, load, running, remaining, captureTotal, captureCompleted,
    };
};
