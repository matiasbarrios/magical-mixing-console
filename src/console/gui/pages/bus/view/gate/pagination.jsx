// Requirements
import { useBusGateSidechain, useDevice } from '@magical-mixing/mixers-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { ICON_STYLE } from '../../../../helpers/values';
import { useUiSize } from '../../../../components/theme';


// Constants
const defaultTabs = [
    'Parameters',
    'Envelope',
];


// Variables
const Context = createContext({});


// Internal
const PaginationProvider = ({ busId, children }) => {
    const { has: sidechainHas } = useBusGateSidechain(busId);

    const [tabs, setTabs] = useState(defaultTabs);
    const [tab, setTab] = useState(defaultTabs[0]);

    useEffect(() => {
        if (sidechainHas) {
            setTabs([...defaultTabs, 'Sidechain']);
        } else {
            setTabs(defaultTabs);
            if (tab === 'Sidechain') {
                setTab(defaultTabs[0]);
            }
        }
    }, [sidechainHas, tab]);

    const state = useMemo(() => ({
        tabs, setTabs, tab, setTab,
    }), [tabs, setTabs, tab, setTab]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};


const usePagination = () => {
    const {
        tabs, setTabs, tab, setTab,
    } = useContext(Context);

    const hasPrevious = useMemo(() => tab !== tabs[0], [tabs, tab]);

    const goToPrevious = useCallback(() => {
        if (!hasPrevious) return;
        setTab(tabs[tabs.indexOf(tab) - 1]);
    }, [hasPrevious, tabs, tab, setTab]);

    const hasNext = useMemo(() => tab !== tabs[tabs.length - 1], [tabs, tab]);

    const goToNext = useCallback(() => {
        if (!hasNext) return;
        setTab(tabs[tabs.indexOf(tab) + 1]);
    }, [hasNext, tabs, tab, setTab]);

    return {
        tabs,
        setTabs,
        tab,
        setTab,
        hasPrevious,
        goToPrevious,
        hasNext,
        goToNext,
    };
};


// Exported
export { PaginationProvider };

export const PaginationPrevious = () => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { hasPrevious, goToPrevious } = usePagination();
    return (
        <IconButton variant="ghost" radius="full" color="gray" onClick={goToPrevious} disabled={!hasPrevious || disabled} size={textSize}>
            <ChevronLeftIcon style={ICON_STYLE} />
        </IconButton>
    );
};


export const PaginationNext = () => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { hasNext, goToNext } = usePagination();
    return (
        <IconButton variant="ghost" radius="full" color="gray" onClick={goToNext} disabled={!hasNext || disabled} size={textSize}>
            <ChevronRightIcon style={ICON_STYLE} />
        </IconButton>
    );
};


export const PaginationContents = ({ tab, children }) => {
    const { tab: currentTab } = usePagination();
    if (tab !== currentTab) return null;
    return children;
};
