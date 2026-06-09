// Requirements
import {
    useCallback, useEffect, useMemo, useRef,
} from 'react';
import {
    useBusCompressorAttack,
    useBusCompressorAutomatic,
    useBusCompressorDetermination,
    useBusCompressorEnvelope,
    useBusCompressorGain,
    useBusCompressorHold,
    useBusCompressorKnee,
    useBusCompressorMix,
    useBusCompressorMode,
    useBusCompressorOn,
    useBusCompressorRatio,
    useBusCompressorRelease,
    useBusCompressorSidechainFrequency,
    useBusCompressorSidechainOn,
    useBusCompressorSidechainSource,
    useBusCompressorSidechainType,
    useBusCompressorThreshold,
    useBusEqualizerParametricReset,
    useBusGateAttack,
    useBusGateHold,
    useBusGateMode,
    useBusGateOn,
    useBusGateRange,
    useBusGateRelease,
    useBusGateSidechainFrequency,
    useBusGateSidechainOn,
    useBusGateSidechainSource,
    useBusGateSidechainType,
    useBusGateThreshold,
    useBusInputId,
    useBusLevel,
    useBusMute,
    useBusName,
    useBusOptions,
    useBusOutputAssignmentApply,
    useBusReset,
    useBusStereoLink,
    useBusToLevel,
    useBusToOn,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useFallbackBusIcon, useFallbackBusColor } from '../../../components/fallback';
import { useVault } from '../../../components/vault';
import { useEqualizerPresetHooks } from '../../bus/view/equalizer/presets';
import {
    isKickSidechainSourceValid,
    KICK_SIDECHAIN_FILTER_TYPE,
    KICK_SIDECHAIN_FREQUENCY,
    KICK_SIDECHAIN_MODE,
    KICK_SIDECHAIN_RATIO,
    kickBusIdToSidechainSourceName,
} from './kickBassSidechain';
import { getSetupType } from './options';
import { formatSetupBusName } from './state';
import { useWizardChannelSendsApply, useWizardMonitorReceptionsApply } from './sendApply';
import { getVocalDuckTargetBusIds } from './vocalDucking';
import { useWizardVocalDuckApply } from './vocalDuckApply';


// Internal
const loadVaultPreset = async (vaults, vaultLoad, name) => {
    const vault = vaults.find(v => v.vaultName === name);
    if (!vault) return null;
    return vaultLoad(vault.vaultId);
};


const useCompressorPresetApply = (busId) => {
    const mode = useBusCompressorMode(busId);
    const ratio = useBusCompressorRatio(busId);
    const knee = useBusCompressorKnee(busId);
    const threshold = useBusCompressorThreshold(busId);
    const gain = useBusCompressorGain(busId);
    const determination = useBusCompressorDetermination(busId);
    const mix = useBusCompressorMix(busId);
    const automatic = useBusCompressorAutomatic(busId);
    const envelope = useBusCompressorEnvelope(busId);
    const attack = useBusCompressorAttack(busId);
    const hold = useBusCompressorHold(busId);
    const release = useBusCompressorRelease(busId);
    const sidechainOn = useBusCompressorSidechainOn(busId);
    const sidechainType = useBusCompressorSidechainType(busId);
    const sidechainFrequency = useBusCompressorSidechainFrequency(busId);
    const sidechainSource = useBusCompressorSidechainSource(busId);

    return useCallback((c) => {
        if (mode.has && c.mode !== undefined) {
            const o = mode.options.find(a => a.name === c.mode);
            if (o) mode.set(o.id);
        }
        if (ratio.has && c.ratio !== undefined) {
            const o = ratio.options.find(a => a.name === c.ratio);
            if (o) ratio.set(o.id);
        }
        if (knee.has && c.knee !== undefined) knee.set(c.knee);
        if (threshold.has && c.threshold !== undefined) threshold.set(c.threshold);
        if (gain.has && c.gain !== undefined) gain.set(c.gain);
        if (determination.has && c.determination !== undefined) {
            const o = determination.options.find(a => a.name === c.determination);
            if (o) determination.set(o.id);
        }
        if (mix.has && c.mix !== undefined) mix.set(c.mix);
        if (automatic.has && c.automatic !== undefined) automatic.set(c.automatic);
        if (envelope.has && c.envelope !== undefined) {
            const o = envelope.options.find(a => a.name === c.envelope);
            if (o) envelope.set(o.id);
        }
        if (attack.has && c.attack !== undefined) attack.set(c.attack);
        if (hold.has && c.hold !== undefined) hold.set(c.hold);
        if (release.has && c.release !== undefined) release.set(c.release);
        if (sidechainOn.has && c.sidechainOn !== undefined) sidechainOn.set(c.sidechainOn);
        if (sidechainType.has && c.sidechainType !== undefined) {
            const o = sidechainType.options.find(a => a.name === c.sidechainType);
            if (o) sidechainType.set(o.id);
        }
        if (sidechainFrequency.has && c.sidechainFrequency !== undefined) {
            sidechainFrequency.set(c.sidechainFrequency);
        }
        if (sidechainSource.has && c.sidechainSource !== undefined) {
            const o = sidechainSource.options.find(a => a.name === c.sidechainSource);
            if (o) sidechainSource.set(o.id);
        }
    }, [knee, mode, ratio, threshold, gain, determination, mix, automatic, envelope,
        attack, hold, release, sidechainOn, sidechainType, sidechainFrequency, sidechainSource]);
};


const useGatePresetApply = (busId) => {
    const mode = useBusGateMode(busId);
    const range = useBusGateRange(busId);
    const threshold = useBusGateThreshold(busId);
    const attack = useBusGateAttack(busId);
    const hold = useBusGateHold(busId);
    const release = useBusGateRelease(busId);
    const sidechainOn = useBusGateSidechainOn(busId);
    const sidechainType = useBusGateSidechainType(busId);
    const sidechainFrequency = useBusGateSidechainFrequency(busId);
    const sidechainSource = useBusGateSidechainSource(busId);

    return useCallback((c) => {
        if (mode.has && c.mode !== undefined) {
            const o = mode.options.find(a => a.name === c.mode);
            if (o) mode.set(o.id);
        }
        if (range.has && c.range !== undefined) range.set(c.range);
        if (threshold.has && c.threshold !== undefined) threshold.set(c.threshold);
        if (attack.has && c.attack !== undefined) attack.set(c.attack);
        if (hold.has && c.hold !== undefined) hold.set(c.hold);
        if (release.has && c.release !== undefined) release.set(c.release);
        if (sidechainOn.has && c.sidechainOn !== undefined) sidechainOn.set(c.sidechainOn);
        if (sidechainType.has && c.sidechainType !== undefined) {
            const o = sidechainType.options.find(a => a.name === c.sidechainType);
            if (o) sidechainType.set(o.id);
        }
        if (sidechainFrequency.has && c.sidechainFrequency !== undefined) {
            sidechainFrequency.set(c.sidechainFrequency);
        }
        if (sidechainSource.has && c.sidechainSource !== undefined) {
            const o = sidechainSource.options.find(a => a.name === c.sidechainSource);
            if (o) sidechainSource.set(o.id);
        }
    }, [mode, range, threshold, attack, hold, release,
        sidechainOn, sidechainType, sidechainFrequency, sidechainSource]);
};


const useKickBassSidechainApply = (busId) => {
    const mode = useBusCompressorMode(busId);
    const ratio = useBusCompressorRatio(busId);
    const sidechainOn = useBusCompressorSidechainOn(busId);
    const sidechainType = useBusCompressorSidechainType(busId);
    const sidechainFrequency = useBusCompressorSidechainFrequency(busId);
    const sidechainSource = useBusCompressorSidechainSource(busId);

    return useCallback((kickBusId) => {
        const sourceName = kickBusIdToSidechainSourceName(kickBusId);
        if (!sourceName) return;

        if (mode.has) {
            const o = mode.options.find(a => a.name === KICK_SIDECHAIN_MODE);
            if (o) mode.set(o.id);
        }
        if (ratio.has) {
            const o = ratio.options.find(a => a.name === KICK_SIDECHAIN_RATIO);
            if (o) ratio.set(o.id);
        }
        if (sidechainOn.has) sidechainOn.set(true);
        if (sidechainType.has) {
            const o = sidechainType.options.find(a => a.name === KICK_SIDECHAIN_FILTER_TYPE);
            if (o) sidechainType.set(o.id);
        }
        if (sidechainFrequency.has) {
            sidechainFrequency.set(KICK_SIDECHAIN_FREQUENCY);
        }
        if (sidechainSource.has) {
            const o = sidechainSource.options.find(a => a.name === sourceName);
            if (o) sidechainSource.set(o.id);
        }
    }, [mode, ratio, sidechainFrequency, sidechainOn, sidechainSource, sidechainType]);
};


// Exported
export default ({ state, onComplete, onError }) => {
    const { t } = useLanguage();
    const setupType = getSetupType(state.setupTypeId);
    const { busId } = state;
    const appliedRef = useRef(false);

    const { reset: resetBus } = useBusReset(busId);
    const { has: nameHas, set: setName } = useBusName(busId);
    const { set: setIcon } = useFallbackBusIcon(busId);
    const { set: setColor } = useFallbackBusColor(busId);
    const { has: inputHas, set: setInput } = useBusInputId(busId);
    const { has: stereoLinkHas, set: setStereoLink } = useBusStereoLink(busId);
    const applyEqualizer = useEqualizerPresetHooks(busId).apply;
    const { reset: resetEqualizer } = useBusEqualizerParametricReset(busId);
    const applyCompressor = useCompressorPresetApply(busId);
    const applyKickBassSidechain = useKickBassSidechainApply(busId);
    const applyGate = useGatePresetApply(busId);
    const compressorOn = useBusCompressorOn(busId);
    const gateOn = useBusGateOn(busId);
    const {
        has: levelHas, set: setLevel, minimum: levelMinimum,
    } = useBusLevel(busId);
    const { has: muteHas, set: setMute } = useBusMute(busId);
    const { mainOne, soloOne } = useBusOptions();
    const soloBusId = soloOne?.id ?? 0;
    const { has: soloOnHas, set: setSoloOn } = useBusToOn(busId, soloBusId);
    const {
        has: soloLevelHas, set: setSoloLevel, minimum: soloLevelMinimum,
    } = useBusToLevel(busId, soloBusId);
    const monitorBusId = state.flow === 'monitor' ? busId : null;
    const vocalDuckTargetBusIds = useMemo(() => getVocalDuckTargetBusIds(state.vocalDucking, busId),
        [busId, state.vocalDucking]);
    const {
        apply: applyVocalDuck,
        ready: vocalDuckReady,
        slots: vocalDuckSlots,
    } = useWizardVocalDuckApply(busId, vocalDuckTargetBusIds);
    const {
        apply: applySends, ready: sendsReady, slots: channelSendSlots,
    } = useWizardChannelSendsApply(busId, mainOne);
    const {
        apply: applyMonitorReceptions,
        ready: monitorReceptionsReady,
        slots: monitorSendSlots,
    } = useWizardMonitorReceptionsApply(monitorBusId);
    const {
        apply: applyOutput,
        ready: outputReady,
    } = useBusOutputAssignmentApply(busId, state.outputId);

    const { vaults: compressorVaults, vaultLoad: loadCompressorVault } = useVault('preset-compressor');
    const { vaults: gateVaults, vaultLoad: loadGateVault } = useVault('preset-gate');
    const { vaults: equalizerVaults, vaultLoad: loadEqualizerVault } = useVault('preset-equalizer');

    const loadEqPreset = n => loadVaultPreset(equalizerVaults, loadEqualizerVault, n);
    const loadCompPreset = n => loadVaultPreset(compressorVaults, loadCompressorVault, n);
    const loadGatePreset = n => loadVaultPreset(gateVaults, loadGateVault, n);

    const soloBaselineReady = soloOne?.id === undefined
        || (soloOnHas !== undefined || soloLevelHas !== undefined);

    const applyBusBaseline = useCallback(() => {
        if (levelHas) setLevel(levelMinimum);
        if (muteHas) setMute(false);
        if (soloOne?.id !== undefined) {
            if (soloOnHas) {
                setSoloOn(false);
            } else if (soloLevelHas) {
                setSoloLevel(soloLevelMinimum);
            }
        }
    }, [
        levelHas, levelMinimum, muteHas, setLevel, setMute,
        setSoloLevel, setSoloOn, soloLevelHas, soloLevelMinimum,
        soloOnHas, soloOne?.id,
    ]);

    const deviceReady = useMemo(() => {
        if (busId === null) return false;
        if (nameHas === undefined) return false;
        if (inputHas === undefined) return false;
        if (levelHas === undefined) return false;
        if (muteHas === undefined) return false;
        if (!soloBaselineReady) return false;
        if (state.flow === 'channel' && (!sendsReady || !vocalDuckReady)) return false;
        if (state.flow === 'monitor' && (!monitorReceptionsReady || !outputReady)) return false;
        return true;
    }, [
        busId, inputHas, levelHas, muteHas, nameHas, monitorReceptionsReady,
        outputReady, sendsReady, soloBaselineReady, state.flow, vocalDuckReady,
    ]);

    useEffect(() => {
        if (!deviceReady || appliedRef.current) return;

        const apply = async () => {
            try {
                if (!setupType || busId === null) throw new Error('Invalid setup');

                appliedRef.current = true;

                const displayName = formatSetupBusName({
                    flow: state.flow,
                    setupType,
                    who: state.who,
                    t,
                });

                await resetBus();
                applyBusBaseline();

                if (state.flow === 'monitor') {
                    setIcon(setupType.icon);
                    setColor(setupType.color === 'gray' ? null : setupType.color);
                    if (nameHas) setName(displayName);
                    applyOutput();
                    applyMonitorReceptions(state.monitorSources);
                } else {
                    const {
                        equalizerPreset: eqPreset,
                        compressorPreset: compPreset,
                        gatePreset,
                    } = state.configure;
                    setIcon(setupType.icon);
                    setColor(setupType.color === 'gray' ? null : setupType.color);
                    if (nameHas) setName(displayName);
                    const hasInput = state.inputId !== null && state.inputId !== undefined;
                    if (hasInput && inputHas) {
                        setInput(state.inputId);
                    }
                    if (state.stereoLink && stereoLinkHas) {
                        setStereoLink(true);
                    }
                    if (state.configure.equalizer && eqPreset) {
                        resetEqualizer();
                        const config = await loadEqPreset(eqPreset);
                        if (config) applyEqualizer(config);
                    }
                    const kickSidechain = state.kickSidechain ?? {};
                    const applyKickDucking = kickSidechain.enabled
                        && isKickSidechainSourceValid(kickSidechain.kickBusId, busId);

                    if (state.configure.compressor && compPreset) {
                        const config = await loadCompPreset(compPreset);
                        if (config) {
                            if (compressorOn.has) compressorOn.set(true);
                            applyCompressor(config);
                        }
                    } else if (applyKickDucking && compressorOn.has) {
                        compressorOn.set(true);
                    }
                    if (applyKickDucking) {
                        applyKickBassSidechain(kickSidechain.kickBusId);
                    }
                    if (state.configure.gate && gatePreset) {
                        const config = await loadGatePreset(gatePreset);
                        if (config) {
                            if (gateOn.has) gateOn.set(true);
                            applyGate(config);
                        }
                    }
                    if (vocalDuckTargetBusIds.length) {
                        applyVocalDuck();
                    }
                    applySends(state.sends);
                }
                onComplete();
            } catch (error) {
                appliedRef.current = false;
                onError(error);
            }
        };
        apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceReady]);

    return (
        <>
            {state.flow === 'channel' && vocalDuckSlots}
            {state.flow === 'channel' && channelSendSlots}
            {state.flow === 'monitor' && monitorSendSlots}
        </>
    );
};
