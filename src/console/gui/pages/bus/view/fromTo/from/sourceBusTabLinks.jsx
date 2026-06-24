// Requirements
import { useCallback, useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useEntityViewLayout, useTheme } from '../../../../../components/theme';
import { useScreen } from '../../../../../components/base/screen';
import Equalizer from './equalizer';
import Compressor from './compressor';
import Gate from './gate';
import Input from './input';


// Internal
const SourceBusTabLinksInner = ({ busIdFrom }) => {
    const { isVertical } = useEntityViewLayout();
    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <Flex
            direction={isVertical ? 'column' : 'row'}
            align="center"
            gap={isVertical ? '1' : undefined}
            gapX={isVertical ? undefined : '1'}
            flexShrink="0"
            wrap="nowrap"
            onPointerDown={stopRowOpen}
            onClick={stopRowOpen}
        >
            <Input busIdFrom={busIdFrom} />
            <Equalizer busIdFrom={busIdFrom} />
            <Compressor busIdFrom={busIdFrom} />
            <Gate busIdFrom={busIdFrom} />
        </Flex>
    );
};


const useReceptionShortcutsVisible = () => {
    const { md, lg, xl, isXSLandscape } = useScreen();
    const { receptionShortcuts } = useTheme();
    const { isHorizontal, isVertical } = useEntityViewLayout();

    return useMemo(() => {
        if (!receptionShortcuts) return false;
        if (isHorizontal) return md || lg || xl;
        if (isVertical) return !isXSLandscape;
        return false;
    }, [receptionShortcuts, isHorizontal, isVertical, md, lg, xl, isXSLandscape]);
};


// Exported
export const SourceBusTabLinks = ({ busIdFrom }) => {
    const visible = useReceptionShortcutsVisible();

    if (!visible) return null;

    return <SourceBusTabLinksInner busIdFrom={busIdFrom} />;
};
