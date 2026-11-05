// Requirements
import { useCallback, useContext } from 'react';
import { DeviceContext } from '..';
import { hasCall } from '../../helpers/feature';
import { pathGet, pathHas } from '../../helpers/path';
import { useChanges } from '../../helpers/changes';
import { scheduleBusChannelMovePaths } from '../scene/capturePaths';
import { busReset } from './reset';
import {
    busMoveChanges, receptionMoveChanges, receptionPaths, sidechainFollowChanges,
    sidechainFollowPaths, sidechainSourceId,
} from './movePaths';


// Constants
const CAPTURE_CONCURRENCY = 12;

const CAPTURE_RETRY_ROUNDS = 3;

const CAPTURE_RETRY_DELAY = 500;

const PATH_FETCH_TIMEOUT = 15 * 1000;

const CAPTURE_WATCHDOG = 60 * 1000;

const BUS_MOVE_NOT_CHANNEL = 'not-channel';

const BUS_MOVE_STEREO_LINK = 'stereo-link';

const BUS_MOVE_CAPTURE_FAILED = 'capture-failed';

const BUS_MOVE_PREAMP = 'preamp';


// Internal
const wait = milliseconds => new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
});


const fail = reason => ({ ok: false, reason });


const MOVABLE_TYPES = ['channel', 'secondary'];


const busOption = (bus, busId) => bus.options.find(option => option.id === busId);


const fetchPath = (features, path) => new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
    };

    const timer = setTimeout(() => finish({ outcome: 'failed' }), PATH_FETCH_TIMEOUT);

    pathGet(
        features,
        path,
        (has) => {
            if (!has) {
                clearTimeout(timer);
                finish({ outcome: 'skipped' });
            }
        },
        (value) => {
            clearTimeout(timer);
            finish({ outcome: 'ok', value });
        },
        () => {
            clearTimeout(timer);
            finish({ outcome: 'failed' });
        }
    );
});


const fetchPathRetry = async (features, path, round = 0) => {
    const result = await fetchPath(features, path);
    if (result.outcome !== 'failed' || round >= CAPTURE_RETRY_ROUNDS) return result;
    await wait(CAPTURE_RETRY_DELAY * (round + 1));
    return fetchPathRetry(features, path, round + 1);
};


const pathHasPromise = (features, path) => new Promise((resolve) => {
    try {
        pathHas(features, path, resolve);
    } catch (e) {
        console.error('Move path has', path, e.message);
        resolve(false);
    }
});


const captureFeaturePaths = (features, schedule) => new Promise((resolve) => {
    const pathQueue = [];
    const failedPaths = [];
    const values = [];
    let activeGets = 0;
    let pendingDiscovery = 0;
    let retryRound = 0;
    let schedulingDone = false;
    let finishing = false;
    let drainQueue;
    let watchdog;

    const finish = (ok) => {
        if (finishing) return;
        finishing = true;
        clearTimeout(watchdog);
        resolve(ok ? { ok: true, values } : { ok: false, values: [] });
    };

    const maybeFinish = () => {
        if (finishing || !schedulingDone) return;
        if (pendingDiscovery > 0 || activeGets > 0 || pathQueue.length > 0) return;

        if (failedPaths.length > 0 && retryRound < CAPTURE_RETRY_ROUNDS) {
            retryRound += 1;
            const toRetry = failedPaths.splice(0);
            setTimeout(() => {
                if (finishing) return;
                pathQueue.push(...toRetry);
                drainQueue();
            }, CAPTURE_RETRY_DELAY * retryRound);
            return;
        }

        if (failedPaths.length > 0) {
            console.warn('Channel move capture incomplete:', failedPaths.length, failedPaths);
            finish(false);
            return;
        }

        finish(true);
    };

    drainQueue = () => {
        while (activeGets < CAPTURE_CONCURRENCY && pathQueue.length > 0) {
            const path = pathQueue.shift();
            activeGets += 1;

            fetchPath(features, path).then((result) => {
                activeGets -= 1;

                if (result.outcome === 'ok') {
                    if (result.value !== undefined) values.push([path, result.value]);
                } else if (result.outcome === 'failed') {
                    failedPaths.push(path);
                }

                drainQueue();
                maybeFinish();
            });
        }
        maybeFinish();
    };

    const enqueuePath = (path) => {
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

    watchdog = setTimeout(() => {
        console.warn('Channel move capture watchdog timed out', {
            pendingDiscovery,
            activeGets,
            queued: pathQueue.length,
            failed: failedPaths.length,
        });
        finish(false);
    }, CAPTURE_WATCHDOG);

    try {
        schedule({ enqueuePath, discover });
    } catch (e) {
        console.error('Channel move capture schedule', e.message);
        finish(false);
        return;
    }

    schedulingDone = true;
    maybeFinish();
});


const linked = async (features, busId) => {
    const result = await fetchPathRetry(features, `bus.stereoLink(${busId})`);
    if (result.outcome === 'failed') return { error: BUS_MOVE_CAPTURE_FAILED };
    return { linked: result.outcome === 'ok' && !!result.value };
};


const preampChanges = async (features, inputFrom, inputTo) => {
    // Same physical input: resetting the source can clear that preamp when it
    // is the source channel's default. Refuse instead of wiping the only gain.
    if (inputFrom === inputTo) {
        const gainFrom = await fetchPathRetry(features, `input.gain(${inputFrom})`);
        const phantomFrom = await fetchPathRetry(features, `input.phantom(${inputFrom})`);
        if (gainFrom.outcome === 'failed' || phantomFrom.outcome === 'failed') {
            return { error: BUS_MOVE_CAPTURE_FAILED };
        }
        if (gainFrom.outcome === 'ok' || phantomFrom.outcome === 'ok') {
            return { error: BUS_MOVE_PREAMP };
        }
        return { changes: [] };
    }

    const gainFrom = await fetchPathRetry(features, `input.gain(${inputFrom})`);
    const phantomFrom = await fetchPathRetry(features, `input.phantom(${inputFrom})`);
    if (gainFrom.outcome === 'failed' || phantomFrom.outcome === 'failed') {
        return { error: BUS_MOVE_CAPTURE_FAILED };
    }

    const changes = [];

    const take = async (fromResult, path) => {
        if (fromResult.outcome !== 'ok' || fromResult.value === undefined) return null;
        if (inputTo === null) return { error: BUS_MOVE_PREAMP };
        const destHas = await pathHasPromise(features, path);
        if (!destHas) return { error: BUS_MOVE_PREAMP };
        changes.push([path, fromResult.value]);
        return null;
    };

    const gainError = await take(gainFrom, `input.gain(${inputTo})`);
    if (gainError) return gainError;
    const phantomError = await take(phantomFrom, `input.phantom(${inputTo})`);
    if (phantomError) return phantomError;

    return { changes };
};


const inputIdFrom = result => (
    result.outcome === 'ok' && typeof result.value === 'number' ? result.value : null
);


const channelPreampChanges = async (features, busIdFrom, busIdTo) => {
    const inputFromResult = await fetchPathRetry(features, `bus.input(${busIdFrom}).id`);
    const inputToResult = await fetchPathRetry(features, `bus.input(${busIdTo}).id`);
    if (inputFromResult.outcome !== 'ok' || inputToResult.outcome !== 'ok') {
        return { error: BUS_MOVE_CAPTURE_FAILED };
    }

    const inputFrom = inputIdFrom(inputFromResult);
    if (inputFrom === null) return { changes: [] };
    return preampChanges(features, inputFrom, inputIdFrom(inputToResult));
};


const secondaryExtraChanges = async (
    features, bus, busIdFrom, busIdTo, sidechainIds
) => {
    const skip = new Set([busIdFrom, busIdTo]);
    const captured = await captureFeaturePaths(features, ({ enqueuePath }) => {
        receptionPaths(bus.options, busIdFrom, skip).forEach(enqueuePath);
        sidechainFollowPaths(bus.options, skip).forEach(enqueuePath);
    });
    if (!captured.ok) return { error: BUS_MOVE_CAPTURE_FAILED };
    return {
        changes: [
            ...receptionMoveChanges(captured.values, busIdFrom, busIdTo),
            ...sidechainFollowChanges(captured.values, sidechainIds.from, sidechainIds.to),
        ],
    };
};


const moveBus = async (features, runScheduled, busIdFrom, busIdTo) => {
    const {
        bus, input, dca, mg,
    } = features || {};
    if (!bus || !input) return fail(BUS_MOVE_CAPTURE_FAILED);
    if (busIdFrom === busIdTo) return fail(BUS_MOVE_NOT_CHANNEL);

    const from = busOption(bus, busIdFrom);
    const to = busOption(bus, busIdTo);
    if (!from || !to || from.type !== to.type || !MOVABLE_TYPES.includes(from.type)) {
        return fail(BUS_MOVE_NOT_CHANNEL);
    }

    const fromLink = await linked(features, busIdFrom);
    if (fromLink.error) return fail(fromLink.error);
    const toLink = await linked(features, busIdTo);
    if (toLink.error) return fail(toLink.error);
    if (fromLink.linked || toLink.linked) return fail(BUS_MOVE_STEREO_LINK);

    const captured = await captureFeaturePaths(features, (ctx) => {
        scheduleBusChannelMovePaths(ctx, bus, busIdFrom);
    });
    if (!captured.ok || !captured.values.length) return fail(BUS_MOVE_CAPTURE_FAILED);

    const sidechainIds = {
        from: sidechainSourceId(from),
        to: sidechainSourceId(to),
    };
    let extra = { changes: [] };
    if (from.type === 'channel') extra = await channelPreampChanges(features, busIdFrom, busIdTo);
    if (from.type === 'secondary') {
        extra = await secondaryExtraChanges(
            features, bus, busIdFrom, busIdTo, sidechainIds
        );
    }
    if (extra.error) return fail(extra.error);

    const changes = [
        ...busMoveChanges(captured.values, busIdFrom, busIdTo, sidechainIds),
        ...extra.changes,
    ];
    if (!changes.length) return fail(BUS_MOVE_CAPTURE_FAILED);

    // Insert can belong to only one bus. Free it on the source before
    // assigning it on the destination.
    const insertChanges = [];
    const otherChanges = [];
    changes.forEach((change) => {
        if (change[0].includes('.insert(')) insertChanges.push(change);
        else otherChanges.push(change);
    });

    await runScheduled((sched) => {
        otherChanges.forEach(change => sched(features, change));
    });
    await runScheduled((sched) => {
        busReset(
            sched, bus, input, dca, mg, busIdFrom
        );
    });
    if (insertChanges.length) {
        await runScheduled((sched) => {
            insertChanges.forEach(change => sched(features, change));
        });
    }

    return { ok: true };
};


// Exported
export {
    BUS_MOVE_NOT_CHANNEL,
    BUS_MOVE_STEREO_LINK,
    BUS_MOVE_CAPTURE_FAILED,
    BUS_MOVE_PREAMP,
};


export const useBusMove = (busIdFrom) => {
    const { features } = useContext(DeviceContext);
    const { runScheduled } = useChanges();

    const move = useCallback(busIdTo => (
        moveBus(features, runScheduled, busIdFrom, busIdTo)
    ), [features, runScheduled, busIdFrom]);

    return { move };
};
