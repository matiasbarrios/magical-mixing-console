// Requirements
import { DEFAULT_KICK_SIDECHAIN } from './kickBassSidechain';
import { DEFAULT_VOCAL_DUCKING } from './vocalDucking';
import { DEFAULT_CONFIGURE, DEFAULT_SENDS } from './templates';


// Exported
export const createInitialState = () => ({
    setupTypeId: null,
    flow: 'channel',
    busId: null,
    inputId: null,
    stereoLink: false,
    outputId: null,
    who: '',
    configure: { ...DEFAULT_CONFIGURE },
    kickSidechain: { ...DEFAULT_KICK_SIDECHAIN },
    vocalDucking: { ...DEFAULT_VOCAL_DUCKING },
    sends: {
        main: DEFAULT_SENDS.main,
        aux: { ...DEFAULT_SENDS.aux },
    },
    monitorSources: {},
});


export const CHANNEL_STEPS = ['type', 'target', 'identity', 'options', 'sends'];

export const MONITOR_STEPS = ['type', 'target', 'identity', 'sources'];


export const getStepsForFlow = flow => (flow === 'monitor' ? MONITOR_STEPS : CHANNEL_STEPS);


export const formatSetupBusName = ({
    flow, setupType, who, t,
}) => {
    if (!setupType) return '';
    const base = flow === 'monitor' ? t('Monitor') : t(setupType.nameKey);
    const suffix = who?.trim();
    return suffix ? `${base} ${suffix}` : base;
};
