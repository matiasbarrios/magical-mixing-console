// Requirements
import { useCallback, useContext, useMemo } from 'react';
import { Usb } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDevice } from '@magical-mixing/mixers-react';
import { useUiSize } from '../../theme';
import { FallbackContextRoot } from '../context';
import Accordion from '../../icons/accordion';
import AcousticGuitar from '../../icons/acousticGuitar';
import AcousticBass from '../../icons/acousticBass';
import Bagpipes from '../../icons/bagpipes';
import Banjo from '../../icons/banjo';
import BassDrum from '../../icons/bassDrum';
import BassGuitar from '../../icons/bassGuitar';
import Bongos from '../../icons/bongos';
import Clarinet from '../../icons/clarinet';
import Congas from '../../icons/congas';
import Crash from '../../icons/crash';
import Drums from '../../icons/drums';
import ElectricGuitar from '../../icons/electricGuitar';
import FloorTom from '../../icons/floorTom';
import Flute from '../../icons/flute';
import GrandPiano from '../../icons/grandPiano';
import Harmonica from '../../icons/harmonica';
import Harp from '../../icons/harp';
import Headphones from '../../icons/headphones';
import Hihats from '../../icons/hihats';
import InEar from '../../icons/inEar';
import Keys from '../../icons/keys';
import Laptop from '../../icons/laptop';
import Maracas from '../../icons/maracas';
import Metronome from '../../icons/metronome';
import Mobile from '../../icons/mobile';
import PA from '../../icons/pa';
import RackToms from '../../icons/rackToms';
import Ride from '../../icons/ride';
import Sax from '../../icons/sax';
import Snare from '../../icons/snare';
import StageMonitor from '../../icons/stageMonitor';
import StudioMicrophone from '../../icons/studioMicrophone';
import Tambourine from '../../icons/tambourine';
import Triangle from '../../icons/triangle';
import Trombone from '../../icons/trombone';
import Trumpet from '../../icons/trumpet';
import Turntable from '../../icons/turntable';
import Violin from '../../icons/violin';
import Vocals from '../../icons/vocals';
import Xylophone from '../../icons/xylophone';


// Constants
const idToComponent = {
    none: null,
    accordion: Accordion,
    'acoustic-guitar': AcousticGuitar,
    'acoustic-bass': AcousticBass,
    bagpipes: Bagpipes,
    banjo: Banjo,
    'bass-drum': BassDrum,
    'bass-guitar': BassGuitar,
    bongos: Bongos,
    crash: Crash,
    clarinet: Clarinet,
    congas: Congas,
    drums: Drums,
    'electric-guitar': ElectricGuitar,
    'floor-tom': FloorTom,
    flute: Flute,
    'grand-piano': GrandPiano,
    harmonica: Harmonica,
    harp: Harp,
    headphones: Headphones,
    'hi-hats': Hihats,
    'in-ear': InEar,
    keys: Keys,
    laptop: Laptop,
    maracas: Maracas,
    metronome: Metronome,
    mobile: Mobile,
    pa: PA,
    'rack-toms': RackToms,
    ride: Ride,
    sax: Sax,
    snare: Snare,
    'stage-monitor': StageMonitor,
    'studio-microphone': StudioMicrophone,
    tambourine: Tambourine,
    triangle: Triangle,
    trombone: Trombone,
    trumpet: Trumpet,
    turntable: Turntable,
    usb: Usb,
    violin: Violin,
    vocals: Vocals,
    xylophone: Xylophone,
};


const iconOptions = [
    { id: 'none', name: 'None' },
    { id: 'accordion', name: 'Accordion' },
    { id: 'acoustic-guitar', name: 'Acoustic guitar' },
    { id: 'acoustic-bass', name: 'Acoustic bass' },
    { id: 'bagpipes', name: 'Bagpipes' },
    { id: 'banjo', name: 'Banjo' },
    { id: 'bass-drum', name: 'Bass drum' },
    { id: 'bass-guitar', name: 'Bass' },
    { id: 'bongos', name: 'Bongos' },
    { id: 'crash', name: 'Crash' },
    { id: 'clarinet', name: 'Clarinet' },
    { id: 'congas', name: 'Congas' },
    { id: 'drums', name: 'Drums' },
    { id: 'electric-guitar', name: 'Electric guitar' },
    { id: 'floor-tom', name: 'Floor tom' },
    { id: 'flute', name: 'Flute' },
    { id: 'grand-piano', name: 'Grand piano' },
    { id: 'harmonica', name: 'Harmonica' },
    { id: 'harp', name: 'Harp' },
    { id: 'headphones', name: 'Headphones' },
    { id: 'hi-hats', name: 'Hi hats' },
    { id: 'in-ear', name: 'In Ear' },
    { id: 'keys', name: 'Keys' },
    { id: 'laptop', name: 'Laptop' },
    { id: 'maracas', name: 'Maracas' },
    { id: 'metronome', name: 'Metronome' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'pa', name: 'PA' },
    { id: 'rack-toms', name: 'Rack toms' },
    { id: 'ride', name: 'Ride' },
    { id: 'sax', name: 'Saxophone' },
    { id: 'snare', name: 'Snare' },
    { id: 'stage-monitor', name: 'Stage monitor' },
    { id: 'studio-microphone', name: 'Microphone' },
    { id: 'tambourine', name: 'Tambourine' },
    { id: 'triangle', name: 'Triangle' },
    { id: 'trombone', name: 'Trombone' },
    { id: 'trumpet', name: 'Trumpet' },
    { id: 'turntable', name: 'Turntable' },
    { id: 'usb', name: 'USB' },
    { id: 'violin', name: 'Violin' },
    { id: 'vocals', name: 'Vocals' },
    { id: 'xylophone', name: 'Xylophone' },
];


// Exported
export { iconOptions };


export const useFallbackIcons = (type) => {
    const { icons, setIcons } = useContext(FallbackContextRoot);

    const iconGet = useCallback(id => icons[`${type}-${id}`], [icons, type]);

    const iconSet = useCallback((id, iconId) => {
        const n = { ...icons };
        n[`${type}-${id}`] = iconId;
        setIcons(n);
    }, [icons, setIcons, type]);

    const iconsReset = useCallback(() => {
        const n = { ...icons };
        Object.keys(n).forEach((k) => {
            if (k.startsWith(`${type}-`)) delete n[k];
        });
        setIcons(n);
    }, [icons, setIcons, type]);

    return { iconGet, iconSet, iconsReset };
};


export const useFallbackIcon = (type, id) => {
    const { iconGet, iconSet } = useFallbackIcons(type);

    const value = useMemo(() => iconGet(id) || null, [id, iconGet]);
    const set = useCallback(iconId => iconSet(id, iconId), [id, iconSet]);

    return {
        has: true, value, set, options: iconOptions,
    };
};


export const Icon = ({
    id, style, width, height,
}) => {
    const { iconSize } = useUiSize();
    const IconOption = useMemo(() => idToComponent[id] || null, [id]);
    if (!IconOption) return null;
    const w = width != null ? `${width}px` : `${iconSize}px`;
    const h = height != null ? `${height}px` : `${iconSize}px`;
    return <IconOption width={w} height={h} style={style} />;
};


export const FallbackIcon = ({
    has, value, width, height, color, onClick, to, monochrome = false,
}) => {
    const navigate = useNavigate();
    const { disabled } = useDevice();

    const isInteractive = !!(onClick || to);

    const iconStyleFinal = useMemo(() => ({
        cursor: isInteractive ? 'pointer' : 'default',
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        ...(disabled && isInteractive && {
            cursor: 'not-allowed',
            opacity: 0.5,
        }),
        color: !disabled && (monochrome ? 'currentColor' : 'var(--accent-a11)'),
    }), [disabled, width, height, isInteractive, monochrome]);

    const onClickFinal = useCallback((e) => {
        if (disabled) return;
        e.preventDefault();
        if (onClick) onClick(e);
        else if (to) navigate(to);
    }, [disabled, onClick, to, navigate]);

    const iconExists = useMemo(() => !!idToComponent[value], [value]);

    if (!has || !iconExists) return null;

    if (!onClick) {
        return (
            <div {...(!monochrome && { 'data-accent-color': color })} style={iconStyleFinal}>
                <Icon id={value} width={width} height={height} />
            </div>
        );
    }
    return (
        <div role="button" tabIndex={0} {...(!monochrome && { 'data-accent-color': color })} style={iconStyleFinal} onClick={onClickFinal}>
            <Icon id={value} width={width} height={height} />
        </div>
    );
};

