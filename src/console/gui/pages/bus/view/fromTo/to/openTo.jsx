// Requirements
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useBusOptions, useBusStereoLink, useDevice } from '@magical-mixing/mixers-react';
import { buildBusPath } from '../../useBusViewTab';
import { useLanguage } from '../../../../../components/language';
import { useUiSize } from '../../../../../components/theme';
import { FallbackBusIcon, useFallbackBusColor, useFallbackBusIcon } from '../../../../../components/fallback';
import {
    BusIconName, BusStereoIconName,
    formatBusIdentifierShort, formatBusStereoIdentifierShort,
    useBusEditDisplayName,
} from '../../name';
import { BUS_IDENTIFIER_ROAM_ID, focusRoamAttrs } from '../../../../../helpers/hotkeys/focusRoam';


const TRUNCATE_TEXT_STYLE = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
};


// Internal
const DestinationIcon = ({ busIdTo, size = '2', hideIdentifier = false }) => {
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdTo);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    if (stereoLinked && stereoLinkPair) {
        return (
            <BusStereoIconName
                busIdLeft={busIdTo}
                busIdRight={stereoLinkPair}
                size={size}
                hideIdentifier={hideIdentifier}
            />
        );
    }

    return (
        <BusIconName
            busId={busIdTo}
            size={size}
            hideIdentifier={hideIdentifier}
        />
    );
};


const useDestinationBusNavigate = (busIdTo) => {
    const navigate = useNavigate();
    return useCallback((e) => {
        e.stopPropagation();
        navigate(buildBusPath(busIdTo));
    }, [navigate, busIdTo]);
};


const useDestinationBusIdentifierLabel = (busIdTo) => {
    const { get } = useBusOptions();
    const option = useMemo(() => get(busIdTo), [get, busIdTo]);
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdTo);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);
    const pairOption = useMemo(() => (stereoLinkPair ? get(stereoLinkPair) : undefined),
        [get, stereoLinkPair]);

    return useMemo(() => {
        if (!option) return null;
        if (stereoLinked && pairOption) {
            return formatBusStereoIdentifierShort(option.type, option.number, pairOption.number);
        }
        return formatBusIdentifierShort(option.type, option.number);
    }, [option, stereoLinked, pairOption]);
};


const DestinationBusNameLink = ({ busIdTo, truncate = false, showIdentifier = false }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize, subTextFontSize } = useUiSize();
    const { value: color } = useFallbackBusColor(busIdTo, 'gray');
    const { has: iconHas, value: iconValue } = useFallbackBusIcon(busIdTo);
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdTo);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const displayName = useBusEditDisplayName(busIdTo, { stereoLinked, stereoLinkPair });
    const identifierLabel = useDestinationBusIdentifierLabel(busIdTo);
    const onViewClick = useDestinationBusNavigate(busIdTo);

    const showIcon = iconHas && iconValue && iconValue !== 'none';

    const wrapIfTruncate = content => (truncate ? (
        <Flex width="100%" minWidth="0" justify="center">
            { content }
        </Flex>
    ) : content);

    const nameContent = useMemo(() => (
        <Flex align="center" gap="1" minWidth="0" style={truncate ? { maxWidth: '100%' } : undefined}>
            {showIcon && (
                <Flex flexShrink="0" style={{ lineHeight: 0 }}>
                    <FallbackBusIcon busId={busIdTo} color={color} />
                </Flex>
            )}
            <Text size={textSize} style={truncate ? TRUNCATE_TEXT_STYLE : undefined}>
                { displayName }
            </Text>
        </Flex>
    ), [displayName, showIcon, color, truncate, textSize, busIdTo]);

    const buttonContent = useMemo(() => {
        if (showIdentifier && identifierLabel) {
            return (
                <Flex
                    direction="column"
                    align="center"
                    gap="0"
                    minWidth="0"
                    style={truncate ? { maxWidth: '100%' } : undefined}
                >
                    { nameContent }
                    <Text size="1" className="mmc-btn-nowrap" style={{ fontSize: subTextFontSize }}>
                        { identifierLabel }
                    </Text>
                </Flex>
            );
        }
        return nameContent;
    }, [showIdentifier, identifierLabel, nameContent, truncate, subTextFontSize]);

    if (!displayName) return null;

    const focusRoamProps = showIdentifier ? focusRoamAttrs(BUS_IDENTIFIER_ROAM_ID) : {};

    return wrapIfTruncate((
        <Button
            size={textSize}
            variant="ghost"
            color={color}
            disabled={disabled}
            onClick={onViewClick}
            onPointerDown={e => e.stopPropagation()}
            aria-label={t('View bus')}
            style={truncate ? { maxWidth: '100%' } : undefined}
            className={showIdentifier || truncate ? undefined : 'mmc-btn-nowrap'}
            {...focusRoamProps}
        >
            { buttonContent }
        </Button>
    ));
};


const DestinationBusUnsetNameArea = ({
    busIdTo, truncate = false, showIdentifier = false,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize, subTextFontSize } = useUiSize();
    const { value: color } = useFallbackBusColor(busIdTo, 'gray');
    const identifierLabel = useDestinationBusIdentifierLabel(busIdTo);
    const onViewClick = useDestinationBusNavigate(busIdTo);

    if (!showIdentifier || !identifierLabel) return null;

    const wrapIfTruncate = content => (truncate ? (
        <Flex width="100%" minWidth="0" justify="center">
            { content }
        </Flex>
    ) : content);

    return wrapIfTruncate((
        <Button
            size={textSize}
            variant="ghost"
            color={color}
            disabled={disabled}
            onClick={onViewClick}
            onPointerDown={e => e.stopPropagation()}
            aria-label={t('View bus')}
            className="mmc-btn-nowrap"
            {...focusRoamAttrs(BUS_IDENTIFIER_ROAM_ID)}
        >
            <Text size="1" className="mmc-btn-nowrap" style={{ fontSize: subTextFontSize }}>
                { identifierLabel }
            </Text>
        </Button>
    ));
};


const DestinationViewBus = ({ busIdTo, linkDestination }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { value: color } = useFallbackBusColor(busIdTo, 'gray');
    const label = useDestinationBusIdentifierLabel(busIdTo);

    const onViewClick = useDestinationBusNavigate(busIdTo);

    if (!linkDestination || !label) return null;

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


const DestinationBusNameArea = ({ busIdTo, truncate = false, showIdentifier = false }) => {
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdTo);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const displayName = useBusEditDisplayName(busIdTo, { stereoLinked, stereoLinkPair });

    if (!displayName) {
        return (
            <DestinationBusUnsetNameArea
                busIdTo={busIdTo}
                truncate={truncate}
                showIdentifier={showIdentifier}
            />
        );
    }

    return (
        <DestinationBusNameLink
            busIdTo={busIdTo}
            truncate={truncate}
            showIdentifier={showIdentifier}
        />
    );
};


// Exported
export {
    DestinationBusNameArea,
    DestinationBusNameLink,
    DestinationIcon, DestinationViewBus,
};
