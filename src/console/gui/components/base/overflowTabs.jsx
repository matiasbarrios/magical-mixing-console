// Requirements
import {
    useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import {
    Box, Button, DropdownMenu, Flex, IconButton, Text,
} from '@radix-ui/themes';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../language';
import { DROPDOWN_MENU_CONTENT_SIZE, ICON_STYLE, ICON_SPACER } from '../../helpers/values';
import { useUiSize } from '../theme';
import { useResizeObserver } from './resize';
import { DropdownMenuTrigger } from './dropdownMenuTrigger';
import { DropdownMenuContent } from './dropdownMenuContent';


// Constants
const TAB_GAP = 4;


const containerStyleBase = {
    position: 'relative',
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
};

const containerStyleDefault = {
    ...containerStyleBase,
    borderTop: '0px solid var(--gray-6)',
    borderBottom: '1px solid var(--gray-6)',
};


const VARIANT_CONFIG = {
    default: {
        rowPt: '2',
        rowPb: '2',
        rowJustify: 'start',
        scaleInactive: false,
        containerStyle: containerStyleDefault,
    },
    header: {
        rowPt: undefined,
        rowPb: undefined,
        rowJustify: 'center',
        scaleInactive: true,
        containerStyle: containerStyleBase,
    },
};


const measureTabBarWidth = (element) => {
    if (!element) return 0;

    let width = element.clientWidth;
    let parent = element.parentElement;
    while (parent) {
        const { overflowX, overflow } = window.getComputedStyle(parent);
        const horizontalOverflow = overflowX !== 'visible' ? overflowX : overflow;
        if (horizontalOverflow === 'auto' || horizontalOverflow === 'scroll' || horizontalOverflow === 'hidden') {
            width = Math.min(width, parent.clientWidth);
        }
        parent = parent.parentElement;
    }

    return width;
};


const measureStyle = {
    visibility: 'hidden',
    position: 'absolute',
    height: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
};


const tabColor = isActive => (isActive ? 'blue' : 'gray');


// Internal
const computeVisibleCount = (containerWidth, tabWidths, moreWidth) => {
    const count = tabWidths.length;
    if (count === 0 || containerWidth <= 0) return 0;

    let totalWidth = 0;
    tabWidths.forEach((width, index) => {
        totalWidth += width + (index > 0 ? TAB_GAP : 0);
    });
    if (totalWidth <= containerWidth) return count;

    let used = 0;
    for (let index = 0; index < count; index += 1) {
        const tabWidth = tabWidths[index] + (index > 0 ? TAB_GAP : 0);
        const hiddenAfter = count - index - 1;
        const reserve = hiddenAfter > 0 ? moreWidth + TAB_GAP : 0;
        if (used + tabWidth + reserve > containerWidth) return index;
        used += tabWidth;
    }

    return count;
};


const measureVisibleRowWidth = (prefixWidths, activeWidth, moreWidth) => {
    let total = 0;
    prefixWidths.forEach((width) => {
        total += (total > 0 ? TAB_GAP : 0) + width;
    });
    if (activeWidth > 0) {
        total += (total > 0 ? TAB_GAP : 0) + activeWidth;
    }
    if (moreWidth > 0) {
        total += TAB_GAP + moreWidth;
    }
    return total;
};


const computeVisibleCountForPinnedActive = (
    containerWidth, tabWidths, moreWidth, activeIndex, maxVisibleCount
) => {
    for (let visibleCount = maxVisibleCount; visibleCount >= 1; visibleCount -= 1) {
        const prefixCount = Math.max(visibleCount - 1, 0);
        const prefixWidths = tabWidths.slice(0, prefixCount);
        const activeWidth = tabWidths[activeIndex] ?? 0;
        const total = measureVisibleRowWidth(prefixWidths, activeWidth, moreWidth);
        if (total <= containerWidth) return visibleCount;
    }

    return 1;
};


const resolveVisibleCount = (
    availableWidth, tabWidths, moreWidth, active, tabs
) => {
    if (availableWidth <= 0 || tabWidths.length === 0) return null;

    let count = computeVisibleCount(availableWidth, tabWidths, moreWidth);
    if (count === 0) count = 1;

    const activeIndex = tabs.findIndex(tab => tab.id === active);
    if (activeIndex >= 0 && activeIndex >= count && count < tabs.length) {
        count = computeVisibleCountForPinnedActive(
            availableWidth, tabWidths, moreWidth, activeIndex, count
        );
    }

    return count;
};


const splitTabs = (tabs, active, visibleCount) => {
    if (visibleCount >= tabs.length) {
        return { visibleTabs: tabs, hiddenTabs: [] };
    }

    const activeIndex = tabs.findIndex(tab => tab.id === active);
    if (activeIndex >= visibleCount) {
        const visibleIds = new Set([
            ...tabs.slice(0, Math.max(visibleCount - 1, 0)).map(tab => tab.id),
            active,
        ]);
        return {
            visibleTabs: tabs.filter(tab => visibleIds.has(tab.id)),
            hiddenTabs: tabs.filter(tab => !visibleIds.has(tab.id)),
        };
    }

    return {
        visibleTabs: tabs.slice(0, visibleCount),
        hiddenTabs: tabs.slice(visibleCount),
    };
};


const TabButton = ({
    tab, isActive, onSelect, textSize,
}) => {
    const { disabled } = useDevice();

    return (
        <Button
            size={textSize}
            variant={isActive ? 'soft' : 'ghost'}
            color={tabColor(isActive)}
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onSelect(tab.id)}
            className="mmc-btn-nowrap"
        >
            <Text size={textSize}>{ tab.label }</Text>
        </Button>
    );
};


const OverflowMenu = ({
    tabs, active, onSelect, textSize,
}) => {
    const { t } = useLanguage();
    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);
    const activeInOverflow = tabs.some(tab => tab.id === active);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                variant="ghost"
                color={tabColor(activeInOverflow)}
                aria-label={t('More')}
                onClick={toggleOpened}
                className="mmc-shrink-0"
            >
                <ChevronDownIcon style={ICON_STYLE} />
            </DropdownMenuTrigger>
            <DropdownMenuContent size={DROPDOWN_MENU_CONTENT_SIZE} align="end">
                {tabs.map(tab => (
                    <DropdownMenu.Item key={tab.id} onSelect={() => onSelect(tab.id)}>
                        <Flex align="center" gapX="1">
                            {active === tab.id
                                ? <CheckIcon style={ICON_STYLE} />
                                : <Box {...ICON_SPACER} />}
                            <Text size={textSize}>{ tab.label }</Text>
                        </Flex>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


// Exported
export default ({ tabs, active, onChange, variant = 'default' }) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const {
        rowPt, rowPb, rowJustify, scaleInactive, containerStyle: variantContainerStyle,
    } = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.default;
    const containerRef = useRef(null);
    const tabRefs = useRef({});
    const moreMeasureRef = useRef(null);
    const { width: containerWidth } = useResizeObserver(containerRef);
    const [visibleCount, setVisibleCount] = useState(() => (tabs.length > 0 ? 1 : 0));
    const [layoutEpoch, setLayoutEpoch] = useState(0);

    const bumpLayout = useCallback(() => {
        setLayoutEpoch(epoch => epoch + 1);
    }, []);

    const setTabRef = useCallback(tabId => (element) => {
        if (element) tabRefs.current[tabId] = element;
        else delete tabRefs.current[tabId];
    }, []);

    const tabsKey = useMemo(() => tabs.map(tab => tab.id).join(','), [tabs]);

    useEffect(() => {
        window.addEventListener('resize', bumpLayout);
        window.addEventListener('orientationchange', bumpLayout);
        return () => {
            window.removeEventListener('resize', bumpLayout);
            window.removeEventListener('orientationchange', bumpLayout);
        };
    }, [bumpLayout]);

    useLayoutEffect(() => {
        setVisibleCount(tabs.length > 0 ? 1 : 0);
    }, [tabsKey, tabs.length]);

    useLayoutEffect(() => {
        const element = containerRef.current;
        if (!element || tabs.length === 0) {
            setVisibleCount(0);
            return undefined;
        }

        const tabWidths = tabs.map(tab => tabRefs.current[tab.id]?.offsetWidth ?? 0);
        const deferMeasure = () => {
            const frame = requestAnimationFrame(bumpLayout);
            return () => window.cancelAnimationFrame(frame);
        };

        if (tabWidths.some(width => width === 0)) {
            setVisibleCount(tabs.length > 0 ? 1 : 0);
            return deferMeasure();
        }

        const availableWidth = measureTabBarWidth(element);
        const moreWidth = moreMeasureRef.current?.offsetWidth ?? 28;
        const count = resolveVisibleCount(
            availableWidth, tabWidths, moreWidth, active, tabs
        );
        if (count === null) return deferMeasure();

        setVisibleCount(current => (current === count ? current : count));
        return undefined;
    }, [containerWidth, tabs, active, layoutEpoch, bumpLayout]);

    const tabSplit = useMemo(() => splitTabs(tabs, active, visibleCount), [tabs, active, visibleCount]);
    const { visibleTabs, hiddenTabs } = tabSplit;

    const onSelect = useCallback((tabId) => {
        if (disabled) return;
        onChange(tabId);
    }, [onChange, disabled]);

    return (
        <div ref={containerRef} style={variantContainerStyle}>
            <Flex aria-hidden gap="1" align="center" style={measureStyle}>
                {tabs.map(tab => (
                    <Button
                        key={tab.id}
                        ref={setTabRef(tab.id)}
                        size={textSize}
                        variant="soft"
                        color="gray"
                        tabIndex={-1}
                        className="mmc-btn-nowrap"
                    >
                        <Text size={textSize}>{ tab.label }</Text>
                    </Button>
                ))}
                <IconButton
                    ref={moreMeasureRef}
                    size={textSize}
                    variant="soft"
                    color="gray"
                    tabIndex={-1}
                    className="mmc-shrink-0"
                >
                    <ChevronDownIcon style={ICON_STYLE} />
                </IconButton>
            </Flex>
            <Flex
                align="center"
                justify={rowJustify}
                gap="3"
                pt={rowPt}
                pb={rowPb}
                flexShrink="0"
                minWidth="0"
                width="100%"
                role="tablist"
            >
                {visibleTabs.map(tab => (
                    <TabButton
                        key={tab.id}
                        tab={tab}
                        isActive={active === tab.id}
                        onSelect={onSelect}
                        textSize={textSize}
                        scaleInactive={scaleInactive}
                    />
                ))}
                {hiddenTabs.length > 0 && (
                    <OverflowMenu
                        tabs={hiddenTabs}
                        active={active}
                        onSelect={onSelect}
                        textSize={textSize}
                    />
                )}
            </Flex>
        </div>
    );
};
