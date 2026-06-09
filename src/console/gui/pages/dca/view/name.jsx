// Requirements
import { useMemo } from 'react';
import {
    Flex, Separator, Skeleton, Text,
} from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import {
    FallbackDcaColor,
    FallbackDcaIcon,
    FallbackDcaIconUse,
    FallbackDcaName,
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
            id="dca-name"
            label={t('Name')}
            placeholder={placeholder}
            value={value}
            set={set}
            onEnter={onEnter}
        />
    );
};


// Internal
const DcaFinalName = ({ dcaId, children }) => (
    <FallbackDcaName dcaId={dcaId}>
        {({ has, value, defaultName }) => {
            const finalName = ((!has || !value) ? defaultName : value);
            if (typeof children === 'function') return children(finalName);
            return finalName;
        }}
    </FallbackDcaName>
);


const DcaIconNameDivider = () => (
    <Separator orientation="vertical" size="1" />
);


const DcaIconNameContent = ({
    dcaId, name, size, color, disabled, identifierPrefix,
    hideNameIfDefault = false, hideIdentifier = false, isDefault = false,
}) => {
    const prefix = identifierPrefix;
    const showName = (!hideNameIfDefault || isDefault === false)
        && !(hideIdentifier && isDefault);
    const displayName = useMemo(() => {
        if (isDefault && !hideIdentifier) return prefix || name;
        return name;
    }, [isDefault, name, hideIdentifier, prefix]);
    const textColor = disabled ? 'gray' : color;
    const showPrefix = !!prefix && !hideIdentifier && (!showName || prefix !== displayName);

    return (
        <FallbackDcaIconUse dcaId={dcaId}>
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
                                <FallbackDcaIcon
                                    dcaId={dcaId}
                                    color={textColor}
                                />
                            </Flex>
                        )}
                        {(showPrefix || showName) && (
                            <Flex align="center" gapX="1">
                                {showPrefix && (
                                    <>
                                        <Text
                                            size={size}
                                            color={textColor}
                                            style={{ lineHeight: 1 }}
                                        >
                                            { prefix }
                                        </Text>
                                        {showName && (
                                            <DcaIconNameDivider />
                                        )}
                                    </>
                                )}
                                {showName && (
                                    <Text
                                        size={size}
                                        color={textColor}
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
        </FallbackDcaIconUse>
    );
};


const DcaIconName = ({
    dcaId, nameOverride = '', size = '2', identifierPrefix,
    hideNameIfDefault = false, hideIdentifier = false,
}) => {
    const { disabled } = useDevice();

    const textStyle = useMemo(() => ({
        ...(disabled && {
            cursor: 'not-allowed',
            opacity: 0.5,
        }),
    }), [disabled]);

    return (
        <FallbackDcaName dcaId={dcaId}>
            {({ value, defaultName }) => {
                const isDefault = !value?.trim();
                const customName = value?.trim();
                const name = nameOverride || customName || defaultName;
                const prefix = identifierPrefix ?? defaultName;

                return (
                    <FallbackDcaColor dcaId={dcaId} defaultValue="gray">
                        {({ value: color }) => (
                            <Skeleton loading={!name} style={{ opacity: !name ? 0 : 1 }}>
                                <Flex style={textStyle}>
                                    <DcaIconNameContent
                                        dcaId={dcaId}
                                        name={name}
                                        size={size}
                                        color={color}
                                        disabled={disabled}
                                        identifierPrefix={prefix}
                                        hideNameIfDefault={hideNameIfDefault || hideIdentifier}
                                        hideIdentifier={hideIdentifier}
                                        isDefault={nameOverride ? false : isDefault}
                                    />
                                </Flex>
                            </Skeleton>
                        )}
                    </FallbackDcaColor>
                );
            }}
        </FallbackDcaName>
    );
};


const DcaIconNameLink = ({
    dcaId, nameOverride = '', variant = 'ghost', onContextMenu, size = '2',
    identifierPrefix, hideNameIfDefault = false, hideIdentifier = false,
}) => {
    const { disabled } = useDevice();

    const textStyle = useMemo(() => ({
        ...(disabled && {
            cursor: 'not-allowed',
            opacity: 0.5,
        }),
    }), [disabled]);

    return (
        <FallbackDcaName dcaId={dcaId}>
            {({ value, defaultName }) => {
                const isDefault = !value?.trim();
                const customName = value?.trim();
                const name = nameOverride || customName || defaultName;
                const prefix = identifierPrefix ?? defaultName;

                return (
                    <FallbackDcaColor dcaId={dcaId} defaultValue="gray">
                        {({ value: color }) => (
                            <Link
                                size={size}
                                variant={variant}
                                color={color}
                                to={`/dca/${dcaId}`}
                                disabled={disabled}
                                onContextMenu={onContextMenu}
                            >
                                <Skeleton loading={!name} style={{ opacity: !name ? 0 : 1 }}>
                                    <Flex align="center" gapX="1" style={textStyle}>
                                        <DcaIconNameContent
                                            dcaId={dcaId}
                                            name={name}
                                            size={size}
                                            color={color}
                                            disabled={disabled}
                                            identifierPrefix={prefix}
                                            hideNameIfDefault={hideNameIfDefault || hideIdentifier}
                                            hideIdentifier={hideIdentifier}
                                            isDefault={nameOverride ? false : isDefault}
                                        />
                                    </Flex>
                                </Skeleton>
                            </Link>
                        )}
                    </FallbackDcaColor>
                );
            }}
        </FallbackDcaName>
    );
};


const NameEdit = ({ dcaId, onEnter }) => (
    <FallbackDcaName dcaId={dcaId}>
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
    </FallbackDcaName>
);


// Exported
export {
    DcaFinalName,
    DcaIconName,
    DcaIconNameLink,
    NameEdit,
};

