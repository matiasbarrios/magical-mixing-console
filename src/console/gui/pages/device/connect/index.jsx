// Requirements
import { AnimatePresence, motion } from 'motion/react';
import { Button, Card, Flex, ScrollArea } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import Header from '../../../components/layout/header';
import PageMessage from './pageMessage';
import useConnectPage from './useConnectPage';
import PageChrome from './pageChrome';
import Footer from './footer';
import CardHeader from './cardHeader';
import ManualForm from './manualForm';
import FoundDevices from './foundDevices';
import Searching from './searching';
import WaitingForNetwork from './waitingForNetwork';


// Exported
export default () => {
    const { t } = useLanguage();
    const {
        hasHeader,
        content,
        manualMode,
        demoRunning,
        foundVisible,
        devicesHas,
        ip,
        port,
        ipError,
        portError,
        connecting,
        notFoundManually,
        connectError,
        demoMessage,
        suggestRunDemo,
        opened,
        setOpened,
        toggleOpened,
        doSetIP,
        doSetPort,
        switchToSearchMode,
        switchToManualMode,
        tryToConnectToFound,
        tryToConnectManually,
        onInputsForManualEnter,
        stopDemo,
        runDemo,
    } = useConnectPage();

    return (
        <>
            {hasHeader && <Header fixed />}
            {!hasHeader && <PageChrome />}
            <Flex
                direction="column"
                align="center"
                justify="center"
                gap="6"
                maxWidth="100dvw"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: 'var(--mmc-viewport-height)',
                    marginTop: 'var(--mmc-safe-top)',
                    boxSizing: 'border-box',
                }}
                overflowX="hidden"
                p="2"
            >
                <Card
                    size="3"
                    style={{
                        '--color-panel': 'color-mix(in srgb, var(--color-panel-solid) 60%, transparent)',
                        '--backdrop-filter-panel': 'blur(12px)',
                    }}
                >
                    <ScrollArea type="auto" radius="full" scrollbars="vertical">
                        <Flex align="stretch" justify="center" direction="column" gapY="5" minWidth={{ initial: '250px', xs: '300px' }}>
                            <CardHeader
                                content={content}
                                manualMode={manualMode}
                                demoRunning={demoRunning}
                                opened={opened}
                                setOpened={setOpened}
                                toggleOpened={toggleOpened}
                                onSwitchToManual={switchToManualMode}
                                onSwitchToSearch={switchToSearchMode}
                                onRunDemo={runDemo}
                                onStopDemo={stopDemo}
                            />

                            <AnimatePresence mode="wait">
                                {content === 'connect-manually' && (
                                    <ManualForm
                                        ip={ip}
                                        port={port}
                                        ipError={ipError}
                                        portError={portError}
                                        connecting={connecting}
                                        notFoundManually={notFoundManually}
                                        onSetIP={doSetIP}
                                        onSetPort={doSetPort}
                                        onConnect={tryToConnectManually}
                                        onEnterKey={onInputsForManualEnter}
                                    />
                                )}
                                {(content === 'searching' || content === 'devices-found') && (
                                    <motion.div
                                        key="search-session"
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Flex direction="column" align="stretch" gap="4">
                                            {content === 'devices-found' && (
                                                <FoundDevices
                                                    foundVisible={foundVisible}
                                                    devicesHas={devicesHas}
                                                    onConnect={tryToConnectToFound}
                                                />
                                            )}
                                            <Searching />
                                        </Flex>
                                    </motion.div>
                                )}
                                {content === 'waiting-for-network' && (
                                    <WaitingForNetwork />
                                )}
                            </AnimatePresence>
                            {content === 'searching' && suggestRunDemo && !demoRunning && (
                                <Flex justify="center">
                                    <Button size="2" variant="ghost" onClick={() => runDemo('x18')} mb="1">
                                        { t('Run demo') }
                                    </Button>
                                </Flex>
                            )}
                        </Flex>
                    </ScrollArea>
                </Card>
                <PageMessage error={connectError} info={demoMessage} />
                {!hasHeader && <Footer />}
            </Flex>
        </>
    );
};
