// Requirements
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { Dialog, Flex } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import ConditionalScrollY from '../../../components/base/conditionalScrollY';
import DialogHeader from '../../../components/base/dialogHeader';
import OverflowTabs from '../../../components/base/overflowTabs';
import { HOTKEY_ACTION_IDS, HOTKEY_GROUP_ORDER } from '../../../helpers/hotkeys/actions';
import { useHotkeys } from '../../../components/hotkeys/context';
import HotkeysContent from './content';


// Variables
const HotkeysSettingsContext = createContext(null);

const HOTKEY_ROW_HEIGHT_PX = 36;

// Header, tabs, and spacing below max dialog height (85dvh).
const HOTKEYS_DIALOG_CHROME_MAX_HEIGHT = 'calc(85dvh - 8rem)';

const dialogStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '85dvh',
    overflow: 'hidden',
};


// Internal
const HotkeysDialog = ({ open, onOpenChange }) => {
    const { t } = useLanguage();
    const { actions } = useHotkeys();
    const [activeTab, setActiveTab] = useState('General');

    const tabs = useMemo(() => {
        const byGroup = {};
        HOTKEY_ACTION_IDS.forEach((actionId) => {
            const groupKey = actions[actionId].groupKey ?? 'General';
            byGroup[groupKey] = true;
        });

        return HOTKEY_GROUP_ORDER
            .filter(groupKey => byGroup[groupKey])
            .map(groupKey => ({ id: groupKey, label: t(groupKey) }));
    }, [actions, t]);

    const panelHeightPx = useMemo(() => {
        const counts = {};
        HOTKEY_ACTION_IDS.forEach((actionId) => {
            const groupKey = actions[actionId].groupKey ?? 'General';
            counts[groupKey] = (counts[groupKey] ?? 0) + 1;
        });
        const maxRows = Math.max(...Object.values(counts));
        return maxRows * HOTKEY_ROW_HEIGHT_PX;
    }, [actions]);

    const scrollPanelStyle = useMemo(() => ({
        height: panelHeightPx,
        maxHeight: HOTKEYS_DIALOG_CHROME_MAX_HEIGHT,
        flexShrink: 0,
    }), [panelHeightPx]);

    useEffect(() => {
        if (!open) setActiveTab('General');
    }, [open]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined} style={dialogStyle}>
                <Flex flexShrink="0" width="100%" minWidth="0">
                    <DialogHeader>
                        { t('Hotkeys') }
                    </DialogHeader>
                </Flex>
                <Flex flexShrink="0" width="100%" minWidth="0">
                    <OverflowTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
                </Flex>
                <ConditionalScrollY
                    mt="3"
                    minWidth="0"
                    width="100%"
                    flexGrow="0"
                    gapY="0"
                    pb="0"
                    style={scrollPanelStyle}
                >
                    <HotkeysContent activeGroupKey={activeTab} />
                </ConditionalScrollY>
            </Dialog.Content>
        </Dialog.Root>
    );
};


// Exported
export const HotkeysSettingsProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const openHotkeys = useCallback(() => {
        setOpen(true);
    }, []);

    const value = useMemo(() => ({
        openHotkeys,
    }), [openHotkeys]);

    return (
        <HotkeysSettingsContext.Provider value={value}>
            { children }
            <HotkeysDialog open={open} onOpenChange={setOpen} />
        </HotkeysSettingsContext.Provider>
    );
};


export const useHotkeysSettings = () => {
    const context = useContext(HotkeysSettingsContext);
    if (!context) {
        throw new Error('useHotkeysSettings must be used within HotkeysSettingsProvider');
    }
    return context;
};
