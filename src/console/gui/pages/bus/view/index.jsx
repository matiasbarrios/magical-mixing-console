// Requirements
import {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { useParams, useSearchParams } from 'react-router';
import {
    useBusCompressor,
    useBusEqualizer,
    useBusFromOptions,
    useBusFx,
    useBusFxId,
    useBusGate,
    useBusInput,
    useBusInsert,
    useBusInsertFx,
    useBusLevel,
    useBusMonitor,
    useBusMute,
    useBusOptions,
    useBusPan,
    useBusPolarity,
    useBusStereoLink,
    useBusToOn,
    useBusToOptions,
    useDevice,
    useOutputOptions,
} from '@magical-mixing/mixers-react';
import { Flex } from '@radix-ui/themes';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useScreen } from '../../../components/base/screen';
import { isMobile } from '../../../platform';
import { HeaderIconButton } from '../../../components/layout/header/iconButton';
import { ICON_STYLE } from '../../../helpers/values';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import {
    EntityTabsShell, TabPanelFill, TabPanelScrollable,
} from '../../../components/layout/entity/tabs';
import EntityViewShell from '../../../components/layout/entity/shell';
import EntityNotFound from '../../../components/base/entityNotFound';
import {
    useFallbackBusColor, useFallbackBusesSorted, useFallbackBusDca, useFallbackBusMg,
} from '../../../components/fallback';
import { useLanguage } from '../../../components/language';
import { buildBusPath, useBusViewTab } from './useBusViewTab';
import Edit from './edit';
import From from './fromTo/from';
import Input from './input';
import To from './fromTo/to';
import Gate from './gate';
import Equalizer from './equalizer';
import Compressor from './compressor';
import Fx from './fx';
import Insert from './insert';
import Outputs from './outputs';
import Monitor from './monitor';
import Mg from './mg';
import Dca from './dca';
import General from './general';


// Internal
const useParsedParams = () => {
    const { busId } = useParams();
    return { busId: parseInt(busId, 10) };
};


const SoloHasReader = ({ busId, soloBusId, onHasChange }) => {
    const { has } = useBusToOn(busId, soloBusId);

    useEffect(() => {
        onHasChange(has);
    }, [has, onHasChange]);

    return null;
};


const BusTabs = ({ bus }) => {
    const { t } = useLanguage();
    const { isLandscape } = useScreen();
    const { soloOne } = useBusOptions();
    const { has: gateHas } = useBusGate(bus.id);
    const { has: equalizerHas } = useBusEqualizer(bus.id);
    const { has: compressorHas } = useBusCompressor(bus.id);
    const { has: fxHas } = useBusFx(bus.id);
    const { has: fxIdHas, options: fxIdOptions } = useBusFxId(bus.id);
    const { has: insertHas } = useBusInsert(bus.id);
    const { has: insertFxHas, options: insertFxOptions } = useBusInsertFx(bus.id);
    const { has: inputHas } = useBusInput(bus.id);
    const { has: monitorHas } = useBusMonitor(bus.id);
    const { has: levelHas } = useBusLevel(bus.id);
    const { has: panHas } = useBusPan(bus.id);
    const { has: polarityHas } = useBusPolarity(bus.id);
    const { has: stereoLinkHas } = useBusStereoLink(bus.id);
    const { has: muteHas } = useBusMute(bus.id);
    const [soloHas, setSoloHas] = useState(undefined);
    const onSoloHasChange = useCallback(has => setSoloHas(has), []);
    const { has: dcaHas } = useFallbackBusDca(bus.id);
    const { has: mgHas } = useFallbackBusMg(bus.id);
    const { options: fromOptions } = useBusFromOptions(bus.id);
    const { options: busesTo } = useBusToOptions(bus.id);
    const { options: outputOptions } = useOutputOptions();

    useEffect(() => {
        if (soloOne?.id === undefined) setSoloHas(undefined);
    }, [soloOne?.id]);

    const fromTab = useMemo(() => fromOptions.length > 0, [fromOptions.length]);

    const toTab = useMemo(() => busesTo.some(b => b.id !== soloOne?.id),
        [busesTo, soloOne]);

    const insertTab = useMemo(() => insertHas && insertFxHas && insertFxOptions.length > 0,
        [insertHas, insertFxHas, insertFxOptions.length]);

    const fxTab = useMemo(() => fxHas && fxIdHas && fxIdOptions.length > 0,
        [fxHas, fxIdHas, fxIdOptions.length]);

    const inputTab = useMemo(() => inputHas, [inputHas]);

    const hasQuickActions = useMemo(() => polarityHas || stereoLinkHas || muteHas
        || soloHas === true,
    [polarityHas, stereoLinkHas, muteHas, soloHas]);

    const generalTab = useMemo(() => levelHas || panHas || hasQuickActions,
        [levelHas, panHas, hasQuickActions]);

    const generalInTab = useMemo(() => isMobile && isLandscape && generalTab,
        [isLandscape, generalTab]);

    const mgTab = useMemo(() => mgHas, [mgHas]);
    const dcaTab = useMemo(() => dcaHas, [dcaHas]);

    const outputsTab = useMemo(() => outputOptions.length > 0, [outputOptions.length]);

    const tabs = useMemo(() => {
        const res = [];
        if (generalInTab) res.push({ id: 'general', label: t('General') });
        if (inputTab) res.push({ id: 'input', label: t('Input') });
        if (fromTab) res.push({ id: 'from', label: t('Reception') });
        if (toTab) res.push({ id: 'to', label: t('Sends') });
        if (equalizerHas) res.push({ id: 'eq', label: t('Equalizer') });
        if (compressorHas) res.push({ id: 'compressor', label: t('Compressor') });
        if (gateHas) res.push({ id: 'gate', label: t('Gate') });
        if (insertTab) res.push({ id: 'insert', label: t('Fx insert') });
        if (fxTab) res.push({ id: 'fx', label: t('FX') });
        if (outputsTab) res.push({ id: 'outputs', label: t('Outputs') });
        if (monitorHas) res.push({ id: 'monitor', label: t('Monitor') });
        if (mgTab) res.push({ id: 'mg', label: t('Mute groups') });
        if (dcaTab) res.push({ id: 'dca', label: t('DCAs') });
        return res;
    }, [
        generalInTab, fromTab, toTab, gateHas, equalizerHas, compressorHas, fxTab,
        insertTab, inputTab, outputsTab, monitorHas, mgTab, dcaTab, t,
    ]);

    const defaultTab = useMemo(() => {
        if (generalInTab) return 'general';
        if (inputTab) return 'input';
        if (fromTab) return 'from';
        if (toTab) return 'to';
        return tabs[0]?.id;
    }, [generalInTab, inputTab, fromTab, toTab, tabs]);

    const { tabActive, onTabChange } = useBusViewTab({
        busId: bus.id,
        tabs,
        defaultTab,
    });

    const generalHeader = useMemo(() => (
        generalTab && !generalInTab
            ? (
                <Flex flexShrink="0" width="100%" minWidth="0" mt="1" mb="3">
                    <General
                        busId={bus.id}
                        showQuickActions
                    />
                </Flex>
            )
            : undefined
    ), [generalTab, generalInTab, bus.id]);

    return (
        <>
            {soloOne?.id !== undefined && (
                <SoloHasReader
                    busId={bus.id}
                    soloBusId={soloOne.id}
                    onHasChange={onSoloHasChange}
                />
            )}
            <EntityTabsShell
                tabs={tabs}
                tabActive={tabActive}
                onTabChange={onTabChange}
                header={generalHeader}
                mt={generalInTab ? '-2' : undefined}
                tabPanelMt={generalInTab ? '2' : '3'}
            >
                {generalInTab && tabActive === 'general' && (
                    <TabPanelScrollable>
                        <General
                            busId={bus.id}
                            showQuickActions
                        />
                    </TabPanelScrollable>
                )}
                {inputTab && tabActive === 'input' && (
                    <TabPanelScrollable>
                        <Input busId={bus.id} />
                    </TabPanelScrollable>
                )}
                {fromTab && tabActive === 'from' && (
                    <TabPanelScrollable>
                        <From busId={bus.id} />
                    </TabPanelScrollable>
                )}
                {gateHas && tabActive === 'gate' && (
                    <TabPanelFill>
                        <Gate busId={bus.id} />
                    </TabPanelFill>
                )}
                {equalizerHas && tabActive === 'eq' && (
                    <TabPanelFill>
                        <Equalizer busId={bus.id} />
                    </TabPanelFill>
                )}
                {compressorHas && tabActive === 'compressor' && (
                    <TabPanelFill>
                        <Compressor busId={bus.id} />
                    </TabPanelFill>
                )}
                {fxTab && tabActive === 'fx' && (
                    <TabPanelScrollable>
                        <Fx busId={bus.id} />
                    </TabPanelScrollable>
                )}
                {toTab && tabActive === 'to' && (
                    <TabPanelScrollable>
                        <To busId={bus.id} linkDestination />
                    </TabPanelScrollable>
                )}
                {insertTab && tabActive === 'insert' && (
                    <TabPanelScrollable>
                        <Insert busId={bus.id} />
                    </TabPanelScrollable>
                )}
                {outputsTab && tabActive === 'outputs' && (
                    <TabPanelScrollable>
                        <Outputs busId={bus.id} />
                    </TabPanelScrollable>
                )}
                {monitorHas && tabActive === 'monitor' && (
                    <TabPanelScrollable>
                        <Monitor busId={bus.id} />
                    </TabPanelScrollable>
                )}
                {mgTab && tabActive === 'mg' && (
                    <TabPanelScrollable>
                        <Mg busId={bus.id} />
                    </TabPanelScrollable>
                )}
                {dcaTab && tabActive === 'dca' && (
                    <TabPanelScrollable>
                        <Dca busId={bus.id} />
                    </TabPanelScrollable>
                )}
            </EntityTabsShell>
        </>
    );
};


const Bus = ({ bus }) => {
    const { disabled } = useDevice();
    const [searchParams] = useSearchParams();
    const { previousBusGet, nextBusGet } = useFallbackBusesSorted();
    const { value: color } = useFallbackBusColor(bus.id, 'gray');

    const tab = searchParams.get('tab');

    const previous = useMemo(() => previousBusGet(bus.id), [previousBusGet, bus.id]);
    const next = useMemo(() => nextBusGet(bus.id), [nextBusGet, bus.id]);

    const previousPath = useMemo(() => (previous ? buildBusPath(previous.id, tab) : undefined),
        [previous, tab]);
    const nextPath = useMemo(() => (next ? buildBusPath(next.id, tab) : undefined),
        [next, tab]);

    const [editOpened, setEditOpened] = useState(false);
    const editOpen = useCallback(() => setEditOpened(true), []);

    const actions = useMemo(() => (
        <HeaderIconButton disabled={disabled} onClick={editOpen}>
            <Pencil1Icon style={ICON_STYLE} />
        </HeaderIconButton>
    ), [disabled, editOpen]);

    const instance = useMemo(() => ({
        busId: bus.id,
        color,
    }), [bus.id, color]);

    useEntityHeaderTrail({
        instance,
        previous: previousPath,
        next: nextPath,
        actions,
    });

    return (
        <>
            <Edit busId={bus.id} open={editOpened} onOpenChange={setEditOpened} />
            <EntityViewShell>
                <BusTabs bus={bus} />
            </EntityViewShell>
        </>
    );
};


// Exported
export default () => {
    const { busId } = useParsedParams();
    const { get } = useBusOptions();
    const bus = useMemo(() => get(busId), [get, busId]);
    if (!bus) return <EntityNotFound listTo="/bus/list" />;
    return <Bus bus={bus} />;
};
