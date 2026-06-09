// Requirements
import { useMemo } from 'react';
import {
    Flex, Separator, Skeleton, Text,
} from '@radix-ui/themes';
import { useBusName, useBusOptions, useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import Link from '../../../components/base/link';
import { FallbackBusIcon, useFallbackBusColor, useFallbackBusIcon } from '../../../components/fallback';
import { NameEditRow } from '../../../components/base/nameEditRow';

// Internal
const busTypeAbbrev = {
    channel: 'Ch',
    effect: 'Eff',
    line: 'Ln',
    secondary: 'Aux',
    main: 'Main',
    monitor: 'Monitor',
};


const formatBusIdentifierShort = (type, number) => {
    const abbrev = busTypeAbbrev[type] || `${type || ''}`.slice(0, 2);
    if (!abbrev) return null;
    if (number) return `${abbrev} ${number}`;
    return abbrev;
};


const formatBusStereoIdentifierShort = (type, numberLeft, numberRight) => {
    const left = formatBusIdentifierShort(type, numberLeft);
    if (!left || numberRight === undefined || numberRight === null) return left;
    return `${left} & ${numberRight}`;
};


const emptyBusName = (loading = false) => ({
    name: '',
    defaultName: '',
    isDefault: true,
    number: undefined,
    isUndefined: true,
    loading,
});


const useBusNameTranslated = (busId) => {
    const { translateOption } = useLanguage();
    const { get } = useBusOptions();
    const option = useMemo(() => get(busId), [get, busId]);
    const { has, value } = useBusName(busId);
    if (has === undefined) return emptyBusName(true);
    if (!option) {
        return {
            ...emptyBusName(false),
            name: (has && value) ? value : '',
            isDefault: !value,
            isUndefined: value === undefined,
        };
    }
    const optionTranslated = translateOption(option);
    return {
        name: (has && value) ? value : optionTranslated,
        defaultName: optionTranslated,
        isDefault: !value,
        number: option.number,
        isUndefined: value === undefined,
        loading: false,
    };
};


const useBusStereoNameProps = (busIdLeft, busIdRight) => {
    const { name: nameLeft, isDefault: isDefaultLeft } = useBusNameTranslated(busIdLeft);
    const {
        name: nameRight,
        isDefault: isDefaultRight, number: numberRight,
    } = useBusNameTranslated(busIdRight);

    const nameOverride = useMemo(() => {
        if (isDefaultLeft && isDefaultRight) return `${nameLeft} & ${numberRight}`;
        return `${nameLeft} & ${nameRight}`;
    }, [isDefaultLeft, isDefaultRight, nameLeft, nameRight, numberRight]);

    return { nameOverride };
};


const BusIconNameDivider = () => (
    <Separator orientation="vertical" size="1" />
);


const BusIconNameContent = ({
    busId, name, size, color, disabled, identifierPrefix, monochrome = false,
    inheritTypography = false, hideNameIfDefault = false, hideIdentifier = false,
    isDefault = false,
}) => {
    const { get } = useBusOptions();
    const { has: iconHas, value: iconValue } = useFallbackBusIcon(busId);
    const showIcon = iconHas && iconValue && iconValue !== 'none';
    const option = useMemo(() => get(busId), [get, busId]);
    const prefix = identifierPrefix;
    const showName = (!hideNameIfDefault || isDefault === false) && !(hideIdentifier && isDefault);
    const displayName = useMemo(() => {
        if (isDefault && option && !hideIdentifier) {
            return formatBusIdentifierShort(option.type, option.number) || name;
        }
        return name;
    }, [isDefault, option, name, hideIdentifier]);
    const inheritColor = monochrome || inheritTypography;
    const activeColor = disabled ? 'gray' : color;
    const textColor = inheritColor ? undefined : activeColor;
    const iconColor = inheritColor ? undefined : activeColor;
    const useMonochromeIcon = monochrome || inheritTypography;

    const textProps = inheritTypography
        ? { style: { font: 'inherit', color: 'inherit' } }
        : { size, color: textColor };

    const showPrefix = !!prefix && !hideIdentifier && (!showName || prefix !== displayName);

    if (!showIcon && !showPrefix && !(showName && displayName)) {
        return null;
    }

    return (
        <Flex
            align="center"
            gapX={showIcon ? '1' : '1'}
            style={inheritTypography ? {
                color: 'inherit',
                display: 'inline-flex',
                verticalAlign: 'middle',
                lineHeight: 1,
            } : undefined}
        >
            {showIcon && (
                <Flex
                    align="center"
                    flexShrink="0"
                    style={{ lineHeight: 0 }}
                >
                    <FallbackBusIcon
                        busId={busId}
                        color={iconColor}
                        monochrome={useMonochromeIcon}
                    />
                </Flex>
            )}
            {(showPrefix || showName) && (
                <Flex align="center" gapX="1">
                    {showPrefix && (
                        <>
                            <Text {...textProps}>
                                { prefix }
                            </Text>
                            {showName && (
                                <BusIconNameDivider />
                            )}
                        </>
                    )}
                    {showName && (
                        <Text {...textProps}>
                            { displayName }
                        </Text>
                    )}
                </Flex>
            )}
        </Flex>
    );
};

const useBusIdentifierPrefix = (busId) => {
    const { get } = useBusOptions();
    const option = useMemo(() => get(busId), [get, busId]);
    return useMemo(() => {
        if (!option) return null;
        return formatBusIdentifierShort(option.type, option.number);
    }, [option]);
};


const useBusIconNameVisible = (busId, {
    hideIdentifier = false,
    hideNameIfDefault = false,
    identifierPrefix,
    nameOverride,
} = {}) => {
    const { get } = useBusOptions();
    const { has: iconHas, value: iconValue } = useFallbackBusIcon(busId);
    const { name, isDefault } = useBusNameTranslated(busId);
    const showIcon = iconHas && iconValue && iconValue !== 'none';
    const option = useMemo(() => get(busId), [get, busId]);
    const effectiveHideNameIfDefault = hideNameIfDefault || hideIdentifier;
    const showName = (!effectiveHideNameIfDefault || isDefault === false)
        && !(hideIdentifier && isDefault);
    const displayName = useMemo(() => {
        if (isDefault && option && !hideIdentifier) {
            return formatBusIdentifierShort(option.type, option.number) || name;
        }
        return nameOverride || name;
    }, [isDefault, option, name, hideIdentifier, nameOverride]);
    const prefix = identifierPrefix;
    const showPrefix = !!prefix && !hideIdentifier && (!showName || prefix !== displayName);
    return showIcon || showPrefix || (showName && !!displayName);
};

const useBusStereoIconNameVisible = (busIdLeft, busIdRight, { hideIdentifier = false } = {}) => {
    const { nameOverride } = useBusStereoNameProps(busIdLeft, busIdRight);
    const { isDefault: isDefaultLeft } = useBusNameTranslated(busIdLeft);
    const { isDefault: isDefaultRight } = useBusNameTranslated(busIdRight);
    const stereoDefault = isDefaultLeft && isDefaultRight;
    return useBusIconNameVisible(busIdLeft, {
        hideIdentifier,
        hideNameIfDefault: hideIdentifier,
        nameOverride: hideIdentifier && stereoDefault ? undefined : nameOverride,
    });
};


// Exported
export {
    formatBusIdentifierShort,
    formatBusStereoIdentifierShort,
    useBusNameTranslated,
    useBusIdentifierPrefix,
    useBusIconNameVisible,
    useBusStereoIconNameVisible,
};

export const BusIconName = ({
    busId, size = '2', color: colorProp, monochrome = false, inheritTypography = false,
    identifierPrefix, hideNameIfDefault = false, hideIdentifier = false, nameOverride,
}) => {
    const { disabled } = useDevice();
    const { name, isDefault } = useBusNameTranslated(busId);
    const { value: colorFallback } = useFallbackBusColor(busId, 'gray');
    const color = colorProp ?? colorFallback;
    return (
        <BusIconNameContent
            busId={busId}
            name={nameOverride || name}
            size={size}
            color={color}
            disabled={disabled}
            identifierPrefix={identifierPrefix}
            hideNameIfDefault={hideNameIfDefault || hideIdentifier}
            hideIdentifier={hideIdentifier}
            isDefault={nameOverride ? false : isDefault}
            monochrome={monochrome}
            inheritTypography={inheritTypography}
        />
    );
};


/** Header-style bus label: icon + type/number prefix + name when customized. */
export const BusIconNameLabeled = ({ busId, ...props }) => {
    const identifierPrefix = useBusIdentifierPrefix(busId);
    return (
        <BusIconName
            busId={busId}
            identifierPrefix={identifierPrefix}
            hideNameIfDefault
            {...props}
        />
    );
};


export const BusStereoIconName = ({
    busIdLeft, busIdRight, size = '2', color, monochrome = false, inheritTypography = false,
    hideIdentifier = false,
}) => {
    const { nameOverride } = useBusStereoNameProps(busIdLeft, busIdRight);
    const { isDefault: isDefaultLeft } = useBusNameTranslated(busIdLeft);
    const { isDefault: isDefaultRight } = useBusNameTranslated(busIdRight);
    const stereoDefault = isDefaultLeft && isDefaultRight;

    return (
        <BusIconName
            busId={busIdLeft}
            size={size}
            color={color}
            nameOverride={hideIdentifier && stereoDefault ? undefined : nameOverride}
            hideIdentifier={hideIdentifier}
            monochrome={monochrome}
            inheritTypography={inheritTypography}
        />
    );
};


export const BusIconNameLink = ({
    busId, nameOverride = '', variant = 'ghost', onContextMenu, identifierPrefix, size = '2',
    hideNameIfDefault = false, hideIdentifier = false,
}) => {
    const { disabled } = useDevice();
    const { name, isDefault, loading } = useBusNameTranslated(busId);
    const { value: color } = useFallbackBusColor(busId, 'gray');

    // We won't be showing the gray skeleton itself
    const skeletonStyle = useMemo(() => ({
        opacity: loading ? 0 : 1,
    }), [loading]);

    const textStyle = useMemo(() => ({
        ...(disabled && {
            cursor: 'not-allowed',
            opacity: 0.5,
        }),
    }), [disabled]);

    return (
        <Link size={size} variant={variant} color={disabled ? 'gray' : color} to={`/bus/${busId}`} disabled={disabled} onContextMenu={onContextMenu}>
            <Skeleton loading={loading} style={skeletonStyle}>
                <Flex align="center" gapX="1" style={textStyle}>
                    <BusIconNameContent
                        busId={busId}
                        name={nameOverride || name || '...'}
                        size={size}
                        color={color}
                        disabled={disabled}
                        identifierPrefix={identifierPrefix}
                        hideNameIfDefault={hideNameIfDefault || hideIdentifier}
                        hideIdentifier={hideIdentifier}
                        isDefault={nameOverride ? false : isDefault}
                    />
                </Flex>
            </Skeleton>
        </Link>
    );
};


export const BusIconNameLinkLabeled = ({ busId, ...props }) => {
    const identifierPrefix = useBusIdentifierPrefix(busId);
    return (
        <BusIconNameLink
            busId={busId}
            identifierPrefix={identifierPrefix}
            hideNameIfDefault
            {...props}
        />
    );
};


export const BusStereoIconNameLink = ({
    busIdLeft, busIdRight, onContextMenu, size = '2',
}) => {
    const { nameOverride } = useBusStereoNameProps(busIdLeft, busIdRight);

    return (
        <BusIconNameLink
            busId={busIdLeft}
            nameOverride={nameOverride}
            onContextMenu={onContextMenu}
            size={size}
        />
    );
};


export const NameEdit = ({ busId, onEnter }) => {
    const { t, translateOption } = useLanguage();
    const { has, value, set } = useBusName(busId);
    const { get } = useBusOptions();
    const option = useMemo(() => get(busId), [get, busId]);
    const placeholder = translateOption(option);

    if (!has || value === undefined) return null;

    return (
        <NameEditRow
            id="bus-name"
            label={t('Name')}
            placeholder={placeholder}
            value={value}
            set={set}
            onEnter={onEnter}
        />
    );
};
