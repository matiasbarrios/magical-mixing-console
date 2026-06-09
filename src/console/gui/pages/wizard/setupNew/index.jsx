// Requirements
import {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { useNavigate } from 'react-router';
import { Button, Dialog, Flex } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import DialogHeader from '../../../components/base/dialogHeader';
import { getSetupType } from './options';
import { isKickSidechainSourceValid, kickSidechainFromSetupType } from './kickBassSidechain';
import { isVocalDuckingConfigured, vocalDuckingFromSetupType } from './vocalDucking';
import { configureFromSetupType } from './templates';
import {
    createInitialState, getStepsForFlow,
} from './state';
import PickType from './steps/pickType';
import PickTarget from './steps/pickTarget';
import Identity from './steps/identity';
import ConfigureOptions from './steps/configureOptions';
import Sends from './steps/sends';
import MonitorSources from './steps/monitorSources';
import Apply from './apply';


// Internal
const canAdvance = (step, state) => {
    if (step === 'type') return !!state.setupTypeId;
    if (step === 'target') return state.busId !== null;
    if (step === 'options' && state.setupTypeId === 'bass') {
        const { enabled, kickBusId } = state.kickSidechain ?? {};
        if (enabled && !isKickSidechainSourceValid(kickBusId, state.busId)) {
            return false;
        }
    }
    if (step === 'options' && state.setupTypeId === 'vocals') {
        if (!isVocalDuckingConfigured(state.vocalDucking, state.busId)) {
            return false;
        }
    }
    if (step === 'sources') {
        return Object.values(state.monitorSources).some(Boolean);
    }
    return true;
};


const stepButtonLabel = (label, stepNumber, stepTotal, showProgress) => {
    if (!showProgress) return label;
    return `${label} ${stepNumber}/${stepTotal}`;
};


const wizardDialogStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85dvh',
    overflow: 'hidden',
};


// Exported
export default ({ open, onOpenChange }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled, isOnline } = useDevice();
    const navigate = useNavigate();

    const [state, setState] = useState(createInitialState);
    const [stepIndex, setStepIndex] = useState(0);
    const [applying, setApplying] = useState(false);

    const steps = useMemo(() => getStepsForFlow(state.flow),
        [state.flow]);
    const step = steps[stepIndex] ?? 'type';
    const setupType = useMemo(() => getSetupType(state.setupTypeId), [state.setupTypeId]);

    const reset = useCallback(() => {
        setState(createInitialState());
        setStepIndex(0);
        setApplying(false);
    }, []);

    const handleOpenChange = useCallback((nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
    }, [onOpenChange, reset]);

    useEffect(() => {
        if (!open && !applying) reset();
    }, [applying, open, reset]);

    const onSetupTypeSelect = useCallback((setupTypeId) => {
        const type = getSetupType(setupTypeId);
        setState(() => ({
            ...createInitialState(),
            setupTypeId,
            flow: type?.flow ?? 'channel',
            inputId: null,
            outputId: null,
            configure: configureFromSetupType(type),
            kickSidechain: kickSidechainFromSetupType(type),
            vocalDucking: vocalDuckingFromSetupType(type),
        }));
        setStepIndex(1);
    }, []);

    const onBusSelect = useCallback((busId) => {
        setState(s => ({
            ...s,
            busId,
        }));
    }, []);

    const onInputChange = useCallback((inputId) => {
        setState(s => ({ ...s, inputId }));
    }, []);

    const onStereoLinkChange = useCallback((stereoLink) => {
        setState(s => ({ ...s, stereoLink }));
    }, []);

    const onOutputChange = useCallback((id) => {
        setState(s => ({ ...s, outputId: id }));
    }, []);

    const onWhoChange = useCallback((who) => {
        setState(s => ({ ...s, who }));
    }, []);

    const goBack = useCallback(() => {
        setStepIndex(i => Math.max(0, i - 1));
    }, []);

    const goNext = useCallback(() => {
        setStepIndex(i => Math.min(steps.length - 1, i + 1));
    }, [steps.length]);

    const startApply = useCallback(() => {
        setApplying(true);
    }, []);

    const onApplyComplete = useCallback(() => {
        const { busId } = state;
        handleOpenChange(false);
        if (busId !== null) navigate(`/bus/${busId}`);
    }, [handleOpenChange, navigate, state]);

    const onApplyError = useCallback((error) => {
        console.error('Setup wizard apply failed', error);
        setApplying(false);
    }, []);

    const advanceEnabled = canAdvance(step, state);
    const isLastStep = stepIndex === steps.length - 1;
    const autoAdvanceStep = step === 'type';
    const showStepProgress = state.setupTypeId !== null;
    const stepNumber = stepIndex + 1;
    const stepTotal = steps.length;

    const stepContent = useMemo(() => {
        if (step === 'type') {
            return (
                <PickType
                    setupTypeId={state.setupTypeId}
                    onSelect={onSetupTypeSelect}
                />
            );
        }
        if (step === 'target') {
            return (
                <PickTarget
                    flow={state.flow}
                    busId={state.busId}
                    inputId={state.inputId}
                    stereoLink={state.stereoLink}
                    outputId={state.outputId}
                    onSelect={onBusSelect}
                    onInputChange={onInputChange}
                    onStereoLinkChange={onStereoLinkChange}
                    onOutputChange={onOutputChange}
                />
            );
        }
        if (step === 'identity') {
            return (
                <Identity
                    flow={state.flow}
                    setupTypeId={state.setupTypeId}
                    busId={state.busId}
                    who={state.who}
                    onWhoChange={onWhoChange}
                />
            );
        }
        if (step === 'options') {
            return (
                <ConfigureOptions
                    busId={state.busId}
                    configure={state.configure}
                    kickSidechain={state.kickSidechain}
                    vocalDucking={state.vocalDucking}
                    setupType={setupType}
                    onConfigureChange={configure => setState(s => ({ ...s, configure }))}
                    onKickSidechainChange={kickSidechain => setState(s => ({ ...s, kickSidechain }))}
                    onVocalDuckingChange={vocalDucking => setState(s => ({ ...s, vocalDucking }))}
                />
            );
        }
        if (step === 'sends') {
            return (
                <Sends
                    busId={state.busId}
                    sends={state.sends}
                    onSendsChange={sends => setState(s => ({ ...s, sends }))}
                />
            );
        }
        if (step === 'sources') {
            return (
                <MonitorSources
                    monitorSources={state.monitorSources}
                    onMonitorSourcesChange={(monitorSources) => {
                        setState(s => ({ ...s, monitorSources }));
                    }}
                />
            );
        }
        return null;
    }, [
        onBusSelect, onInputChange, onOutputChange, onSetupTypeSelect,
        onStereoLinkChange, onWhoChange, setupType, state, step,
    ]);

    if (!isOnline) return null;

    if (applying) {
        return (
            <Apply
                state={state}
                onComplete={onApplyComplete}
                onError={onApplyError}
            />
        );
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Content
                aria-describedby={undefined}
                maxWidth="480px"
                style={wizardDialogStyle}
            >
                <DialogHeader mb="0">
                    { t('Configure something new') }
                </DialogHeader>
                <Flex
                    direction="column"
                    flexGrow="1"
                    minHeight="0"
                    width="100%"
                    className="mmc-scroll-y"
                >
                    { stepContent }
                </Flex>
                {!applying && (stepIndex > 0 || !autoAdvanceStep) && (
                    <Flex
                        align="center"
                        justify="end"
                        gapX="2"
                        mt="3"
                        pt="3"
                        flexShrink="0"
                        width="100%"
                    >
                        {stepIndex > 0 && (
                            <Button
                                size={textSize}
                                variant="soft"
                                color="gray"
                                onClick={goBack}
                                disabled={disabled}
                            >
                                { t('Back') }
                            </Button>
                        )}
                        {isLastStep ? (
                            <Button
                                size={textSize}
                                variant="soft"
                                color="blue"
                                onClick={startApply}
                                disabled={disabled || !advanceEnabled}
                            >
                                { stepButtonLabel(t('Apply'), stepNumber, stepTotal, showStepProgress) }
                            </Button>
                        ) : !autoAdvanceStep && (
                            <Button
                                size={textSize}
                                variant="soft"
                                color="blue"
                                onClick={goNext}
                                disabled={disabled || !advanceEnabled}
                            >
                                { stepButtonLabel(t('Next'), stepNumber, stepTotal, showStepProgress) }
                            </Button>
                        )}
                    </Flex>
                )}
            </Dialog.Content>
        </Dialog.Root>
    );
};
