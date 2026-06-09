// Requirements
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button, Flex } from '@radix-ui/themes';
import {
    useBusCompressor,
    useBusEqualizer,
    useBusGate,
    useBusInput,
    useDevice,
} from '@magical-mixing/mixers-react';
import { buildBusPath } from '../useBusViewTab';
import { useLanguage } from '../../../../components/language';
import { useTheme, useUiSize } from '../../../../components/theme';
import { useScreen } from '../../../../components/base/screen';
import { useFallbackBusColor } from '../../../../components/fallback';


// Constants
const SECTIONS = [
    { id: 'input', letter: 'In', labelKey: 'Input', useHas: useBusInput },
    { id: 'eq', letter: 'Eq', labelKey: 'Equalizer', useHas: useBusEqualizer },
    { id: 'compressor', letter: 'Cp', labelKey: 'Compressor', useHas: useBusCompressor },
    { id: 'gate', letter: 'Gt', labelKey: 'Gate', useHas: useBusGate },
];

// Internal
const SectionLink = ({ busIdFrom, id, letter, labelKey, useHas }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const navigate = useNavigate();
    const { has } = useHas(busIdFrom);
    const { value: color } = useFallbackBusColor(busIdFrom, 'gray');

    const ariaLabel = useMemo(() => t(labelKey), [t, labelKey]);

    const onOpen = useCallback((e) => {
        e.stopPropagation();
        navigate(buildBusPath(busIdFrom, id));
    }, [navigate, busIdFrom, id]);

    if (!has) return null;

    return (
        <Button
            size={textSize}
            variant="ghost"
            color={color}
            disabled={disabled}
            onClick={onOpen}
            onPointerDown={e => e.stopPropagation()}
            aria-label={ariaLabel}
            className="mmc-btn-nowrap"
        >
            { letter }
        </Button>
    );
};


const SourceBusTabLinksWide = ({ busIdFrom }) => {
    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <Flex
            align="center"
            pl="2"
            gapX="3"
            flexShrink="0"
            wrap="nowrap"
            onPointerDown={stopRowOpen}
            onClick={stopRowOpen}
        >
            {SECTIONS.map(s => (
                <SectionLink
                    key={s.id}
                    busIdFrom={busIdFrom}
                    id={s.id}
                    letter={s.letter}
                    labelKey={s.labelKey}
                    useHas={s.useHas}
                />
            ))}
        </Flex>
    );
};


// Exported
export const SourceBusTabLinks = ({ busIdFrom }) => {
    const { md, lg, xl } = useScreen();
    const { receptionShortcuts } = useTheme();

    if (!receptionShortcuts || (!md && !lg && !xl)) return null;

    return <SourceBusTabLinksWide busIdFrom={busIdFrom} />;
};
