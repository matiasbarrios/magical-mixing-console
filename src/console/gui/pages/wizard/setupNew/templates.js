// Requirements


export { getSetupType } from './options';


export const DEFAULT_CONFIGURE = {
    equalizer: true,
    compressor: true,
    gate: true,
    equalizerPreset: null,
    compressorPreset: null,
    gatePreset: null,
};


export const configureFromSetupType = setupType => ({
    ...DEFAULT_CONFIGURE,
    equalizer: !!setupType?.equalizer,
    compressor: !!setupType?.compressor,
    gate: !!setupType?.gate,
    equalizerPreset: setupType?.equalizer ?? null,
    compressorPreset: setupType?.compressor ?? null,
    gatePreset: setupType?.gate ?? null,
});


export const DEFAULT_SENDS = {
    main: true,
    aux: {},
};


export const MONITOR_DEFAULT_LEVEL = -6;
