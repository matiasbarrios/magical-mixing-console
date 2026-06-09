// Requirements
import { AnimatePresence, motion } from 'motion/react';
import { Button, Flex } from '@radix-ui/themes';
import { useMemo } from 'react';
import { useUiSize } from '../../theme';
import { FooterContext, useFooter } from './context';
import Mg from './mg';
import Solo from './solo';


// Constants
const footerSlotStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
};

const footerStyleBase = {
    userSelect: 'none',
    position: 'sticky',
    bottom: 0,
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'auto',
    padding: '0 16px',
    boxShadow: '0 -1px var(--gray-a4)',
};


// Exported
export const useFooterHeight = () => {
    const { footerHeightPx } = useUiSize();
    return useMemo(() => `${footerHeightPx}px`, [footerHeightPx]);
};

export { FooterContext, useFooter };


export const Footer = () => {
    const {
        shown, soloOn, mgShown, overrideWithAction,
    } = useFooter();
    const footerHeight = useFooterHeight();

    const footerStyle = useMemo(() => ({
        ...footerStyleBase,
        height: footerHeight,
        minHeight: footerHeight,
    }), [footerHeight]);

    const actionStyle = useMemo(() => ({
        ...footerStyle,
        justifyContent: 'flex-end',
    }), [footerStyle]);

    if (overrideWithAction?.action) {
        const {
            action, label, disabled, color, size = '1',
        } = overrideWithAction;
        return (
            <footer style={actionStyle}>
                <Button size={size} variant="soft" color={color || 'gray'} onClick={action} disabled={disabled}>
                    {label}
                </Button>
            </footer>
        );
    }

    return (
        <AnimatePresence>
            {(shown || soloOn) && (
                <motion.footer
                    style={footerStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    <Flex width="100%" height="100%" align="center">
                        <Flex flexBasis="33.33%" flexGrow="1" height="100%" justify="start" align="center">
                            <AnimatePresence>
                                {mgShown ? (
                                    <motion.div
                                        key="mg"
                                        style={footerSlotStyle}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Mg />
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </Flex>
                        <Flex flexBasis="33.33%" flexGrow="1" height="100%" justify="center" align="center">
                            <AnimatePresence>
                                {soloOn ? (
                                    <motion.div
                                        key="soloOn"
                                        style={footerSlotStyle}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Solo />
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </Flex>
                        <Flex flexBasis="33.33%" flexGrow="1" />
                    </Flex>
                </motion.footer>
            )}
        </AnimatePresence>
    );
};
