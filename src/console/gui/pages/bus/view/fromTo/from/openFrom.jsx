// Requirements
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, Flex, IconButton, Text } from '@radix-ui/themes';
import {
    useBusOptions, useBusStereoLink, useDevice,
} from '@magical-mixing/mixers-react';
import { buildBusPath } from '../../useBusViewTab';
import { useLanguage } from '../../../../../components/language';
import { useUiSize } from '../../../../../components/theme';
import { ICON_STYLE } from '../../../../../helpers/values';
import { FallbackBusIcon, useFallbackBusColor, useFallbackBusIcon } from '../../../../../components/fallback';
import {
    BusIconName, BusStereoIconName,
    formatBusIdentifierShort, formatBusStereoIdentifierShort,
    useBusEditDisplayName,
} from '../../name';
import Solo from '../../solo';
import Mute from '../../mute';
import { BUS_IDENTIFIER_ROAM_ID, EDIT_ROAM_ID, focusRoamAttrs } from '../../../../../helpers/hotkeys/focusRoam';
import { useSourceBusEdit } from './sourceBusEdit';


const TRUNCATE_TEXT_STYLE = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
};


// Internal
const SourceIcon = ({
    busIdFrom, size = '2', hideIdentifier = false, truncate = false, singular = false,
}) => {
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    if (stereoLinked && stereoLinkPair && !singular) {
        return (
            <BusStereoIconName
                busIdLeft={busIdFrom}
                busIdRight={stereoLinkPair}
                size={size}
                hideIdentifier={hideIdentifier}
                truncate={truncate}
            />
        );
    }

    return (
        <BusIconName
            busId={busIdFrom}
            size={size}
            hideIdentifier={hideIdentifier}
            truncate={truncate}
        />
    );
};


const SourceSolo = ({ busIdFrom }) => (
    <Solo busId={busIdFrom} dense stopPropagation />
);


const SourceMute = ({ busIdFrom }) => (
    <Mute busId={busIdFrom} dense stopPropagation />
);


const useSourceBusNavigate = (busIdFrom) => {
    const navigate = useNavigate();
    return useCallback((e) => {
        e.stopPropagation();
        navigate(buildBusPath(busIdFrom));
    }, [navigate, busIdFrom]);
};


const useSourceBusIdentifierLabel = (busIdFrom, { singular = false } = {}) => {
    const { get } = useBusOptions();
    const option = useMemo(() => get(busIdFrom), [get, busIdFrom]);
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);
    const pairOption = useMemo(() => (stereoLinkPair ? get(stereoLinkPair) : undefined),
        [get, stereoLinkPair]);

    return useMemo(() => {
        if (!option) return null;
        if (stereoLinked && pairOption && !singular) {
            return formatBusStereoIdentifierShort(option.type, option.number, pairOption.number);
        }
        return formatBusIdentifierShort(option.type, option.number);
    }, [option, stereoLinked, pairOption, singular]);
};


const SourceBusNameLink = ({ busIdFrom, truncate = false, showIdentifier = false }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize, subTextFontSize } = useUiSize();
    const { value: color } = useFallbackBusColor(busIdFrom, 'gray');
    const { has: iconHas, value: iconValue } = useFallbackBusIcon(busIdFrom);
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const displayName = useBusEditDisplayName(busIdFrom, { stereoLinked, stereoLinkPair });
    const identifierLabel = useSourceBusIdentifierLabel(busIdFrom);
    const onViewClick = useSourceBusNavigate(busIdFrom);

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
                    <FallbackBusIcon busId={busIdFrom} color={color} />
                </Flex>
            )}
            <Text size={textSize} style={truncate ? TRUNCATE_TEXT_STYLE : undefined}>
                { displayName }
            </Text>
        </Flex>
    ), [displayName, showIcon, color, truncate, textSize, busIdFrom]);

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


const SourceBusEditButton = ({ busIdFrom }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { value: color } = useFallbackBusColor(busIdFrom, 'gray');
    const { openEdit } = useSourceBusEdit();
    const onEditClick = useCallback((e) => {
        e.stopPropagation();
        openEdit(busIdFrom);
    }, [openEdit, busIdFrom]);
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const displayName = useBusEditDisplayName(busIdFrom, { stereoLinked, stereoLinkPair });

    if (displayName) return null;

    return (
        <IconButton
            size={textSize}
            variant="ghost"
            radius="full"
            color={color}
            disabled={disabled}
            onClick={onEditClick}
            onPointerDown={e => e.stopPropagation()}
            aria-label={t('Edit')}
            {...focusRoamAttrs(EDIT_ROAM_ID)}
        >
            <Pencil1Icon style={ICON_STYLE} />
        </IconButton>
    );
};


const SourceViewBus = ({
    busIdFrom, compact = false, size: sizeProp, focusRoam = BUS_IDENTIFIER_ROAM_ID, singular = false,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { value: color } = useFallbackBusColor(busIdFrom, 'gray');
    const label = useSourceBusIdentifierLabel(busIdFrom, { singular });

    const onViewClick = useSourceBusNavigate(busIdFrom);

    if (!label) return null;

    const size = sizeProp ?? (compact ? '1' : textSize);

    return (
        <Button
            size={size}
            variant="ghost"
            color={color}
            disabled={disabled}
            onClick={onViewClick}
            onPointerDown={e => e.stopPropagation()}
            aria-label={t('View bus')}
            className="mmc-btn-nowrap"
            mx={compact ? undefined : '1.5'}
            {...(focusRoam ? { 'data-focus-roam': focusRoam } : {})}
        >
            { label }
        </Button>
    );
};


const SourceBusUnsetNameArea = ({
    busIdFrom, truncate = false, showIdentifier = false,
}) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize, subTextFontSize } = useUiSize();
    const { value: color } = useFallbackBusColor(busIdFrom, 'gray');
    const identifierLabel = useSourceBusIdentifierLabel(busIdFrom);
    const onViewClick = useSourceBusNavigate(busIdFrom);

    const wrapIfTruncate = content => (truncate ? (
        <Flex width="100%" minWidth="0" justify="center">
            { content }
        </Flex>
    ) : content);

    return wrapIfTruncate((
        <Flex
            direction="column"
            align="center"
            gap="0"
            minWidth="0"
            style={truncate ? { maxWidth: '100%' } : undefined}
        >
            <SourceBusEditButton busIdFrom={busIdFrom} />
            {showIdentifier && identifierLabel && (
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
            )}
        </Flex>
    ));
};


const SourceBusNameArea = ({ busIdFrom, truncate = false, showIdentifier = false }) => {
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const displayName = useBusEditDisplayName(busIdFrom, { stereoLinked, stereoLinkPair });

    if (!displayName) {
        return (
            <SourceBusUnsetNameArea
                busIdFrom={busIdFrom}
                truncate={truncate}
                showIdentifier={showIdentifier}
            />
        );
    }

    return (
        <SourceBusNameLink
            busIdFrom={busIdFrom}
            truncate={truncate}
            showIdentifier={showIdentifier}
        />
    );
};


const SourceQuickActions = ({ busIdFrom, stacked = false }) => (
    <Flex
        direction={stacked ? 'column' : 'row'}
        align="center"
        gap={stacked ? '1' : undefined}
        gapX={stacked ? undefined : '1'}
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
    SourceBusEditButton,
    SourceBusNameArea,
    SourceBusNameLink,
    SourceIcon, SourceMute, SourceQuickActions, SourceSolo, SourceViewBus,
};
