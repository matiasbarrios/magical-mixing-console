// Constants
const GET_ONCE_TIMEOUT = 10 * 1000;


// Variables
let pendingHasDo = 0;

const pendingHasDoWaiters = [];


// Internal
const pendingHasDoDone = () => {
    pendingHasDo -= 1;
    if (pendingHasDo <= 0) {
        pendingHasDo = 0;
        while (pendingHasDoWaiters.length) pendingHasDoWaiters.shift()();
    }
};


const hasOnly = (feature, ids, onHas) => {
    let unlisten = null;
    try {
        unlisten = feature.has(...[...ids, onHas]);
    } catch (e) {
        console.error('On has', { feature, ids }, e.message);
    }
    return unlisten;
};


const readOnly = (feature, ids, onRead) => {
    if (feature.read === undefined) return;
    try {
        onRead(feature.read(...ids));
    } catch (e) {
        onRead(undefined);
        console.error('On read', { feature, ids }, e.message);
    }
};


const getOnly = (feature, ids, onGotten) => {
    let unlisten = null;
    try {
        unlisten = feature.get(...[...ids, onGotten]);
    } catch (e) {
        console.error('On get', { feature, ids }, e.message);
    }
    return unlisten;
};


const setOnly = (feature, ids, value) => {
    try {
        feature.set(...[...ids, value]);
    } catch (e) {
        console.error('On set', { feature, ids }, e.message);
    }
};


const hasDo = (feature, ids, {
    doFunction, valueSet, valueSetCalculate, onHasResolved,
}) => {
    let unlisten;
    let settled = false;

    pendingHasDo += 1;

    const onHas = (has) => {
        if (settled) return;
        settled = true;
        setTimeout(() => {
            if (unlisten) unlisten();
            pendingHasDoDone();
        }, 0);
        if (onHasResolved) onHasResolved(has);
        if (!has) return;
        if (typeof doFunction === 'function') {
            doFunction(...ids);
        } else if (typeof valueSetCalculate === 'function') {
            setOnly(feature, ids, valueSetCalculate());
        } else {
            setOnly(feature, ids, valueSet);
        }
    };

    unlisten = hasOnly(feature, ids, onHas);
};


// Exported
export { hasOnly, setOnly };


export const pendingHasDoCount = () => pendingHasDo;


export const waitForPendingHasDo = () => {
    if (pendingHasDo === 0) return Promise.resolve();
    return new Promise((resolve) => {
        pendingHasDoWaiters.push(resolve);
    });
};


export const toArray = (ids) => {
    if (ids === undefined) return [];
    return Array.isArray(ids) ? ids : [ids];
};


export const toIds = options => options.map(o => o.id);


export const hasSet = (feature, ids, value) => hasDo(feature, ids, { valueSet: value });


export const hasSetDefaultOption = (feature, ids) => hasDo(feature, ids, {
    valueSetCalculate: () => feature.defaultOption(...ids).id,
});


export const hasCall = (feature, ids, doFunction,
    onHasResolved) => hasDo(feature, ids, { doFunction, onHasResolved });


export const readGet = (feature, ids, onGotten) => {
    readOnly(feature, ids, onGotten);
    const unlistenGet = getOnly(feature, ids, onGotten);
    return () => {
        if (unlistenGet) unlistenGet();
    };
};


export const hasGetOnlyOnce = (
    feature, ids, onGotten, onHasResolved, onFailed
) => {
    let unlistenHas;
    let hasSettled = false;

    const onHas = (has) => {
        if (hasSettled) return;
        hasSettled = true;
        if (unlistenHas) unlistenHas();

        if (onHasResolved) onHasResolved(has);
        if (!has) return;

        let getSettled = false;
        let unlistenGet = null;
        let timer = null;

        const settleFailed = () => {
            if (getSettled) return;
            getSettled = true;
            if (unlistenGet) unlistenGet();
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (onFailed) onFailed();
        };

        timer = setTimeout(settleFailed, GET_ONCE_TIMEOUT);

        unlistenGet = getOnly(feature, ids, (value) => {
            if (getSettled) return;
            getSettled = true;
            if (unlistenGet) unlistenGet();
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            onGotten(value);
        });
        if (!unlistenGet) settleFailed();
    };
    unlistenHas = hasOnly(feature, ids, onHas);
};


export const hasGet = (feature, ids, onHas, onGotten) => {
    let active = true;
    let unlistenGet = null;
    let lastHas;

    const unlistenHas = hasOnly(feature, ids, (h) => {
        if (!active) return;

        if (h === lastHas) return;
        lastHas = h;
        onHas(h);

        if (unlistenGet) {
            unlistenGet();
            unlistenGet = null;
        }

        if (h) {
            unlistenGet = readGet(feature, ids, (v) => {
                if (active) onGotten(v);
            });
        } else {
            onGotten(undefined);
        }
    });

    return () => {
        active = false;
        if (unlistenHas) unlistenHas();
        if (unlistenGet) unlistenGet();
    };
};
