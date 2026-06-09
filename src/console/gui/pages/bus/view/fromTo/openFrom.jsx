// Requirements
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button, Flex } from '@radix-ui/themes';
import {
    useBusOptions, useBusStereoLink, useDevice,
} from '@magical-mixing/mixers-react';
import { buildBusPath } from '../useBusViewTab';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { useFallbackBusColor } from '../../../../components/fallback';
import {
    BusIconName, BusStereoIconName,
    formatBusIdentifierShort, formatBusStereoIdentifierShort,
} from '../name';
import Solo from '../solo';
import Mute from '../mute';


// Internal
const SourceIcon = ({ busIdFrom, size = '2', hideIdentifier = false }) => {
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    if (stereoLinked && stereoLinkPair) {
        return (
            <BusStereoIconName
                busIdLeft={busIdFrom}
                busIdRight={stereoLinkPair}
                size={size}
                hideIdentifier={hideIdentifier}
            />
        );
    }

    return (
        <BusIconName
            busId={busIdFrom}
            size={size}
            hideIdentifier={hideIdentifier}
        />
    );
};


const SourceSolo = ({ busIdFrom }) => (
    <Solo busId={busIdFrom} dense stopPropagation />
);


const SourceMute = ({ busIdFrom }) => (
    <Mute busId={busIdFrom} dense stopPropagation />
);


const SourceViewBus = ({ busIdFrom }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const navigate = useNavigate();
    const { get } = useBusOptions();
    const option = useMemo(() => get(busIdFrom), [get, busIdFrom]);
    const { value: color } = useFallbackBusColor(busIdFrom, 'gray');
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);
    const pairOption = useMemo(() => (stereoLinkPair ? get(stereoLinkPair) : undefined),
        [get, stereoLinkPair]);

    const label = useMemo(() => {
        if (!option) return null;
        if (stereoLinked && pairOption) {
            return formatBusStereoIdentifierShort(option.type, option.number, pairOption.number);
        }
        return formatBusIdentifierShort(option.type, option.number);
    }, [option, stereoLinked, pairOption]);

    const onViewClick = useCallback((e) => {
        e.stopPropagation();
        navigate(buildBusPath(busIdFrom));
    }, [navigate, busIdFrom]);

    if (!label) return null;

    return (
        <Button
            size={textSize}
            variant="ghost"
            color={color}
            disabled={disabled}
            onClick={onViewClick}
            aria-label={t('View bus')}
            className="mmc-btn-nowrap"
            mx="1.5"
        >
            { label }
        </Button>
    );
};


const SourceQuickActions = ({ busIdFrom }) => (
    <Flex
        align="center"
        gapX="1"
        flexShrink="0"
        onPointerDown={e => e.stopPropagation()}
    >
        <SourceSolo busIdFrom={busIdFrom} />
        <SourceMute busIdFrom={busIdFrom} />
    </Flex>
);


// Exported
export default ({ busIdFrom }) => (
    <Flex align="center" justify="between" width="100%" gapX="2">
        <SourceIcon busIdFrom={busIdFrom} />
        <SourceQuickActions busIdFrom={busIdFrom} />
    </Flex>
);


export {
    SourceIcon, SourceMute, SourceQuickActions, SourceSolo, SourceViewBus,
};
