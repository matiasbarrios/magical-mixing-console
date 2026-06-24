// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
    Button, Dialog, DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import {
    useBusEqualizerOn,
    useBusEqualizerParametricFrequency,
    useBusEqualizerParametricGain,
    useBusEqualizerParametricOn,
    useBusEqualizerParametricOptions,
    useBusEqualizerParametricQ,
    useBusEqualizerParametricReset,
    useBusEqualizerParametricType,
    useDevice,
} from '@magical-mixing/mixers-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { useVault } from '../../../../components/vault';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import DialogHeader from '../../../../components/base/dialogHeader';
import TextFieldErasable from '../../../../components/base/textFieldErasable';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';
import { DropdownMenuContent } from '../../../../components/base/dropdownMenuContent';


// Variables
const Context = createContext({});


// Internal
const useBandHooks = (busId, parameterId) => {
    const on = useBusEqualizerParametricOn(busId, parameterId);
    const type = useBusEqualizerParametricType(busId, parameterId);
    const frequency = useBusEqualizerParametricFrequency(busId, parameterId);
    const q = useBusEqualizerParametricQ(busId, parameterId);
    const gain = useBusEqualizerParametricGain(busId, parameterId);
    return {
        on, type, frequency, q, gain,
    };
};


const captureBand = (hooks, parameterId) => ({
    parameterId,
    on: hooks.on.has ? hooks.on.value : undefined,
    type: hooks.type.has
        ? hooks.type.options.find(a => a.id === hooks.type.value)?.name
        : undefined,
    frequency: hooks.frequency.has ? hooks.frequency.value : undefined,
    q: hooks.q.has ? hooks.q.value : undefined,
    gain: hooks.q.has && hooks.gain.has ? hooks.gain.value : undefined,
});


const applyEqualizerConfiguration = (c, { eqOn, bands }) => {
    if (eqOn?.has && c.on !== undefined) eqOn.set(c.on);
    c.bands?.forEach((band) => {
        const hooks = bands[band.parameterId];
        if (!hooks) return;
        if (hooks.on?.has) hooks.on.set(band.on !== undefined ? band.on : true);
        if (hooks.type?.has && band.type !== undefined) {
            const o = hooks.type.options.find(a => a.name === band.type);
            if (o) hooks.type.set(o.id);
        }
        if (hooks.frequency?.has && band.frequency !== undefined) {
            hooks.frequency.set(band.frequency);
        }
        if (hooks.q?.has && band.q !== undefined) hooks.q.set(band.q);
        if (hooks.q?.has && hooks.gain?.has && band.gain !== undefined) {
            hooks.gain.set(band.gain);
        }
    });
};


export const useEqualizerPresetHooks = (busId) => {
    const eqOn = useBusEqualizerOn(busId);
    const band0 = useBandHooks(busId, 0);
    const band1 = useBandHooks(busId, 1);
    const band2 = useBandHooks(busId, 2);
    const band3 = useBandHooks(busId, 3);
    const band4 = useBandHooks(busId, 4);
    const band5 = useBandHooks(busId, 5);

    const bands = useMemo(() => ({
        '0': band0, '1': band1, '2': band2, '3': band3, '4': band4, '5': band5,
    }), [band0, band1, band2, band3, band4, band5]);

    const apply = useCallback((c) => {
        applyEqualizerConfiguration(c, { eqOn, bands });
    }, [bands, eqOn]);

    return {
        eqOn, bands, apply, band0, band1, band2, band3, band4, band5,
    };
};


// Exported
export const PresetProvider = ({ children }) => {
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
    const { options: parameters } = useBusEqualizerParametricOptions(busId);
    const {
        apply, band0, band1, band2, band3, band4, band5, eqOn,
    } = useEqualizerPresetHooks(busId);

    const parameterIdsKey = useMemo(() => parameters.map(p => p.id).join(','), [parameters]);
    const parameterIds = useMemo(() => (
        parameterIdsKey ? parameterIdsKey.split(',').map(Number) : []
    ), [parameterIdsKey]);

    useEffect(() => {
        const bandsById = {
            '0': band0, '1': band1, '2': band2, '3': band3, '4': band4, '5': band5,
        };
        const configuration = {
            on: eqOn.has ? eqOn.value : undefined,
            bands: parameterIds
                .map(parameterId => captureBand(bandsById[parameterId], parameterId))
                .filter(b => (
                    b.on !== undefined || b.type !== undefined || b.frequency !== undefined
                    || b.q !== undefined || b.gain !== undefined
                )),
        };
        setCurrentConfiguration(prev => (
            JSON.stringify(prev) === JSON.stringify(configuration) ? prev : configuration
        ));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- band hook objects omitted on purpose
    }, [
        parameterIds,
        eqOn.has, eqOn.value, setCurrentConfiguration,
        band0.on.has, band0.on.value, band0.type.has, band0.type.value,
        band0.frequency.has, band0.frequency.value,
        band0.q.has, band0.q.value, band0.gain.has, band0.gain.value,
        band1.on.has, band1.on.value, band1.type.has, band1.type.value,
        band1.frequency.has, band1.frequency.value,
        band1.q.has, band1.q.value, band1.gain.has, band1.gain.value,
        band2.on.has, band2.on.value, band2.type.has, band2.type.value,
        band2.frequency.has, band2.frequency.value,
        band2.q.has, band2.q.value, band2.gain.has, band2.gain.value,
        band3.on.has, band3.on.value, band3.type.has, band3.type.value,
        band3.frequency.has, band3.frequency.value,
        band3.q.has, band3.q.value, band3.gain.has, band3.gain.value,
        band4.on.has, band4.on.value, band4.type.has, band4.type.value,
        band4.frequency.has, band4.frequency.value,
        band4.q.has, band4.q.value, band4.gain.has, band4.gain.value,
        band5.on.has, band5.on.value, band5.type.has, band5.type.value,
        band5.frequency.has, band5.frequency.value,
        band5.q.has, band5.q.value, band5.gain.has, band5.gain.value,
    ]);

    return { loadConfiguration: apply, currentConfiguration };
};


export const PresetSave = ({ busId, open, onOpenChange }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { currentConfiguration } = usePreset(busId);
    const { vaultSave, removeNonValidNameCharacters } = useVault('preset-equalizer');

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
                                        id="equalizer-preset-name"
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
    const { vaults, vaultLoad } = useVault('preset-equalizer');
    const { reset: resetParametric } = useBusEqualizerParametricReset(busId);
    const { loadConfiguration } = usePreset(busId);
    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const loadVault = useCallback(vaultId => async () => {
        resetParametric();
        const vault = await vaultLoad(vaultId);
        if (!vault) return;
        loadConfiguration(vault);
        setOpened(false);
    }, [loadConfiguration, resetParametric, vaultLoad]);

    const goToPresetsAdmin = useCallback(() => {
        navigate('/vault/list/preset-equalizer');
    }, [navigate]);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger square variant="soft" color="gray" onClick={toggleOpened}>
                <Text size="1">{ t('Presets') }</Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Presets') }</DropdownMenu.Label>
                {vaults.map(v => (
                    <DropdownMenu.Item key={v.vaultId} onSelect={loadVault(v.vaultId)}>
                        { v.vaultName }
                    </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={doPresetSaveOpen}>
                    { t('Save current as new') }
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={goToPresetsAdmin}>
                    { t('Administrate') }
                </DropdownMenu.Item>
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};
