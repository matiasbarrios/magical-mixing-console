// Requirements
import { useCallback, useMemo, useState } from 'react';
import { Pencil1Icon } from '@radix-ui/react-icons';
import {
    Button, Flex, IconButton, Text,
} from '@radix-ui/themes';
import {
    useBusEqualizerMode, useBusEqualizerOn,
    useBusRTA, useBusRTAPosition, useDevice,
} from '@magical-mixing/mixers-react';
import { RESET_ROAM_ID, focusRoamAttrs } from '../../../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../../../components/base/resetIcon';
import { ICON_STYLE } from '../../../../helpers/values';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { ActiveToggleButton } from '../../../../components/base/activeToggleButton';
import { DropdownSelect } from '../../../../components/base/dropdownSelect';
import { useEqualizer } from './context';
import Edit, { HasEditableFilters, ResetWhich } from './edit';
import { PresetProvider, PresetSave, PresetsMenu } from './presets';


// Internal
const RtaPosition = ({ busId }) => {
    const { t } = useLanguage();
    const { rtaOn, setRtaOn } = useEqualizer();
    const {
        has: positionHas, value: positionValue, set: positionSet, options,
    } = useBusRTAPosition(busId);

    const color = rtaOn ? 'blue' : 'gray';

    const positionSelect = useCallback((vInt) => {
        setRtaOn(vInt !== -1);
        if (vInt !== -1) positionSet(vInt);
    }, [positionSet, setRtaOn]);

    return (
        <DropdownSelect.Root set={positionSelect}>
            <DropdownSelect.Trigger square variant="soft" color={color}>
                <Text size="1" wrap="nowrap">{ t('RTA') }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('Real time analysis') }</DropdownSelect.Label>
                <DropdownSelect.Option id={-1} selected={!rtaOn}>
                    <Text size="2">{ t('Off') }</Text>
                </DropdownSelect.Option>
                {positionHas && options.map(o => (
                    <DropdownSelect.Option
                        key={o.id}
                        id={o.id}
                        selected={rtaOn && positionValue === o.id}
                    >
                        <Text size="2">{ t(o.name) }</Text>
                    </DropdownSelect.Option>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const RtaSpectrum = () => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { spectrumActive, setSpectrumActive } = useEqualizer();

    const toggle = useCallback(() => {
        setSpectrumActive(!spectrumActive);
    }, [spectrumActive, setSpectrumActive]);

    return (
        <Button
            size={textSize}
            variant="soft"
            color={spectrumActive ? 'blue' : 'gray'}
            onClick={toggle}
            disabled={disabled}
        >
            <Text size="1">{ t('Spectrum') }</Text>
        </Button>
    );
};


const RtaMin = () => {
    const { t } = useLanguage();
    const { rtaMin, setRtaMin } = useEqualizer();
    const rtaMinOptions = useMemo(() => [-128, -100, -80, -60, -40, -20], []);

    return (
        <DropdownSelect.Root set={setRtaMin}>
            <DropdownSelect.Trigger square variant="soft" color="gray">
                <Text size="1" wrap="nowrap">{ `${t('Minimum')}: ${rtaMin}dB` }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('Minimum dB') }</DropdownSelect.Label>
                {rtaMinOptions.map(o => (
                    <DropdownSelect.Option key={o} id={o} selected={rtaMin === o}>
                        <Text size="2">{ `${o} db` }</Text>
                    </DropdownSelect.Option>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const Rta = ({ busId }) => {
    const { has } = useBusRTA(busId);
    if (!has) return null;

    return (
        <>
            <RtaPosition busId={busId} />
            <RtaSpectrum />
            <RtaMin />
        </>
    );
};


const On = ({ busId }) => {
    const { has, value, toggle } = useBusEqualizerOn(busId);

    if (!has || value === undefined) return null;

    return <ActiveToggleButton active={value} onClick={toggle} inactiveColor="red" />;
};


const Mode = ({ busId }) => {
    const { t } = useLanguage();
    const {
        has, value, set, options,
    } = useBusEqualizerMode(busId);

    const displayValue = useMemo(() => t(options.find(o => o.id === value)?.name || ''),
        [options, value, t]);

    if (!has || value === undefined) return null;

    return (
        <DropdownSelect.Root set={set}>
            <DropdownSelect.Trigger square variant="soft" color="gray">
                <Text size="1" wrap="nowrap">{ displayValue }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('Mode') }</DropdownSelect.Label>
                {options.map(o => (
                    <DropdownSelect.Option key={o.id} id={o.id} selected={value === o.id}>
                        <Text size="2">{ t(o.name) }</Text>
                    </DropdownSelect.Option>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


const EditButton = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const [open, setOpen] = useState(false);

    return (
        <HasEditableFilters busId={busId}>
            <>
                <Flex align="center" gap="2">
                    <IconButton
                        size={textSize}
                        variant="soft"
                        color="gray"
                        onClick={() => setOpen(true)}
                        disabled={disabled}
                    >
                        <Pencil1Icon style={ICON_STYLE} />
                    </IconButton>
                    <ResetWhich busId={busId}>
                        {({ reset }) => (
                            <IconButton
                                size={textSize}
                                variant="soft"
                                color="gray"
                                onClick={reset}
                                disabled={disabled}
                                aria-label={t('Reset')}
                                {...focusRoamAttrs(RESET_ROAM_ID)}
                            >
                                <ResetIcon />
                            </IconButton>
                        )}
                    </ResetWhich>
                </Flex>
                {!!open && (
                    <Edit busId={busId} open={open} onOpenChange={setOpen} />
                )}
            </>
        </HasEditableFilters>
    );
};


const DbRange = ({ busId }) => {
    const { t } = useLanguage();
    const { has: modeHas, is: modeIs } = useBusEqualizerMode(busId);
    const { dbRange, setDbRange } = useEqualizer();
    const dbRanges = useMemo(() => [3, 6, 16, 20, 30], []);

    const isParametric = useMemo(() => !modeHas || modeIs('Parametric'), [modeIs, modeHas]);

    if (!isParametric) return null;

    return (
        <DropdownSelect.Root set={setDbRange}>
            <DropdownSelect.Trigger square variant="soft" color="gray">
                <Text size="1" wrap="nowrap">{ `${t('Range')}: ${dbRange}dB` }</Text>
            </DropdownSelect.Trigger>
            <DropdownSelect.Content>
                <DropdownSelect.Label>{ t('dB range') }</DropdownSelect.Label>
                {dbRanges.map(o => (
                    <DropdownSelect.Option key={o} id={o} selected={dbRange === o}>
                        <Text size="2">{ `${o}dB` }</Text>
                    </DropdownSelect.Option>
                ))}
            </DropdownSelect.Content>
        </DropdownSelect.Root>
    );
};


// Exported
export default ({ busId }) => {
    const { has: modeHas, is: modeIs } = useBusEqualizerMode(busId);
    const isParametric = useMemo(() => !modeHas || modeIs('Parametric'), [modeIs, modeHas]);
    const [presetSaveOpen, setPresetSaveOpen] = useState(false);
    const doPresetSaveOpen = useCallback(() => {
        setPresetSaveOpen(true);
    }, []);

    const toolbar = (
        <Flex align="start" gapX="2" gapY="2" wrap="wrap" width="100%">
            <On busId={busId} />
            {isParametric && (
                <PresetsMenu busId={busId} doPresetSaveOpen={doPresetSaveOpen} />
            )}
            <Mode busId={busId} />
            <DbRange busId={busId} />
            <Rta busId={busId} />
            <EditButton busId={busId} />
        </Flex>
    );

    if (!isParametric) return toolbar;

    return (
        <PresetProvider>
            {toolbar}
            <PresetSave busId={busId} open={presetSaveOpen} onOpenChange={setPresetSaveOpen} />
        </PresetProvider>
    );
};
