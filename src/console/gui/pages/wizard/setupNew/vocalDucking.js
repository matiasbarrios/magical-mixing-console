// Vocal → other channels compressor sidechain (setup wizard, Vocals flow).


export const VOCAL_DUCK_MODE = 'Compressor';

export const VOCAL_DUCK_RATIO = '3.0';

export const VOCAL_DUCK_FILTER_TYPE = 'Bell Q3';

export const VOCAL_DUCK_FREQUENCY = 2500;


export const DEFAULT_VOCAL_DUCKING = {
    enabled: false,
    targets: {},
};


export const vocalDuckingFromSetupType = () => ({ ...DEFAULT_VOCAL_DUCKING });


export const isVocalDuckTargetBusId = busId => busId >= 0 && busId <= 15;


export const getVocalDuckTargetBusIds = (vocalDucking, vocalBusId) => {
    if (!vocalDucking?.enabled) return [];
    return Object.entries(vocalDucking.targets ?? {})
        .filter(([id, on]) => (
            on
            && Number(id) !== vocalBusId
            && isVocalDuckTargetBusId(Number(id))
        ))
        .map(([id]) => Number(id));
};


export const isVocalDuckingConfigured = (vocalDucking, vocalBusId) => {
    if (!vocalDucking?.enabled) return true;
    return getVocalDuckTargetBusIds(vocalDucking, vocalBusId).length > 0;
};
