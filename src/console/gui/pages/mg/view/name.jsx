// Requirements
import { useMemo } from 'react';
import {
    Flex, Separator, Skeleton, Text,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import {
    FallbackMgIcon,
    FallbackMgIconUse,
    FallbackMgMute,
    FallbackMgName,
} from '../../../components/fallback';
import Link from '../../../components/base/link';
import { NameEditRow } from '../../../components/base/nameEditRow';

// Internal
const NameEditFinal = ({
    has, value, set, onEnter, defaultName,
}) => {
    const { t } = useLanguage();

    const placeholder = useMemo(() => ((!has || !value)
        ? defaultName : value), [has, value, defaultName]);

    if (!has || value === undefined) return null;

    return (
        <NameEditRow
            id="mg-name"
            label={t('Name')}
            placeholder={placeholder}
            value={value}
            set={set}
            onEnter={onEnter}
        />
    );
};


const MgIconNameDivider = () => (
    <Separator orientation="vertical" size="1" />
);


const mgIconNameColor = (disabled, hasMute, isMuted) => {
    if (disabled) return 'gray';
    if (hasMute && isMuted) return 'red';
    return 'gray';
};


const MgIconNameContent = ({
    mgId, name, size, color,
    identifierPrefix, hideNameIfDefault = false, hideIdentifier = false,
    isDefault = false, identifierFirst = false,
}) => {
    const prefix = identifierPrefix;
    const showName = identifierFirst
        ? !isDefault
        : (!hideNameIfDefault || isDefault === false) && !(hideIdentifier && isDefault);
    const displayName = useMemo(() => {
        if (identifierFirst && !isDefault) return name;
        if (isDefault && !hideIdentifier) return prefix || name;
        return name;
    }, [identifierFirst, isDefault, name, hideIdentifier, prefix]);
    const showPrefix = identifierFirst
        ? !!prefix
        : !!prefix && !hideIdentifier && (!showName || prefix !== displayName);

    return (
        <FallbackMgIconUse mgId={mgId}>
            {({ has: iconHas, value: iconValue }) => {
                const showIcon = iconHas && iconValue && iconValue !== 'none';

                return (
                    <Flex
                        align="center"
                        gapX="1"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            lineHeight: 1,
                        }}
                    >
                        {showIcon && (
                            <Flex
                                align="center"
                                flexShrink="0"
                                style={{ lineHeight: 0 }}
                            >
                                <FallbackMgIcon
                                    mgId={mgId}
                                    color={color}
                                />
                            </Flex>
                        )}
                        {(showPrefix || showName) && (
                            <Flex align="center" gapX="1">
                                {showPrefix && (
                                    <>
                                        <Text
                                            size={size}
                                            color={color}
                                            style={{ lineHeight: 1 }}
                                        >
                                            { prefix }
                                        </Text>
                                        {showName && (
                                            <MgIconNameDivider />
                                        )}
                                    </>
                                )}
                                {showName && (
                                    <Text
                                        size={size}
                                        color={color}
                                        style={{ lineHeight: 1 }}
                                    >
                                        { displayName }
                                    </Text>
                                )}
                            </Flex>
                        )}
                    </Flex>
                );
            }}
        </FallbackMgIconUse>
    );
};


// Exported
export const MgFinalName = ({ mgId, children }) => (
    <FallbackMgName mgId={mgId}>
        {({ has, value, defaultName }) => {
            const finalName = ((!has || !value) ? defaultName : value);
            if (typeof children === 'function') return children(finalName);
            return finalName;
        }}
    </FallbackMgName>
);


export const MgIconName = ({
    mgId,
    nameOverride = '',
    variant = 'ghost',
    onContextMenu,
    withLink = false,
    size = '2',
    identifierPrefix,
    hideNameIfDefault = false,
    hideIdentifier = false,
    identifierFirst = false,
}) => {
    const { disabled } = useDevice();

    const textStyle = useMemo(() => ({
        ...(disabled && {
            cursor: 'not-allowed',
            opacity: 0.5,
        }),
    }), [disabled]);

    return (
        <FallbackMgName mgId={mgId}>
            {({ value, defaultName }) => {
                const isDefault = !value?.trim();
                const customName = value?.trim();
                const name = nameOverride || customName || defaultName;
                const prefix = identifierPrefix ?? defaultName;

                return (
                    <FallbackMgMute mgId={mgId}>
                        {({ has: hasMute, value: isMuted }) => {
                            const color = mgIconNameColor(disabled, hasMute, isMuted);
                            const content = (
                                <Skeleton loading={!name} style={{ opacity: !name ? 0 : 1 }}>
                                    <Flex style={textStyle}>
                                        <MgIconNameContent
                                            mgId={mgId}
                                            name={name}
                                            size={size}
                                            color={color}
                                            identifierPrefix={prefix}
                                            hideNameIfDefault={
                                                hideNameIfDefault || hideIdentifier
                                            }
                                            hideIdentifier={hideIdentifier}
                                            isDefault={nameOverride ? false : isDefault}
                                            identifierFirst={identifierFirst}
                                        />
                                    </Flex>
                                </Skeleton>
                            );

                            if (!withLink) return content;

                            return (
                                <Link
                                    size={size}
                                    variant={variant}
                                    color={color}
                                    to={`/mg/${mgId}`}
                                    disabled={disabled}
                                    onContextMenu={onContextMenu}
                                >
                                    { content }
                                </Link>
                            );
                        }}
                    </FallbackMgMute>
                );
            }}
        </FallbackMgName>
    );
};


export const MgIconNameLink = ({
    mgId,
    nameOverride = '',
    variant = 'ghost',
    onContextMenu,
    size = '2',
    identifierPrefix,
    hideNameIfDefault = false,
    hideIdentifier = false,
    identifierFirst = false,
}) => (
    <MgIconName
        mgId={mgId}
        nameOverride={nameOverride}
        variant={variant}
        onContextMenu={onContextMenu}
        withLink
        size={size}
        identifierPrefix={identifierPrefix}
        hideNameIfDefault={hideNameIfDefault}
        hideIdentifier={hideIdentifier}
        identifierFirst={identifierFirst}
    />
);


export const NameEdit = ({ mgId, onEnter }) => (
    <FallbackMgName mgId={mgId}>
        {({
            has, value, set, defaultName,
        }) => (
            <NameEditFinal
                has={has}
                value={value}
                set={set}
                defaultName={defaultName}
                onEnter={onEnter}
            />
        )}
    </FallbackMgName>
);
