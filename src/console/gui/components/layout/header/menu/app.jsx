// Requirements
import { useCallback } from 'react';
import {
    Box,
    DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import {
    SunIcon, MoonIcon, CheckIcon, DesktopIcon,
} from '@radix-ui/react-icons';
import { ICON_STYLE, ICON_SPACER } from '../../../../helpers/values';
import { useLanguage } from '../../../language';
import { useTheme, useUiSize } from '../../../theme';
import CheckToggleButton from '../../../base/checkToggleButton';
import { preventDefault } from '../../../../helpers/behaviour';
import { DropdownMenuSubContent } from './../../../base/dropdownMenuContent';


// Exported
export default () => {
    const { t, language, languageSet } = useLanguage();
    const doLanguageSet = useCallback(l => () => languageSet(l), [languageSet]);

    const {
        setTheme, textSize, setTextSize, receptionShortcuts, setReceptionShortcuts,
    } = useTheme();
    const { iconSpacer } = useUiSize();

    const themeSet = useCallback(v => () => {
        setTheme(v);
    }, [setTheme]);

    const textSizeSet = useCallback(v => () => {
        setTextSize(v);
    }, [setTextSize]);

    const receptionShortcutsToggle = useCallback(() => setReceptionShortcuts(!receptionShortcuts),
        [receptionShortcuts, setReceptionShortcuts]);

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{ t('Appearance') }</DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>{ t('Size') }</DropdownMenu.SubTrigger>
                    <DropdownMenuSubContent size="2">
                        <DropdownMenu.Item onSelect={preventDefault(textSizeSet('1'))}>
                            <Flex align="center" gapX="1">
                                {textSize === '1' ? <CheckIcon style={ICON_STYLE} /> : <Box {...iconSpacer} />}
                                <Text size="2">{t('Small')}</Text>
                            </Flex>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={preventDefault(textSizeSet('2'))}>
                            <Flex align="center" gapX="1">
                                {textSize === '2' ? <CheckIcon style={ICON_STYLE} /> : <Box {...iconSpacer} />}
                                <Text size="2">{t('Normal')}</Text>
                            </Flex>
                        </DropdownMenu.Item>
                    </DropdownMenuSubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>{ t('Language') }</DropdownMenu.SubTrigger>
                    <DropdownMenuSubContent size="2">
                        <DropdownMenu.Item onSelect={preventDefault(doLanguageSet('en'))}>
                            <Flex align="center" gapX="1">
                                {language === 'en' ? <CheckIcon style={ICON_STYLE} /> : <Box {...ICON_SPACER} />}
                                <Text size="2">{t('English')}</Text>
                            </Flex>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={preventDefault(doLanguageSet('es'))}>
                            <Flex align="center" gapX="1">
                                {language === 'es' ? <CheckIcon style={ICON_STYLE} /> : <Box {...ICON_SPACER} />}
                                <Text size="2">{t('Spanish')}</Text>
                            </Flex>
                        </DropdownMenu.Item>
                    </DropdownMenuSubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>{ t('Mode') }</DropdownMenu.SubTrigger>
                    <DropdownMenuSubContent size="2">
                        <DropdownMenu.Item onSelect={preventDefault(themeSet('light'))}>
                            <Flex align="center" justify="between" gapX="3" flexGrow="1">
                                <Text size="2">{t('Light')}</Text>
                                <SunIcon style={ICON_STYLE} />
                            </Flex>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={preventDefault(themeSet('dark'))}>
                            <Flex align="center" justify="between" gapX="3" flexGrow="1">
                                <Text size="2">{t('Dark')}</Text>
                                <MoonIcon style={ICON_STYLE} />
                            </Flex>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={preventDefault(themeSet('system'))}>
                            <Flex align="center" justify="between" gapX="3" flexGrow="1">
                                <Text size="2">{t('System')}</Text>
                                <DesktopIcon style={ICON_STYLE} />
                            </Flex>
                        </DropdownMenu.Item>
                    </DropdownMenuSubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>{ t('Layout') }</DropdownMenu.SubTrigger>
                    <DropdownMenuSubContent size="2">
                        <DropdownMenu.Item onSelect={preventDefault(receptionShortcutsToggle)}>
                            <Flex align="center" justify="between" gapX="3" flexGrow="1">
                                <Text size="2">
                                    { t('Show extra shortcuts in bus reception in large screens') }
                                </Text>
                                <CheckToggleButton
                                    active={receptionShortcuts}
                                    onClick={receptionShortcutsToggle}
                                />
                            </Flex>
                        </DropdownMenu.Item>
                    </DropdownMenuSubContent>
                </DropdownMenu.Sub>
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};
