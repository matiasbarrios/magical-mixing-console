// Channel setup presets use vault names from defaultPresets.json.


export const CHANNEL_SETUP_OPTIONS = [
    {
        id: 'vocals',
        flow: 'channel',
        nameKey: 'Vocals',
        icon: 'vocals',
        color: 'blue',
        equalizer: 'Low cut 110',
        compressor: 'Vocal',
        gate: 'Vocal',
    },
    {
        id: 'electric-guitar',
        flow: 'channel',
        nameKey: 'Electric',
        icon: 'electric-guitar',
        color: 'green',
        equalizer: 'Low & high cut',
        compressor: null,
        gate: null,
    },
    {
        id: 'acoustic-guitar',
        flow: 'channel',
        nameKey: 'Acoustic',
        icon: 'acoustic-guitar',
        color: 'green',
        equalizer: 'Low cut 110',
        compressor: null,
        gate: 'Acoustic guitar',
    },
    {
        id: 'kick',
        flow: 'channel',
        nameKey: 'Kick',
        icon: 'bass-drum',
        color: 'red',
        equalizer: 'Kick',
        compressor: 'Kick',
        gate: 'Kick',
    },
    {
        id: 'snare',
        flow: 'channel',
        nameKey: 'Snare',
        icon: 'snare',
        color: 'red',
        equalizer: 'Low cut 110',
        compressor: 'Snare',
        gate: 'Snare',
    },
    {
        id: 'overhead',
        flow: 'channel',
        nameKey: 'Hihat',
        icon: 'hi-hats',
        color: 'red',
        equalizer: 'Low cut 110',
        compressor: null,
        gate: null,
    },
    {
        id: 'keys',
        flow: 'channel',
        nameKey: 'Keys',
        icon: 'keys',
        color: 'cyan',
        equalizer: 'Low cut 110',
        compressor: null,
        gate: null,
    },
    {
        id: 'accordion',
        flow: 'channel',
        nameKey: 'Accordion',
        icon: 'accordion',
        color: 'cyan',
        equalizer: 'Low cut 110',
        compressor: null,
        gate: null,
    },
    {
        id: 'sax',
        flow: 'channel',
        nameKey: 'Saxophone',
        icon: 'sax',
        color: 'cyan',
        equalizer: 'Low cut 110',
        compressor: 'Vocal',
        gate: 'Vocal',
    },
    {
        id: 'congas',
        flow: 'channel',
        nameKey: 'Congas',
        icon: 'congas',
        color: 'orange',
        equalizer: 'Low cut 110',
        compressor: null,
        gate: null,
    },
    {
        id: 'bass',
        flow: 'channel',
        nameKey: 'Bass',
        icon: 'bass-guitar',
        color: 'yellow',
        equalizer: 'Bass',
        compressor: 'Bass',
        gate: null,
    },
];


export const MONITOR_SETUP_OPTIONS = [
    {
        id: 'stage-monitor',
        flow: 'monitor',
        nameKey: 'Stage monitor',
        icon: 'stage-monitor',
        color: 'pink',
        equalizer: null,
        compressor: null,
        gate: null,
    },
];


export const SETUP_TYPES = [...CHANNEL_SETUP_OPTIONS, ...MONITOR_SETUP_OPTIONS];


export const getSetupType = id => SETUP_TYPES.find(t => t.id === id);
