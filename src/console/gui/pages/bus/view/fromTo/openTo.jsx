// Requirements
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@radix-ui/themes';
import { useBusOptions, useBusStereoLink, useDevice } from '@magical-mixing/mixers-react';
import { buildBusPath } from '../useBusViewTab';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { useFallbackBusColor } from '../../../../components/fallback';
import {
    BusIconName, BusStereoIconName,
    formatBusIdentifierShort, formatBusStereoIdentifierShort,
} from '../name';


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


const DestinationViewBus = ({ busIdTo, linkDestination }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const navigate = useNavigate();
    const { get } = useBusOptions();
    const option = useMemo(() => get(busIdTo), [get, busIdTo]);
    const { value: color } = useFallbackBusColor(busIdTo, 'gray');
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdTo);
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
        navigate(buildBusPath(busIdTo));
    }, [navigate, busIdTo]);

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


// Exported
export {
    DestinationIcon, DestinationViewBus,
};
