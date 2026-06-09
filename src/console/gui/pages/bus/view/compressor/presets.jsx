// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
    Button, Dialog, DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
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
    useBusCompressorRatio,
    useBusCompressorRelease,
    useBusCompressorSidechainFrequency,
    useBusCompressorSidechainOn,
    useBusCompressorSidechainSource,
    useBusCompressorSidechainType,
    useBusCompressorThreshold,
    useDevice,
} from '@magical-mixing/mixers-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { useVault } from '../../../../components/vault';
import { preventDefault } from '../../../../helpers/behaviour';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import DialogHeader from '../../../../components/base/dialogHeader';
import TextFieldErasable from '../../../../components/base/textFieldErasable';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';
import { DropdownMenuContent, DropdownMenuSubContent } from '../../../../components/base/dropdownMenuContent';


// Variables
const Context = createContext({});


// Exported
export const PresetContext = ({ children }) => {
    const [currentConfiguration, setCurrentConfiguration] = useState(null);

    const state = useMemo(() => ({
        currentConfiguration,
        setCurrentConfiguration,
    }), [currentConfiguration]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};


export const usePreset = (busId) => {
    const { currentConfiguration, setCurrentConfiguration } = useContext(Context);

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

    const loadConfiguration = useCallback((c) => {
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

    useEffect(() => {
        setCurrentConfiguration({
            mode: mode.has ? mode.options.find(a => a.id === mode.value)?.name : undefined,
            ratio: ratio.has ? ratio.options.find(a => a.id === ratio.value)?.name : undefined,
            knee: knee.has ? knee.value : undefined,
            threshold: threshold.has ? threshold.value : undefined,
            gain: gain.has ? gain.value : undefined,
            determination: determination.has ? determination.options
                .find(a => a.id === determination.value)?.name : undefined,
            mix: mix.has ? mix.value : undefined,
            automatic: automatic.has ? automatic.value : undefined,
            envelope: envelope.has ? envelope.options
                .find(a => a.id === envelope.value)?.name : undefined,
            attack: attack.has ? attack.value : undefined,
            hold: hold.has ? hold.value : undefined,
            release: release.has ? release.value : undefined,
            sidechainOn: sidechainOn.has ? sidechainOn.value : undefined,
            sidechainType: sidechainType.has ? sidechainType.options
                .find(a => a.id === sidechainType.value)?.name : undefined,
            sidechainFrequency: sidechainFrequency.has ? sidechainFrequency.value : undefined,
            sidechainSource: sidechainSource.has ? sidechainSource.options
                .find(a => a.id === sidechainSource.value)?.name : undefined,
        });
    }, [mode.has, mode.value, mode.options, ratio.has, ratio.value, ratio.options,
        knee.has, knee.value, threshold.has, threshold.value, gain.has, gain.value,
        determination.has, determination.value, determination.options, mix.has, mix.value,
        automatic.has, automatic.value, envelope.has, envelope.value, envelope.options,
        attack.has, attack.value, hold.has, hold.value, release.has, release.value,
        sidechainOn.has, sidechainOn.value, sidechainType.has, sidechainType.value,
        sidechainType.options, sidechainFrequency.has, sidechainFrequency.value,
        sidechainSource.has, sidechainSource.value, sidechainSource.options,
        setCurrentConfiguration]);

    return { loadConfiguration, currentConfiguration };
};


export const PresetSave = ({ busId, open, onOpenChange }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { currentConfiguration } = usePreset(busId);
    const { vaultSave, removeNonValidNameCharacters } = useVault('preset-compressor');

    const [presetName, setPresetName] = useState('');

    const presetSave = useCallback(async () => {
        if (!presetName.trim()) return;
        await vaultSave(presetName.trim(), currentConfiguration);
        onOpenChange(false);
    }, [onOpenChange, presetName, currentConfiguration, vaultSave]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { t('Save current configuration as a new preset') }
                </DialogHeader>
                <Flex direction="column" gapY="3">
                    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                        <LabelControlTable.Row>
                            <LabelControlTable.Cell width={LABEL_WIDTH}>
                                <Label>
                                    { t('Name') }
                                </Label>
                            </LabelControlTable.Cell>
                            <LabelControlTable.Cell>
                                <Flex align="center" justify="end" width="100%" minWidth="0">
                                    <TextFieldErasable
                                        id="preset-name"
                                        placeholder={t('Preset name')}
                                        value={presetName}
                                        set={setPresetName}
                                        onChange={removeNonValidNameCharacters}
                                        onEnter={presetSave}
                                        debounceTime={200}
                                        width="100%" maxWidth="16rem"
                                    />
                                </Flex>
                            </LabelControlTable.Cell>
                        </LabelControlTable.Row>
                    </LabelControlTable.List>
                    <Flex align="center" justify="end" gapX="1">
                        <Button
                            size={textSize}
                            variant="soft"
                            color="blue"
                            onClick={presetSave}
                            disabled={disabled || !presetName.trim()}
                        >
                            { t('Save') }
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};


export const PresetsMenu = ({ busId, doPresetSaveOpen }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { vaults, vaultLoad } = useVault('preset-compressor');
    const { loadConfiguration } = usePreset(busId);
    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const loadVault = useCallback(vaultId => async () => {
        const vault = await vaultLoad(vaultId);
        if (!vault) return;
        loadConfiguration(vault);
        setOpened(false);
    }, [loadConfiguration, vaultLoad]);

    const goToPresetsAdmin = useCallback(() => {
        navigate('/vault/list/preset-compressor');
    }, [navigate]);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger square variant="soft" color="gray" onClick={toggleOpened}>
                <Text size="1">{ t('Presets') }</Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                {vaults.map(v => (
                    <DropdownMenu.Item key={v.vaultId} onSelect={loadVault(v.vaultId)}>
                        <Text size="2">{ v.vaultName }</Text>
                    </DropdownMenu.Item>
                ))}
                {!!vaults.length && <DropdownMenu.Separator />}
                <DropdownMenu.Item onSelect={preventDefault(doPresetSaveOpen)}>
                    <Text size="2">{ t('Save current as new') }</Text>
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={preventDefault(goToPresetsAdmin)}>
                    <Text size="2">{ t('Administrate') }</Text>
                </DropdownMenu.Item>
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


export default ({ busId, doPresetSaveOpen }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { vaults, vaultLoad } = useVault('preset-compressor');
    const { loadConfiguration } = usePreset(busId);

    const loadVault = useCallback(vaultId => async () => {
        const vault = await vaultLoad(vaultId);
        if (!vault) return;
        loadConfiguration(vault);
    }, [loadConfiguration, vaultLoad]);

    const goToPresetsAdmin = useCallback(() => {
        navigate('/vault/list/preset-compressor');
    }, [navigate]);

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{ t('Presets') }</DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                {vaults.map(v => (
                    <DropdownMenu.Item key={v.vaultId} onSelect={loadVault(v.vaultId)}>
                        <Text size="2">{ v.vaultName }</Text>
                    </DropdownMenu.Item>
                ))}
                {!!vaults.length && <DropdownMenu.Separator />}
                <DropdownMenu.Item onSelect={preventDefault(doPresetSaveOpen)}>
                    <Text size="2">{ t('Save current as new') }</Text>
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={preventDefault(goToPresetsAdmin)}>
                    <Text size="2">{ t('Administrate') }</Text>
                </DropdownMenu.Item>
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};
