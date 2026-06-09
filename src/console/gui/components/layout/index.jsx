// Requirements
import { Flex, ScrollArea } from '@radix-ui/themes';
import { useMemo } from 'react';
import {
    Footer, FooterContext,
} from './footer';
import { HeaderTrailContext } from './headerTrail';
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
    }), []);

    return (
        <main style={scrollStyle}>
            <ScrollArea type="scroll" radius="full" scrollbars="both" height="100%">
                <Flex px={layoutPaddingX} py={layoutPaddingY} width="auto">
                    {children}
                </Flex>
            </ScrollArea>
        </main>
    );
};


// Exported
export default ({ children }) => (
    <HeaderTrailContext>
        <FooterContext>
            <div style={layoutStyle}>
                <Header />
                <Main>
                    {children}
                </Main>
                <Footer />
            </div>
        </FooterContext>
    </HeaderTrailContext>
);
