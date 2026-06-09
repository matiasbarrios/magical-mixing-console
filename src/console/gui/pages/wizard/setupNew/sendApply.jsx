// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
    useBusFromOptions,
    useBusToLevel,
    useBusToOn,
    useBusToOptions,
    busToLevelDefaultOn,
} from '@magical-mixing/mixers-react';


// Internal
const useSendApplyRegistry = () => {
    const registryRef = useRef(new Map());
    const [version, setVersion] = useState(0);

    const register = useCallback((busIdTo, entry) => {
        registryRef.current.set(busIdTo, entry);
        setVersion(v => v + 1);
    }, []);

    const unregister = useCallback((busIdTo) => {
        registryRef.current.delete(busIdTo);
        setVersion(v => v + 1);
    }, []);

    return {
        registryRef, register, unregister, version,
    };
};


const useSendApply = (busIdFrom, busIdTo) => {
    const { has: onHas, set: setOn } = useBusToOn(busIdFrom, busIdTo);
    const {
        has: levelHas, set: setLevel, minimum, maximum,
    } = useBusToLevel(busIdFrom, busIdTo);

    const ready = onHas !== undefined && levelHas !== undefined;

    const apply = useCallback((enabled) => {
        if (enabled) {
            if (onHas) {
                setOn(true);
                return;
            }
            if (levelHas) {
                setLevel(busToLevelDefaultOn(minimum, maximum));
            }
            return;
        }
        if (onHas) {
            setOn(false);
            return;
        }
        if (levelHas) {
            setLevel(minimum);
        }
    }, [levelHas, maximum, minimum, onHas, setLevel, setOn]);

    return { apply, ready };
};


const SendApplySlot = ({
    busIdFrom, busIdTo, register, unregister, registryKey,
}) => {
    const { apply, ready } = useSendApply(busIdFrom, busIdTo);
    const key = registryKey ?? busIdTo;

    useEffect(() => {
        register(key, { apply, ready });
        return () => unregister(key);
    }, [apply, key, ready, register, unregister]);

    return null;
};


const wizardChannelSendEnabled = (sends, dest) => {
    if (dest.type === 'main') return !!sends.main;
    if (dest.type === 'secondary') return !!sends.aux[dest.id];
    return false;
};


const useWizardChannelSendsApply = (busId, mainOne) => {
    const { options: toOptions } = useBusToOptions(busId);
    const { registryRef, register, unregister, version } = useSendApplyRegistry();

    const slots = useMemo(() => toOptions.map(dest => (
        <SendApplySlot
            key={dest.id}
            busIdFrom={busId}
            busIdTo={dest.id}
            register={register}
            unregister={unregister}
        />
    )),
    [busId, register, toOptions, unregister]);

    const ready = useMemo(() => {
        if (!toOptions.length) return true;
        return toOptions.every(dest => registryRef.current.get(dest.id)?.ready);
    // version bumps when slots register
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registryRef, toOptions, version]);

    const apply = useCallback((sends) => {
        toOptions.forEach((dest) => {
            const slot = registryRef.current.get(dest.id);
            if (!slot) return;
            if (dest.type === 'main' && !mainOne) return;
            slot.apply(wizardChannelSendEnabled(sends, dest));
        });
    }, [mainOne, registryRef, toOptions]);

    return { apply, ready, slots };
};


const useWizardMonitorReceptionsApply = (monitorBusId) => {
    const { options: fromOptions } = useBusFromOptions(monitorBusId ?? 0);
    const sources = useMemo(() => (monitorBusId === null ? [] : fromOptions),
        [fromOptions, monitorBusId]);
    const { registryRef, register, unregister, version } = useSendApplyRegistry();

    const slots = useMemo(() => sources.map(from => (
        <SendApplySlot
            key={from.id}
            busIdFrom={from.id}
            busIdTo={monitorBusId}
            registryKey={from.id}
            register={register}
            unregister={unregister}
        />
    )), [monitorBusId, register, sources, unregister]);

    const ready = useMemo(() => {
        if (monitorBusId === null || !sources.length) return true;
        return sources.every(from => registryRef.current.get(from.id)?.ready);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorBusId, registryRef, sources, version]);

    const apply = useCallback((monitorSources) => {
        if (monitorBusId === null) return;
        sources.forEach((from) => {
            const slot = registryRef.current.get(from.id);
            if (!slot) return;
            slot.apply(!!monitorSources[from.id]);
        });
    }, [monitorBusId, registryRef, sources]);

    return { apply, ready, slots };
};


// Exported
export {
    useWizardChannelSendsApply,
    useWizardMonitorReceptionsApply,
};
