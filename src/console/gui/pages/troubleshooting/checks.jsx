// Requirements
import { useCallback, useMemo } from 'react';
import {
    useBusAutomixId, useBusCompressorOn, useBusDcaOn, useBusEqualizerOn, useBusGateGainReduction,
    useBusGateOn, useBusInputId, useBusInputTrim, useBusInsertOn, useBusLevel, useBusMute,
    useBusOptions, useBusPan, useBusToOn, useBusToPan, useDcaLevel, useDcaMute, useDcaName,
    useDcaOptions, useInputGain, useInputPhantom, useMgMute, useMgName, useMgOptions,
    useBusMgOn, useOutputOptions, useOutputSource, useOutputSourceDefault,
} from '@magical-mixing/mixers-react';
import Gain from '../input/view/gain';
import Phantom from '../input/view/phantom';
import Level from '../bus/view/level';
import Mute from '../bus/view/mute';
import Pan from '../bus/view/pan';
import SendPan from '../bus/view/fromTo/pan';
import { useLanguage } from '../../components/language';
import { useBusNameTranslated } from '../bus/view/name';
import { useInputNameTranslated } from '../input/view/name';
import { formatLevelDb, formatPanHundred } from '../../helpers/format';
import { CheckRow } from './row';
import {
    isGateClosed, isLevelAtMinimum, isPanHard, localInputForChannel,
} from './levels';


// Internal
const SourceName = ({ inputId }) => {
    const { name } = useInputNameTranslated(inputId);
    return name;
};


const BusSourceName = ({ busId, side }) => {
    const { t } = useLanguage();
    const { name } = useBusNameTranslated(busId);
    if (!side) return name;
    return `${name} ${t(side)}`;
};


const SourceOptionName = ({ option }) => {
    const { t } = useLanguage();
    if (!option) return null;
    if (option.type === 'bus') {
        return <BusSourceName busId={option.externalId} side={option.side} />;
    }
    if (option.type === 'input') return <SourceName inputId={option.externalId} />;
    if (option.type === 'fx') return t('FX');
    return null;
};


const GainRow = ({ inputId }) => {
    const { t } = useLanguage();
    const { has, value, minimum } = useInputGain(inputId);

    if (!has || typeof value !== 'number') return null;

    return (
        <CheckRow
            id={`gain-${inputId}`}
            label={t('Gain')}
            detail={isLevelAtMinimum(value, minimum) ? t('Gain may be too low') : undefined}
            blocking={false}
            control={<Gain inputId={inputId} />}
            controlBelow
        />
    );
};


const PhantomRow = ({ inputId }) => {
    const { t } = useLanguage();
    const { has, value } = useInputPhantom(inputId);

    if (!has || typeof value !== 'boolean') return null;

    return (
        <CheckRow
            id={`phantom-${inputId}`}
            label={t('Phantom')}
            value={value ? t('On') : t('Off')}
            detail={t('Turn phantom on only if the microphone needs it')}
            blocking={false}
            control={<Phantom inputId={inputId} />}
        />
    );
};


const TrimRow = ({ busId, inputId }) => {
    const { t } = useLanguage();
    const { has, value } = useBusInputTrim(busId, inputId);

    if (!has || typeof value !== 'number') return null;

    return (
        <CheckRow
            id={`trim-${busId}`}
            label={t('Trim')}
            value={`${formatLevelDb(value)} dB`}
            blocking={false}
        />
    );
};


const InputChecks = ({ busId }) => {
    const { t } = useLanguage();
    const { get: getBus } = useBusOptions();
    const bus = useMemo(() => getBus(busId), [getBus, busId]);
    const {
        has, value, set, options, get,
    } = useBusInputId(busId);
    const option = value == null ? undefined : get(value);
    const local = useMemo(() => localInputForChannel(bus, options), [bus, options]);
    const useLocal = useCallback(() => {
        if (local) set(local.id);
    }, [local, set]);

    if (!has || value === undefined) return null;

    const isOff = value == null || !option || option.type === 'off';
    const isUsb = option?.type === 'usb';
    const blocking = isOff || isUsb;
    let detail;
    if (isOff) detail = t('This channel has no input');
    else if (isUsb && bus?.type === 'line') {
        detail = t('The line inputs will not be heard. If the audio is coming from the computer, this is expected.');
    } else if (isUsb) {
        detail = t('A microphone on the XLR will not be heard. If the audio is coming from the computer, this is expected.');
    }
    let actionLabel;
    if (blocking && local) actionLabel = isUsb ? t('Use the local input') : t('Fix');

    return (
        <>
            <CheckRow
                id={`source-${busId}`}
                label={t('Source')}
                value={isOff ? t('Off') : <SourceName inputId={value} />}
                detail={detail}
                blocking={blocking}
                action={actionLabel ? useLocal : undefined}
                actionLabel={actionLabel}
            />
            {!isOff && (
                <>
                    <GainRow inputId={value} />
                    <PhantomRow inputId={value} />
                    <TrimRow busId={busId} inputId={value} />
                </>
            )}
        </>
    );
};


const LevelRow = ({
    busId, blockingId, labelKey, editable = false,
}) => {
    const { t } = useLanguage();
    const {
        has, value, set, minimum,
    } = useBusLevel(busId);
    const raise = useCallback(() => set(0), [set]);

    if (!has || typeof value !== 'number') return null;

    const blocking = isLevelAtMinimum(value, minimum);

    return (
        <CheckRow
            id={blockingId}
            label={t(labelKey)}
            value={editable ? undefined : `${formatLevelDb(value)} dB`}
            blocking={blocking}
            action={!editable && blocking ? raise : undefined}
            actionLabel={!editable && blocking ? t('Fix') : undefined}
            control={editable ? <Level busId={busId} /> : undefined}
            controlBelow={editable}
        />
    );
};


const MuteRow = ({
    busId, blockingId, labelKey, editable = false,
}) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusMute(busId);
    const unmute = useCallback(() => set(false), [set]);

    if (!has || typeof value !== 'boolean') return null;

    return (
        <CheckRow
            id={blockingId}
            label={t(labelKey)}
            value={value ? t('Muted') : t('Unmuted')}
            blocking={value}
            action={!editable && value ? unmute : undefined}
            actionLabel={!editable && value ? t('Fix') : undefined}
            control={editable ? <Mute busId={busId} /> : undefined}
        />
    );
};


const ChannelPanRow = ({ busId, mainId }) => {
    const { t } = useLanguage();
    const { has, value } = useBusToPan(busId, mainId);

    if (!has || typeof value !== 'number') return null;

    return (
        <CheckRow
            id={`pan-${busId}`}
            label={t('Channel pan')}
            value={formatPanHundred(value)}
            detail={isPanHard(value) ? t('The other speaker will be quiet') : undefined}
            blocking={false}
            control={<SendPan busIdFrom={busId} busIdTo={mainId} />}
        />
    );
};


const SwitchOffRow = ({
    id, label, on, set, detail, blocking,
}) => {
    const { t } = useLanguage();
    const turnOff = useCallback(() => set(false), [set]);

    return (
        <CheckRow
            id={id}
            label={label}
            value={on ? t('On') : t('Off')}
            detail={detail}
            blocking={blocking}
            action={on ? turnOff : undefined}
            actionLabel={on ? t('Turn off') : undefined}
        />
    );
};


const EqualizerRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusEqualizerOn(busId);

    if (!has || typeof value !== 'boolean') return null;

    return (
        <SwitchOffRow
            id={`eq-${busId}`}
            label={t('Equalizer')}
            on={value}
            set={set}
            blocking={false}
        />
    );
};


const CompressorRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusCompressorOn(busId);

    if (!has || typeof value !== 'boolean') return null;

    return (
        <SwitchOffRow
            id={`comp-${busId}`}
            label={t('Compressor')}
            on={value}
            set={set}
            blocking={false}
        />
    );
};


const GateClosedRow = ({ busId, set }) => {
    const { t } = useLanguage();
    const { value } = useBusGateGainReduction(busId);
    const closed = isGateClosed(value);

    return (
        <SwitchOffRow
            id={`gate-${busId}`}
            label={t('Gate')}
            on
            set={set}
            blocking={closed}
            detail={closed ? t('The gate is closing this channel') : undefined}
        />
    );
};


const GateRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusGateOn(busId);

    if (!has || typeof value !== 'boolean') return null;
    if (!value) {
        return (
            <SwitchOffRow
                id={`gate-${busId}`}
                label={t('Gate')}
                on={false}
                set={set}
                blocking={false}
            />
        );
    }
    return <GateClosedRow busId={busId} set={set} />;
};


const InsertRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusInsertOn(busId);
    const turnOff = useCallback(() => set(false), [set]);

    if (!has || typeof value !== 'boolean') return null;

    return (
        <CheckRow
            id={`insert-${busId}`}
            label={t('Insert')}
            value={value ? t('On') : t('Off')}
            detail={value
                ? t('Insert is on. The channel is listening to the insert instead of the source.')
                : undefined}
            blocking={value}
            action={value ? turnOff : undefined}
            actionLabel={value ? t('Fix') : undefined}
        />
    );
};


const AutomixRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusAutomixId(busId);
    const remove = useCallback(() => set(0), [set]);

    if (!has || !value) return null;

    return (
        <CheckRow
            id={`automix-${busId}`}
            label={t('Automix')}
            detail={t('Automix can turn this channel down when other microphones are open')}
            blocking={false}
            action={remove}
            actionLabel={t('Remove from automix')}
        />
    );
};


const SendRow = ({ busId, mainId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useBusToOn(busId, mainId);
    const assign = useCallback(() => set(true), [set]);

    if (!has || typeof value !== 'boolean') return null;

    return (
        <CheckRow
            id={`send-${busId}`}
            label={t('Send to Main')}
            value={value ? t('On') : t('Off')}
            blocking={!value}
            action={value ? undefined : assign}
            actionLabel={value ? undefined : t('Fix')}
        />
    );
};


const DcaLabel = ({ dcaId }) => {
    const { t } = useLanguage();
    const { get } = useDcaOptions();
    const option = useMemo(() => get(dcaId), [get, dcaId]);
    const { has, value } = useDcaName(dcaId);
    const fallback = `${t('DCA')} ${option?.number ?? ''}`.trim();
    return (has && value) ? value : fallback;
};


const DcaBlock = ({ dcaId }) => {
    const { t } = useLanguage();
    const { has: muteHas, value: muted, set: muteSet } = useDcaMute(dcaId);
    const {
        has: levelHas, value: level, set: levelSet, minimum,
    } = useDcaLevel(dcaId);
    const isMuted = muteHas && muted === true;
    const atFloor = levelHas && isLevelAtMinimum(level, minimum);
    const fix = useCallback(() => {
        if (isMuted) muteSet(false);
        if (atFloor) levelSet(0);
    }, [atFloor, isMuted, levelSet, muteSet]);

    if (!isMuted && !atFloor) return null;

    const parts = [];
    if (isMuted) parts.push(t('Muted'));
    if (typeof level === 'number') parts.push(`${formatLevelDb(level)} dB`);

    return (
        <CheckRow
            id={`dca-${dcaId}`}
            label={<DcaLabel dcaId={dcaId} />}
            value={parts.join(' · ')}
            detail={t('This DCA affects every channel assigned to it')}
            blocking
            action={fix}
            actionLabel={t('Fix')}
        />
    );
};


const DcaAssigned = ({ busId, dcaId }) => {
    const { has, value } = useBusDcaOn(busId, dcaId);
    if (!has || !value) return null;
    return <DcaBlock dcaId={dcaId} />;
};


const DcaChecks = ({ busId }) => {
    const { options } = useDcaOptions();
    return options.map(dca => (
        <DcaAssigned key={dca.id} busId={busId} dcaId={dca.id} />
    ));
};


const MgLabel = ({ mgId }) => {
    const { t } = useLanguage();
    const { get } = useMgOptions();
    const option = useMemo(() => get(mgId), [get, mgId]);
    const { has, value } = useMgName(mgId);
    const fallback = `${t('Mute group')} ${option?.number ?? ''}`.trim();
    return (has && value) ? value : fallback;
};


const MgBlock = ({ mgId }) => {
    const { t } = useLanguage();
    const { has, value, set } = useMgMute(mgId);
    const unmute = useCallback(() => set(false), [set]);

    if (!has || value !== true) return null;

    return (
        <CheckRow
            id={`mg-${mgId}`}
            label={<MgLabel mgId={mgId} />}
            value={t('Muted')}
            detail={t('This mute group affects every channel in it')}
            blocking
            action={unmute}
            actionLabel={t('Fix')}
        />
    );
};


const MgAssigned = ({ busId, mgId }) => {
    const { has, value } = useBusMgOn(busId, mgId);
    if (!has || !value) return null;
    return <MgBlock mgId={mgId} />;
};


const MgChecks = ({ busId }) => {
    const { options } = useMgOptions();
    return options.map(mg => (
        <MgAssigned key={mg.id} busId={busId} mgId={mg.id} />
    ));
};


const MainPanRow = ({ busId }) => {
    const { t } = useLanguage();
    const { has, value } = useBusPan(busId);

    if (!has || typeof value !== 'number') return null;

    return (
        <CheckRow
            id="main-pan"
            label={t('Main pan')}
            value={formatPanHundred(value)}
            detail={isPanHard(value) ? t('The other speaker will be quiet') : undefined}
            blocking={false}
            control={<Pan busId={busId} />}
        />
    );
};


const MainOutputRow = ({ outputId }) => {
    const { t } = useLanguage();
    const {
        has, value, set, get,
    } = useOutputSource(outputId);
    const defaultSource = useOutputSourceDefault(outputId);
    const restore = useCallback(() => {
        if (defaultSource) set(defaultSource.id);
    }, [defaultSource, set]);

    if (!has || value === undefined || !defaultSource) return null;

    const current = get(value);
    const blocking = value !== defaultSource.id;

    return (
        <CheckRow
            id={`output-${outputId}`}
            label={t('Main output')}
            value={current ? <SourceOptionName option={current} /> : undefined}
            detail={blocking ? t('Main output is not the Main mix') : undefined}
            blocking={blocking}
            action={blocking ? restore : undefined}
            actionLabel={blocking ? t('Fix') : undefined}
        />
    );
};


const OutputSourceCheck = () => {
    const { options } = useOutputOptions();
    const outputId = options.find(option => option.type === 'main')?.id;
    if (outputId == null) return null;
    return <MainOutputRow outputId={outputId} />;
};


const Checks = ({ busId }) => {
    const { mainOne } = useBusOptions();
    const mainId = mainOne?.id;

    return (
        <>
            <InputChecks busId={busId} />
            <LevelRow
                busId={busId}
                blockingId={`channel-level-${busId}`}
                labelKey="Channel level"
                editable
            />
            <MuteRow
                busId={busId}
                blockingId={`channel-mute-${busId}`}
                labelKey="Channel mute"
                editable
            />
            {mainId != null && <ChannelPanRow busId={busId} mainId={mainId} />}
            <EqualizerRow busId={busId} />
            <CompressorRow busId={busId} />
            <GateRow busId={busId} />
            <InsertRow busId={busId} />
            <AutomixRow busId={busId} />
            {mainId != null && <SendRow busId={busId} mainId={mainId} />}
            <DcaChecks busId={busId} />
            <MgChecks busId={busId} />
            {mainId != null && (
                <>
                    <LevelRow busId={mainId} blockingId="main-level" labelKey="Main level" editable />
                    <MainPanRow busId={mainId} />
                    <MuteRow busId={mainId} blockingId="main-mute" labelKey="Main mute" />
                </>
            )}
            <OutputSourceCheck />
        </>
    );
};


// Exported
export { Checks };
