// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    Box, DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { DROPDOWN_MENU_CONTENT_SIZE, ICON_STYLE, ICON_SPACER } from '../../../helpers/values';
import { useUiSize } from '../../theme';
import { DropdownMenuTrigger } from '../../base/dropdownMenuTrigger';
import { DropdownMenuContent } from '../../base/dropdownMenuContent';


// Constants
const labelStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '160px',
};


// Exported
export default ({ tabs, active, onChange }) => {
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    const activeLabel = useMemo(() => tabs.find(tab => tab.id === active)?.label ?? '',
        [tabs, active]);

    const onSelect = useCallback((tabId) => {
        if (disabled) return;
        onChange(tabId);
    }, [onChange, disabled]);

    if (tabs.length <= 1) {
        return (
            <Text size={textSize} color="blue" truncate style={labelStyle}>
                { activeLabel }
            </Text>
        );
    }

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                square
                size="2"
                variant="ghost"
                color="gray"
                onClick={toggleOpened}
                className="mmc-shrink-0"
            >
                <Flex align="center" gapX="1" minWidth="0">
                    <Text size={textSize} truncate style={labelStyle}>{ activeLabel }</Text>
                    <ChevronDownIcon style={ICON_STYLE} />
                </Flex>
            </DropdownMenuTrigger>
            <DropdownMenuContent size={DROPDOWN_MENU_CONTENT_SIZE} align="center">
                {tabs.map(tab => (
                    <DropdownMenu.Item key={tab.id} onSelect={() => onSelect(tab.id)}>
                        <Flex align="center" gapX="1">
                            {active === tab.id
                                ? <CheckIcon style={ICON_STYLE} />
                                : <Box {...ICON_SPACER} />}
                            <Text size={textSize}>{ tab.label }</Text>
                        </Flex>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};
