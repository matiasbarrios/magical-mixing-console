// Requirements
import { useState } from 'react';
import {
    Box, Button, DropdownMenu, Flex, IconButton, Text,
} from '@radix-ui/themes';
import { CheckIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useLanguage, LANGUAGE_OPTIONS } from '../../../components/language';
import { useTheme, useUiSize } from '../../../components/theme';
import { DropdownMenuContent } from '../../../components/base/dropdownMenuContent';
import { noPointerDown } from '../../../helpers/behaviour';
import logo from '../../../static/logo.svg';
import { ICON_SPACER, ICON_STYLE } from '../../../helpers/values';


// Internal
const LanguageMenu = () => {
    const { t, language, languageSet } = useLanguage();
    const { textSize } = useUiSize();
    const [opened, setOpened] = useState(false);
    const toggleOpened = () => setOpened(!opened);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenu.Trigger asChild>
                <Button
                    variant="ghost"
                    radius="full"
                    color="gray"
                    size={textSize}
                    onPointerDown={noPointerDown}
                    onClick={toggleOpened}
                    aria-label={t('Language')}
                >
                    { language.toUpperCase() }
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenuContent size="2">
                {LANGUAGE_OPTIONS.map(o => (
                    <DropdownMenu.Item
                        key={o.value}
                        onSelect={() => languageSet(o.value)}
                    >
                        <Flex align="center" gapX="1" flexGrow="1">
                            {language === o.value && <CheckIcon style={ICON_STYLE} />}
                            {language !== o.value && <Box {...ICON_SPACER} />}
                            <Text size="2" color="gray" wrap="nowrap">{ t(o.label) }</Text>
                        </Flex>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


// Exported
export default () => {
    const { t } = useLanguage();
    const { themeCurrent, setTheme } = useTheme();
    const { textSize } = useUiSize();

    const toggleTheme = () => {
        setTheme(themeCurrent === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <Box style={{
                position: 'fixed',
                top: 'var(--mmc-safe-top)',
                left: 'var(--mmc-safe-left)',
                zIndex: 2,
                padding: '8px 16px 16px 16px',
            }}
            >
                <img src={logo} alt="" style={{ width: '32px', height: '32px' }} />
            </Box>
            <Box style={{
                position: 'fixed',
                top: 'var(--mmc-safe-top)',
                right: 'var(--mmc-safe-right)',
                zIndex: 2,
                padding: '16px',
            }}
            >
                <Flex align="center" gap="4">
                    <LanguageMenu />
                    <IconButton
                        variant="ghost"
                        radius="full"
                        color="gray"
                        size={textSize}
                        aria-label={themeCurrent === 'dark' ? t('Light') : t('Dark')}
                        onClick={toggleTheme}
                    >
                        {themeCurrent === 'dark' ? (
                            <SunIcon style={ICON_STYLE} />
                        ) : (
                            <MoonIcon style={ICON_STYLE} />
                        )}
                    </IconButton>
                </Flex>
            </Box>
        </>
    );
};
