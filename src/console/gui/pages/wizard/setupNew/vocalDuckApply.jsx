// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
    useBusCompressorMode,
    useBusCompressorOn,
    useBusCompressorRatio,
    useBusCompressorSidechain,
    useBusCompressorSidechainFrequency,
    useBusCompressorSidechainOn,
    useBusCompressorSidechainSource,
    useBusCompressorSidechainType,
} from '@magical-mixing/mixers-react';
import { kickBusIdToSidechainSourceName } from './kickBassSidechain';
import {
    VOCAL_DUCK_FILTER_TYPE,
    VOCAL_DUCK_FREQUENCY,
    VOCAL_DUCK_MODE,
    VOCAL_DUCK_RATIO,
} from './vocalDucking';


// Internal
const useApplyRegistry = () => {
    const registryRef = useRef(new Map());
    const [version, setVersion] = useState(0);

    const register = useCallback((key, entry) => {
        registryRef.current.set(key, entry);
        setVersion(v => v + 1);
    }, []);

    const unregister = useCallback((key) => {
        registryRef.current.delete(key);
        setVersion(v => v + 1);
    }, []);

    return {
        registryRef, register, unregister, version,
    };
};


const applyVocalSidechainOnly = ({
    sidechainOn, sidechainType, sidechainFrequency, sidechainSource, sourceName,
}) => {
    if (sidechainOn.has) sidechainOn.set(true);
    if (sidechainType.has) {
        const o = sidechainType.options.find(a => a.name === VOCAL_DUCK_FILTER_TYPE);
        if (o) sidechainType.set(o.id);
    }
    if (sidechainFrequency.has) {
        sidechainFrequency.set(VOCAL_DUCK_FREQUENCY);
    }
    if (sidechainSource.has) {
        const o = sidechainSource.options.find(a => a.name === sourceName);
        if (o) sidechainSource.set(o.id);
    }
};


const useVocalDuckTargetApply = (targetBusId, vocalBusId) => {
    const { has: sidechainFeatureHas } = useBusCompressorSidechain(targetBusId);
    const compressorOn = useBusCompressorOn(targetBusId);
    const mode = useBusCompressorMode(targetBusId);
    const ratio = useBusCompressorRatio(targetBusId);
    const sidechainOn = useBusCompressorSidechainOn(targetBusId);
    const sidechainType = useBusCompressorSidechainType(targetBusId);
    const sidechainFrequency = useBusCompressorSidechainFrequency(targetBusId);
    const sidechainSource = useBusCompressorSidechainSource(targetBusId);

    const ready = useMemo(() => {
        if (!sidechainFeatureHas) return true;
        if (compressorOn.value === undefined) return false;
        if (sidechainOn.value === undefined) return false;
        if (sidechainSource.value === undefined) return false;
        return true;
    }, [
        compressorOn.value, sidechainFeatureHas, sidechainOn.value, sidechainSource.value,
    ]);

    const apply = useCallback(() => {
        const sourceName = kickBusIdToSidechainSourceName(vocalBusId);
        if (!sourceName || !sidechainFeatureHas) return;

        const alreadyConfigured = compressorOn.has && compressorOn.value === true;

        if (alreadyConfigured) {
            applyVocalSidechainOnly({
                sidechainOn, sidechainType, sidechainFrequency, sidechainSource, sourceName,
            });
            return;
        }

        if (compressorOn.has) compressorOn.set(true);
        if (mode.has) {
            const o = mode.options.find(a => a.name === VOCAL_DUCK_MODE);
            if (o) mode.set(o.id);
        }
        if (ratio.has) {
            const o = ratio.options.find(a => a.name === VOCAL_DUCK_RATIO);
            if (o) ratio.set(o.id);
        }
        applyVocalSidechainOnly({
            sidechainOn, sidechainType, sidechainFrequency, sidechainSource, sourceName,
        });
    }, [
        compressorOn, mode, ratio, sidechainFeatureHas, sidechainFrequency,
        sidechainOn, sidechainSource, sidechainType, vocalBusId,
    ]);

    return { apply, ready };
};


const VocalDuckApplySlot = ({
    targetBusId, vocalBusId, register, unregister,
}) => {
    const { apply, ready } = useVocalDuckTargetApply(targetBusId, vocalBusId);

    useEffect(() => {
        register(targetBusId, { apply, ready });
        return () => unregister(targetBusId);
    }, [apply, ready, register, targetBusId, unregister]);

    return null;
};


const useWizardVocalDuckApply = (vocalBusId, targetBusIds) => {
    const { registryRef, register, unregister, version } = useApplyRegistry();

    const slots = useMemo(() => targetBusIds.map(targetBusId => (
        <VocalDuckApplySlot
            key={targetBusId}
            targetBusId={targetBusId}
            vocalBusId={vocalBusId}
            register={register}
            unregister={unregister}
        />
    )), [register, targetBusIds, unregister, vocalBusId]);

    const ready = useMemo(() => {
        if (!targetBusIds.length) return true;
        return targetBusIds.every(id => registryRef.current.get(id)?.ready);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registryRef, targetBusIds, version]);

    const apply = useCallback(() => {
        targetBusIds.forEach((targetBusId) => {
            registryRef.current.get(targetBusId)?.apply();
        });
    }, [registryRef, targetBusIds]);

    return { apply, ready, slots };
};


// Exported
export { useWizardVocalDuckApply };
