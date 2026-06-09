// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    Box, DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { useVault } from '../../../../components/vault';
import { ICON_STYLE, ICON_SPACER } from '../../../../helpers/values';
import ApplyToggle from '../../../../components/base/applyToggle';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import { BusIconNameLabeled } from '../../../bus/view/name';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';
import { DropdownMenuContent } from '../../../../components/base/dropdownMenuContent';


const PresetPicker = ({
    vaultType, value, onChange, allowNone, disabled,
}) => {
    const { t } = useLanguage();
    const { textSize, menuContentSize } = useUiSize();
    const { vaults } = useVault(vaultType);
    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const displayValue = useMemo(() => value || t('None'), [value, t]);

    const onSelect = useCallback(vaultName => () => {
        onChange(vaultName);
        setOpened(false);
    }, [onChange]);

    const onSelectNone = useCallback(() => {
        onChange(null);
        setOpened(false);
    }, [onChange]);

    if (!vaults.length && !allowNone) return null;

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                square
                variant="soft"
                color="gray"
                onClick={toggleOpened}
                disabled={disabled}
                maxWidth="12rem"
                className="mmc-btn-nowrap"
            >
                <Text size={textSize} color="gray" wrap="nowrap" truncate>
                    { displayValue }
                </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent size={menuContentSize}>
                <DropdownMenu.Label>
                    <Flex align="center" gapX="1">
                        <Box {...ICON_SPACER} />
                        <Text size={textSize}>{ t('Presets') }</Text>
                    </Flex>
                </DropdownMenu.Label>
                {allowNone && (
                    <>
                        <DropdownMenu.Item onSelect={onSelectNone}>
                            <Flex align="center" gapX="1" flexGrow="1">
                                {!value && <CheckIcon style={ICON_STYLE} />}
                                {!!value && <Box {...ICON_SPACER} />}
                                <Text size={textSize}>{ t('None') }</Text>
                            </Flex>
                        </DropdownMenu.Item>
                        {!!vaults.length && <DropdownMenu.Separator />}
                    </>
                )}
                {vaults.map((v) => {
                    const isSelected = value === v.vaultName;
                    return (
                        <DropdownMenu.Item
                            key={v.vaultId}
                            onSelect={onSelect(v.vaultName)}
                        >
                            <Flex align="center" gapX="1" flexGrow="1">
                                {isSelected && <CheckIcon style={ICON_STYLE} />}
                                {!isSelected && <Box {...ICON_SPACER} />}
                                <Text size={textSize}>{ v.vaultName }</Text>
                            </Flex>
                        </DropdownMenu.Item>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const PresetRow = ({
    label, checked, onCheckedChange,
    presetValue, onPresetChange, presetVaultType,
}) => {
    const presetDisabled = !checked;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { label }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" gapX="2" width="100%">
                    <PresetPicker
                        vaultType={presetVaultType}
                        value={presetValue}
                        onChange={onPresetChange}
                        allowNone
                        disabled={presetDisabled}
                    />
                    <ApplyToggle
                        checked={checked}
                        onCheckedChange={onCheckedChange}
                    />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const KickChannelRow = ({ busId, selected, disabled, onSelect }) => {
    const { textSize } = useUiSize();

    const onCheckedChange = useCallback((checked) => {
        if (disabled || !checked) return;
        onSelect(busId);
    }, [busId, disabled, onSelect]);

    return (
        <LabelControlTable.Row style={{ opacity: disabled ? 0.45 : 1 }}>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    <BusIconNameLabeled busId={busId} size={textSize} />
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%">
                    <ApplyToggle
                        checked={selected}
                        onCheckedChange={onCheckedChange}
                        disabled={disabled}
                    />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const DuckTargetRow = ({ busId, enabled, onToggle }) => {
    const { textSize } = useUiSize();
    const onCheckedChange = useCallback((checked) => {
        onToggle(busId, checked);
    }, [busId, onToggle]);

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    <BusIconNameLabeled busId={busId} size={textSize} />
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%">
                    <ApplyToggle checked={enabled} onCheckedChange={onCheckedChange} />
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


const VocalDuckingSection = ({ vocalBusId, vocalDucking, onVocalDuckingChange }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { ofType } = useBusOptions();

    const channels = useMemo(() => ofType('channel').filter(bus => bus.id !== vocalBusId),
        [ofType, vocalBusId]);

    const onEnabledChange = useCallback((enabled) => {
        onVocalDuckingChange({
            ...vocalDucking,
            enabled,
            targets: enabled ? vocalDucking.targets : {},
        });
    }, [onVocalDuckingChange, vocalDucking]);

    const onToggle = useCallback((channelBusId, enabled) => {
        onVocalDuckingChange({
            ...vocalDucking,
            targets: {
                ...vocalDucking.targets,
                [channelBusId]: enabled,
            },
        });
    }, [onVocalDuckingChange, vocalDucking]);

    return (
        <>
            <LabelControlTable.Row>
                <LabelControlTable.Cell width={LABEL_WIDTH}>
                    <Label>
                        { t('Duck other channels when vocals are active') }
                    </Label>
                </LabelControlTable.Cell>
                <LabelControlTable.Cell>
                    <Flex align="center" justify="end" width="100%">
                        <ApplyToggle
                            checked={vocalDucking.enabled}
                            onCheckedChange={onEnabledChange}
                        />
                    </Flex>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
            {vocalDucking.enabled && (
                <>
                    <LabelControlTable.Row>
                        <LabelControlTable.Cell colSpan={2}>
                            <Text size={textSize} color="gray">
                                { t('Which channels should duck under vocals?') }
                            </Text>
                        </LabelControlTable.Cell>
                    </LabelControlTable.Row>
                    {channels.map(bus => (
                        <DuckTargetRow
                            key={bus.id}
                            busId={bus.id}
                            enabled={!!vocalDucking.targets[bus.id]}
                            onToggle={onToggle}
                        />
                    ))}
                </>
            )}
        </>
    );
};


const KickSidechainSection = ({
    bassBusId, kickSidechain, onKickSidechainChange, configure, onConfigureChange,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { ofType } = useBusOptions();

    const channels = useMemo(() => ofType('channel'), [ofType]);

    const onEnabledChange = useCallback((enabled) => {
        onKickSidechainChange({
            ...kickSidechain,
            enabled,
            kickBusId: enabled ? kickSidechain.kickBusId : null,
        });
        if (enabled && !configure.compressor) {
            onConfigureChange({ ...configure, compressor: true });
        }
    }, [configure, kickSidechain, onConfigureChange, onKickSidechainChange]);

    const onKickSelect = useCallback((kickBusId) => {
        onKickSidechainChange({ ...kickSidechain, kickBusId });
    }, [kickSidechain, onKickSidechainChange]);

    if (!kickSidechain.enabled) {
        return (
            <LabelControlTable.Row>
                <LabelControlTable.Cell width={LABEL_WIDTH}>
                    <Label>
                        { t('Kick sidechain ducking') }
                    </Label>
                </LabelControlTable.Cell>
                <LabelControlTable.Cell>
                    <Flex align="center" justify="end" width="100%">
                        <ApplyToggle
                            checked={kickSidechain.enabled}
                            onCheckedChange={onEnabledChange}
                        />
                    </Flex>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
        );
    }

    return (
        <>
            <LabelControlTable.Row>
                <LabelControlTable.Cell width={LABEL_WIDTH}>
                    <Label>
                        { t('Kick sidechain ducking') }
                    </Label>
                </LabelControlTable.Cell>
                <LabelControlTable.Cell>
                    <Flex align="center" justify="end" width="100%">
                        <ApplyToggle
                            checked={kickSidechain.enabled}
                            onCheckedChange={onEnabledChange}
                        />
                    </Flex>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
            <LabelControlTable.Row>
                <LabelControlTable.Cell colSpan={2}>
                    <Text size={textSize} color="gray">
                        { t('Which channel is the kick drum?') }
                    </Text>
                </LabelControlTable.Cell>
            </LabelControlTable.Row>
            {channels.map(bus => (
                <KickChannelRow
                    key={bus.id}
                    busId={bus.id}
                    selected={kickSidechain.kickBusId === bus.id}
                    disabled={bus.id === bassBusId}
                    onSelect={onKickSelect}
                />
            ))}
        </>
    );
};


// Exported
export default ({
    busId,
    configure,
    kickSidechain,
    vocalDucking,
    setupType,
    onConfigureChange,
    onKickSidechainChange,
    onVocalDuckingChange,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const setOption = useCallback(key => (value) => {
        onConfigureChange({ ...configure, [key]: value });
    }, [configure, onConfigureChange]);

    const hasCompressor = !!setupType?.compressor;
    const hasGate = !!setupType?.gate;
    const hasEqualizer = !!setupType?.equalizer;
    const showKickSidechain = setupType?.id === 'bass';
    const showVocalDucking = setupType?.id === 'vocals';

    return (
        <Flex direction="column" gapY="3" width="100%">
            <Text size={textSize} color="gray">
                { t('What presets to apply?') }
            </Text>
            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                {hasEqualizer && (
                    <PresetRow
                        label={t('Equalizer')}
                        checked={configure.equalizer}
                        onCheckedChange={setOption('equalizer')}
                        presetValue={configure.equalizerPreset}
                        onPresetChange={setOption('equalizerPreset')}
                        presetVaultType="preset-equalizer"
                    />
                )}
                {hasCompressor && (
                    <PresetRow
                        label={t('Compressor')}
                        checked={configure.compressor}
                        onCheckedChange={setOption('compressor')}
                        presetValue={configure.compressorPreset}
                        onPresetChange={setOption('compressorPreset')}
                        presetVaultType="preset-compressor"
                    />
                )}
                {hasGate && (
                    <PresetRow
                        label={t('Gate')}
                        checked={configure.gate}
                        onCheckedChange={setOption('gate')}
                        presetValue={configure.gatePreset}
                        onPresetChange={setOption('gatePreset')}
                        presetVaultType="preset-gate"
                    />
                )}
                {showKickSidechain && (
                    <KickSidechainSection
                        bassBusId={busId}
                        kickSidechain={kickSidechain}
                        onKickSidechainChange={onKickSidechainChange}
                        configure={configure}
                        onConfigureChange={onConfigureChange}
                    />
                )}
            </LabelControlTable.List>
            {showVocalDucking && (
                <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                    <VocalDuckingSection
                        vocalBusId={busId}
                        vocalDucking={vocalDucking}
                        onVocalDuckingChange={onVocalDuckingChange}
                    />
                </LabelControlTable.List>
            )}
        </Flex>
    );
};
