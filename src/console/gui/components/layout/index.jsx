// Requirements
import { Flex, ScrollArea } from '@radix-ui/themes';
import { useMemo } from 'react';
import HotkeyListener from '../hotkeys/listener';
import {
    Footer, FooterProvider,
} from './footer';
import { HeaderTrailProvider } from './headerTrail';
import Header from './header';
import { layoutPaddingX, layoutPaddingY } from './contentPadding';


// Constants
const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: 'var(--mmc-viewport-height)',
    marginTop: 'var(--mmc-safe-top)',
    width: '100%',
    boxSizing: 'border-box',
};


// Internal
const Main = ({ children }) => {
    const scrollStyle = useMemo(() => ({
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        outline: 'none',
    }), []);

    return (
        <main style={scrollStyle} tabIndex={-1}>
            <ScrollArea type="scroll" radius="full" scrollbars="both" height="100%">
                <Flex px={layoutPaddingX} py={layoutPaddingY} width="100%" minWidth="0">
                    {children}
                </Flex>
            </ScrollArea>
        </main>
    );
};


// Exported
export default ({ children }) => (
    <HeaderTrailProvider>
        <FooterProvider>
            <HotkeyListener />
            <div style={layoutStyle}>
                <Header />
                <Main>
                    {children}
                </Main>
                <Footer />
            </div>
        </FooterProvider>
    </HeaderTrailProvider>
);
