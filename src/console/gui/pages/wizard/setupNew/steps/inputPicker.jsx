// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    Box, Button, DropdownMenu, Flex, IconButton, Text,
} from '@radix-ui/themes';
import { CheckIcon, Link2Icon } from '@radix-ui/react-icons';
import { useBusInputId, useBusStereoLink, useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../components/language';
import {
    Label, LabelControlTable, LABEL_WIDTH,
} from '../../../../components/base/labelControlTable';
import { ICON_STYLE, ICON_SPACER } from '../../../../helpers/values';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import { useUiSize } from '../../../../components/theme';
import { DropdownMenuContent } from './../../../../components/base/dropdownMenuContent';


// Internal
const StereoLinkRow = ({ busId, stereoLink, onStereoLinkChange }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { has, side } = useBusStereoLink(busId);

    const sideShortLabel = useMemo(() => (side === 'L' ? t('Left') : t('Right')),
        [side, t]);

    const sideAriaLabel = useMemo(() => (side === 'L' ? t('Left') : t('Right')),
        [side, t]);

    const onToggle = useCallback(() => {
        onStereoLinkChange(!stereoLink);
    }, [onStereoLinkChange, stereoLink]);

    const ariaLabel = stereoLink ? `${t('Stereo link')}: ${sideAriaLabel}` : t('Stereo link');
    const commonProps = {
        size: textSize,
        variant: 'soft',
        radius: 'full',
        color: stereoLink ? 'blue' : 'gray',
        disabled,
        onClick: onToggle,
        'aria-label': ariaLabel,
    };

    if (!has) return null;

    return (
        <LabelControlTable.Row>
            <LabelControlTable.Cell width={LABEL_WIDTH}>
                <Label>
                    { t('Stereo link') }
                </Label>
            </LabelControlTable.Cell>
            <LabelControlTable.Cell>
                <Flex align="center" justify="end" width="100%" minWidth="0">
                    {!stereoLink ? (
                        <IconButton {...commonProps}>
                            <Link2Icon style={ICON_STYLE} />
                        </IconButton>
                    ) : (
                        <Button
                            {...commonProps}
                            className="mmc-btn-nowrap"
                        >
                            <Flex align="center" gapX="1" wrap="nowrap">
                                <Link2Icon style={ICON_STYLE} />
                                <Text size={textSize} wrap="nowrap">{ sideShortLabel }</Text>
                            </Flex>
                        </Button>
                    )}
                </Flex>
            </LabelControlTable.Cell>
        </LabelControlTable.Row>
    );
};


// Exported
export default ({
    busId, inputId, onInputChange, stereoLink, onStereoLinkChange,
}) => {
    const { t, translateOption } = useLanguage();
    const { textSize, menuContentSize } = useUiSize();
    const { has, options } = useBusInputId(busId);
    const { has: stereoLinkHas } = useBusStereoLink(busId);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const selected = useMemo(() => options.find(o => o.id === inputId),
        [inputId, options]);

    const displayValue = useMemo(() => {
        if (selected) return translateOption(selected);
        return t('Input');
    }, [selected, t, translateOption]);

    const onSelect = useCallback(id => () => {
        onInputChange(id);
    }, [onInputChange]);

    if (!has && !stereoLinkHas) return null;

    return (
        <LabelControlTable.List>
            {has && (
                <LabelControlTable.Row>
                    <LabelControlTable.Cell width={LABEL_WIDTH}>
                        <Label>
                            { t('Input') }
                        </Label>
                    </LabelControlTable.Cell>
                    <LabelControlTable.Cell>
                        <Flex align="center" justify="end" width="100%">
                            <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
                                <DropdownMenuTrigger
                                    square
                                    variant="soft"
                                    color="gray"
                                    onClick={toggleOpened}
                                    className="mmc-btn-nowrap"
                                >
                                    <Text size={textSize} color="gray" wrap="nowrap">
                                        { displayValue }
                                    </Text>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent size={menuContentSize}>
                                    <DropdownMenu.Label>
                                        <Flex align="center" gapX="1">
                                            <Box {...ICON_SPACER} />
                                            <Text size={textSize}>{ t('Input') }</Text>
                                        </Flex>
                                    </DropdownMenu.Label>
                                    {options.map((o) => {
                                        const isSelected = o.id === inputId;
                                        return (
                                            <DropdownMenu.Item
                                                key={o.id === null ? 'null' : String(o.id)}
                                                onSelect={onSelect(o.id)}
                                            >
                                                <Flex align="center" gapX="1" flexGrow="1">
                                                    {isSelected && <CheckIcon style={ICON_STYLE} />}
                                                    {!isSelected && <Box {...ICON_SPACER} />}
                                                    <Text size={textSize}>{ translateOption(o) }</Text>
                                                </Flex>
                                            </DropdownMenu.Item>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu.Root>
                        </Flex>
                    </LabelControlTable.Cell>
                </LabelControlTable.Row>
            )}
            {onStereoLinkChange && (
                <StereoLinkRow
                    busId={busId}
                    stereoLink={stereoLink}
                    onStereoLinkChange={onStereoLinkChange}
                />
            )}
        </LabelControlTable.List>
    );
};
