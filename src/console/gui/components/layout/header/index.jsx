// Requirements
import { useMemo } from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../language';
import {
    HeaderTrail, HeaderTrailActions, HeaderTrailCenter, HeaderTrailNavigation,
} from '../headerTrail';
import WizardTrigger from '../../../pages/wizard/trigger';
import { SetupWizardProvider } from '../../../pages/wizard/context';
import { HelpProvider } from '../../help/context';
import { AppearanceProvider } from '../../../pages/settings/appearance';
import { HotkeysSettingsProvider } from '../../../pages/settings/hotkeys';
import ActiveScene from './activeScene';
import { HeaderActions } from './actions';
import Menu from './menu';
import { Logo } from './logo';


// Constants
const headerHeight = '48px';


const headerStyle = {
    userSelect: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: headerHeight,
    maxHeight: headerHeight,
    padding: '0 16px',
    boxShadow: '0 1px var(--gray-a4)',
};


const headerFixedStyle = {
    ...headerStyle,
    position: 'fixed',
    top: 'var(--mmc-safe-top)',
    left: 'var(--mmc-safe-left)',
    right: 'var(--mmc-safe-right)',
    padding: '0',
};


// Internal
const HeaderContent = ({ fixed }) => {
    const { isOnline, isHalted } = useDevice();
    const { t } = useLanguage();

    const headerStyleFinal = useMemo(() => (!fixed ? headerStyle : headerFixedStyle), [fixed]);

    return (
        <header style={headerStyleFinal}>
            <Flex
                align="center"
                justify="between"
                gapX="3"
                flexGrow="1"
                px={fixed ? '4' : undefined}
                position="relative"
            >
                <Flex align="center" gapX="2" flexShrink="1" minWidth="0">
                    <Logo />
                    <HeaderTrail />
                </Flex>
                {isHalted && (
                    <Flex align="center" justify="center" gapX="2">
                        <Text size="2" color="gray">
                            { t('Paused') }
                        </Text>
                    </Flex>
                )}
                {!isOnline && !isHalted && (
                    <Flex align="center" justify="center" gapX="2">
                        <Spinner />
                        <Text size="2" color="gray">
                            { t('Reconnecting...') }
                        </Text>
                    </Flex>
                )}
                {isOnline && !isHalted && <HeaderTrailCenter />}
                <HeaderActions>
                    <ActiveScene />
                    <WizardTrigger />
                    <HeaderTrailActions />
                    <HeaderTrailNavigation />
                    <Menu />
                </HeaderActions>
            </Flex>
        </header>
    );
};


// Exported
export { headerHeight };


export default ({ fixed = false }) => (
    <SetupWizardProvider>
        <AppearanceProvider>
            <HotkeysSettingsProvider>
                <HelpProvider>
                    <HeaderContent fixed={fixed} />
                </HelpProvider>
            </HotkeysSettingsProvider>
        </AppearanceProvider>
    </SetupWizardProvider>
);
