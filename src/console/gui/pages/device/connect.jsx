// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
    Box, Button, Card, Flex, Text, Heading, Spinner,
    TextField, ScrollArea, DropdownMenu, IconButton,
} from '@radix-ui/themes';
import { useSearch } from '@magical-mixing/mixers-react';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useHaptics } from '../../components/global/mobile';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import { useDevices } from '../../components/devices/context';
import Avatar from '../../components/devices/avatar';
import Header from '../../components/layout/header';
import { platformGet } from '../../platform';
import { noPointerDown } from '../../helpers/behaviour';
import { isValidIP, isValidPort, ICON_STYLE } from '../../helpers/values';
import { filterDuplicateLocalhostDevices } from '../../helpers/foundDevices';
import { GlobalInfoCallout, useGlobalInfo } from '../../components/global/callout';
import { DropdownMenuContent } from '../../components/base/dropdownMenuContent';


// Constants
const modelStyle = {
    objectFit: 'cover',
    borderRadius: 'var(--radius-2)',
    width: '56px',
    height: '56px',
};

const initialContents = { scale: 0.95, opacity: 0 };
const animateContents = { scale: 1, opacity: 1 };
const exitContents = { scale: 0.95, opacity: 0 };

const initialHeader = { opacity: 0 };
const animateHeader = { opacity: 1 };
const exitHeader = { opacity: 0 };

const initialDevice = { x: -10, opacity: 0 };
const animateDevice = { x: 0, opacity: 1 };
const exitDevice = { x: -10, opacity: 0 };

const transition = { duration: 0.2 };

const demoIp = '127.0.0.1';
const demoPort = 10024;
const demoSuggestDelay = 3 * 1000;

const connectPageStyle = {
    height: 'var(--mmc-viewport-height)',
    marginTop: 'var(--mmc-safe-top)',
    boxSizing: 'border-box',
};


// Exported
export default () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const navigate = useNavigate();
    const { globalInfoEdit } = useGlobalInfo();
    const { hapticsTrigger } = useHaptics();
    const { devices, deviceAdd, devicesHas } = useDevices();
    const {
        found, searchInIPPort, searchStart, searchStop, getFound,
    } = useSearch();

    // Network state
    const [networkOnline, setNetworkOnline] = useState(!!navigator.onLine);

    const networkStateUpdate = useCallback(async () => {
        await hapticsTrigger();
        setNetworkOnline(!!navigator.onLine);
    }, [hapticsTrigger]);

    // When connection lost
    useEffect(() => {
        window.addEventListener('online', networkStateUpdate);
        window.addEventListener('offline', networkStateUpdate);
        return () => {
            window.removeEventListener('online', networkStateUpdate);
            window.removeEventListener('offline', networkStateUpdate);
        };
    }, [networkStateUpdate]);

    // Page state
    const [searching, setSearching] = useState(false);
    const [manualMode, setManualMode] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [notFoundManually, setNotFoundManually] = useState(false);
    const [suggestRunDemo, setSuggestRunDemo] = useState(false);

    const [ip, setIP] = useState('');
    const [ipError, setIPError] = useState(null);
    const [port, setPort] = useState('');
    const [portError, setPortError] = useState(null);

    // In a ref
    const stateRef = useRef({});
    useEffect(() => {
        stateRef.current = {
            searching,
            manualMode,
            connecting,
        };
    }, [searching, manualMode, connecting]);

    // Calculated
    const foundVisible = useMemo(() => filterDuplicateLocalhostDevices(found),
        [found]);
    const somethingFound = useMemo(() => foundVisible.length > 0, [foundVisible]);

    const content = useMemo(() => {
        if (!networkOnline) return 'waiting-for-network';
        if (manualMode) return 'connect-manually';
        if (somethingFound) return 'devices-found';
        if (searching) return 'searching';
        return '';
    }, [networkOnline, manualMode, somethingFound, searching]);

    const hasHeader = useMemo(() => !!Object.values(devices).length, [devices]);

    // Functions
    const doSetIP = useCallback((e) => {
        setIP(e.target.value);
        setIPError(null);
    }, []);

    const doSetPort = useCallback((e) => {
        setPort(e.target.value);
        setPortError(null);
    }, []);

    const switchToSearchMode = useCallback(async () => {
        setManualMode(false);
        setSearching(true);
        setSuggestRunDemo(false);
        await searchStart();
        setTimeout(() => {
            setSuggestRunDemo(true);
        }, demoSuggestDelay);
    }, [searchStart]);

    const switchToManualMode = useCallback(async () => {
        setManualMode(true);
        setNotFoundManually(false);
        setSearching(false);
        await searchStop();
    }, [searchStop]);

    const tryToConnectToFound = useCallback(async (d) => {
        if (devicesHas(d.ip, d.port)) return;
        setConnecting(true);
        setSearching(false);
        try {
            const device = await getFound(d.ip, d.port);
            await searchStop();
            await device.connect();
            deviceAdd(device);
            await hapticsTrigger();
            navigate('/', { replace: true }); // Done! We're leaving
        } catch {
            // Restart the search if device disappeared
            setConnecting(false);
            await switchToSearchMode();
        }
    }, [searchStop, getFound, deviceAdd, navigate, hapticsTrigger, devicesHas, switchToSearchMode]);

    const tryToConnectManually = useCallback(async () => {
        if (connecting) return;
        if (devicesHas(ip, port)) {
            setIPError(t('Connected'));
            return;
        }
        if (!isValidIP(ip)) {
            setIPError(t('Invalid IP'));
            return;
        }
        if (!isValidPort(port)) {
            setPortError(t('Invalid port'));
            return;
        }

        setNotFoundManually(false);
        setConnecting(true);

        await searchInIPPort(ip, port, async (data) => {
            try {
                const device = await getFound(data.ip, data.port);
                await device.connect();
                deviceAdd(device);
                await hapticsTrigger();
                navigate('/', { replace: true });
            } catch {
                setNotFoundManually(true);
                setConnecting(false);
            }
        }, async () => {
            setNotFoundManually(true);
            setConnecting(false);
        });
    }, [searchInIPPort, ip, port, getFound, devicesHas, connecting,
        deviceAdd, navigate, hapticsTrigger, t]);

    const onInputsForManualEnter = useCallback(async (e) => {
        if (e.key === 'Enter') await tryToConnectManually();
    }, [tryToConnectManually]);

    // Searching control
    // Timer for avoiding fast starts and stops
    const searchStartTimer = useRef(null);
    useEffect(() => {
        const doSearchStop = () => {
            if (searchStartTimer.current) {
                clearTimeout(searchStartTimer.current);
            }
            searchStartTimer.current = null;
            setTimeout(async () => {
                await searchStop();
            }, 1);
        };

        if (networkOnline
                && !stateRef.current.manualMode
                && !stateRef.current.searching
                && !stateRef.current.connecting) {
            setSearching(true);
            if (searchStartTimer.current) {
                clearTimeout(searchStartTimer.current);
            }
            searchStartTimer.current = setTimeout(async () => {
                setSuggestRunDemo(false);
                await searchStart();
                setTimeout(() => {
                    setSuggestRunDemo(true);
                }, demoSuggestDelay);
            }, 250);
        } else if (!networkOnline) {
            if (stateRef.current.connecting) setConnecting(false);
            if (stateRef.current.searching) {
                setSearching(false);
                doSearchStop();
            }
        }
        return doSearchStop;
    }, [networkOnline, searchStart, searchStop]);

    // Haptics
    useEffect(() => {
        if (content === 'devices-found') hapticsTrigger();
    }, [content, hapticsTrigger]);

    // Demo stuff
    const [demoRunning, setDemoRunning] = useState(false);

    useEffect(() => {
        const checkDemo = async () => {
            setDemoRunning(await platformGet().virtualDeviceIsRunning());
        };
        checkDemo();
    }, []);

    const stopDemo = useCallback(async () => {
        setDemoRunning(false);
        await platformGet().virtualDeviceStop();
        globalInfoEdit(t('Demo device should disappear soon'), 4 * 1000);
    }, [globalInfoEdit, t]);

    const runDemo = useCallback(async (deviceId) => {
        setDemoRunning(true);
        await platformGet().virtualDeviceRun(deviceId, demoIp, demoPort);
        await switchToSearchMode();
    }, [switchToSearchMode]);

    // Dropdown menu for options
    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    return (
        <>
            {hasHeader && <Header fixed />}
            <Flex direction="column" align="center" justify="center" gap="6" maxWidth="100dvw" style={connectPageStyle} overflowX="hidden" p="2">
                <Card size="3">
                    <ScrollArea type="auto" radius="full" scrollbars="vertical">
                        <Flex align="stretch" justify="center" direction="column" gapY="5" minWidth={{ initial: '250px', xs: '300px' }}>
                            <Flex align="center" width="100%">
                                <Box flexGrow="1" />
                                <Flex justify="center" flexShrink="0">
                                    <AnimatePresence mode="wait">
                                        {content === 'waiting-for-network' && (
                                            <motion.div
                                                key="waiting-for-network"
                                                initial={initialHeader}
                                                animate={animateHeader}
                                                exit={exitHeader}
                                                transition={transition}
                                            >
                                                <Heading as="h3" size="4">{ t('No network connection') }</Heading>
                                            </motion.div>
                                        )}
                                        {content === 'connect-manually' && (
                                            <motion.div
                                                key="connect-manually"
                                                initial={initialHeader}
                                                animate={animateHeader}
                                                exit={exitHeader}
                                                transition={transition}
                                            >
                                                <Heading as="h3" size="4">{ t('Device') }</Heading>
                                            </motion.div>
                                        )}
                                        {content === 'devices-found' && (
                                            <motion.div
                                                key="devices-found"
                                                initial={initialHeader}
                                                animate={animateHeader}
                                                exit={exitHeader}
                                                transition={transition}
                                            >
                                                <Heading as="h3" size="4">{ t('Devices found') }</Heading>
                                            </motion.div>
                                        )}
                                        {content === 'searching' && (
                                            <motion.div
                                                key="searching"
                                                initial={initialHeader}
                                                animate={animateHeader}
                                                exit={exitHeader}
                                                transition={transition}
                                            >
                                                <Heading as="h3" size="4">{ t('Searching devices') }</Heading>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Flex>
                                <Flex flexGrow="1" justify="end">
                                    <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
                                        <DropdownMenu.Trigger asChild>
                                            <IconButton
                                                variant="ghost"
                                                radius="full"
                                                color="gray"
                                                m="2"
                                                onPointerDown={noPointerDown}
                                                onClick={toggleOpened}
                                                size={textSize}
                                            >
                                                <DotsVerticalIcon style={ICON_STYLE} />
                                            </IconButton>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenuContent size="2">
                                            {!manualMode && (
                                                <DropdownMenu.Item onSelect={switchToManualMode}>
                                                    { t('Specify IP and port') }
                                                </DropdownMenu.Item>
                                            )}
                                            {manualMode && (
                                                <DropdownMenu.Item onSelect={switchToSearchMode}>
                                                    { t('Search') }
                                                </DropdownMenu.Item>
                                            )}
                                            <DropdownMenu.Separator />
                                            {demoRunning ? (
                                                <DropdownMenu.Item onSelect={stopDemo}>
                                                    { t('Stop demo') }
                                                </DropdownMenu.Item>
                                            ) : (
                                                <>
                                                    <DropdownMenu.Item onSelect={() => runDemo('x18')}>
                                                        { t('Run X18 demo') }
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item onSelect={() => runDemo('xr12')}>
                                                        { t('Run XR12 demo') }
                                                    </DropdownMenu.Item>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu.Root>
                                </Flex>
                            </Flex>

                            <AnimatePresence mode="wait">
                                {content === 'connect-manually' && (
                                    <motion.div
                                        key="connect-manually"
                                        initial={initialContents}
                                        animate={animateContents}
                                        exit={exitContents}
                                        transition={transition}
                                    >
                                        <Flex direction="column" gapY="5">
                                            <Flex direction="column" gapY="4">
                                                <Flex direction="column" gapY="1">
                                                    <Text size="2" as="label" weight="medium">
                                                        <Text size="2">{ t('Destination') }</Text>
                                                        <TextField.Root
                                                            size="2"
                                                            variant="surface"
                                                            placeholder={t('IP address')}
                                                            value={ip}
                                                            onChange={doSetIP}
                                                            onKeyDown={onInputsForManualEnter}
                                                            disabled={connecting}
                                                        />
                                                    </Text>
                                                    {!!ipError && <Text size="2" color="red">{ ipError }</Text>}
                                                </Flex>
                                                <Flex direction="column" gapY="1">
                                                    <Text size="2" as="label" weight="medium">
                                                        <Text size="2">{ t('Port') }</Text>
                                                        <TextField.Root
                                                            size="2"
                                                            variant="surface"
                                                            placeholder={t('Port number')}
                                                            value={port}
                                                            onChange={doSetPort}
                                                            onKeyDown={onInputsForManualEnter}
                                                            disabled={connecting}
                                                        />
                                                    </Text>
                                                    {!!portError && <Text size="2" color="red">{ portError }</Text>}
                                                </Flex>
                                            </Flex>
                                            <Flex align="center" justify="end" gapX="3">
                                                {notFoundManually && <Text size="2" color="red">{ t('Not found') }</Text> }
                                                <Button size="2" variant="soft" onClick={tryToConnectManually} disabled={connecting}>
                                                    { connecting ? t('Connecting') : '' }
                                                    { !connecting ? t('Connect') : '' }
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </motion.div>
                                )}
                                {content === 'devices-found' && (
                                    <motion.div
                                        key="devices-found"
                                        initial={initialContents}
                                        animate={animateContents}
                                        exit={exitContents}
                                        transition={transition}
                                    >
                                        <Flex direction="column" align="stretch" gapY="4">
                                            <AnimatePresence mode="sync">
                                                {foundVisible.map(d => (
                                                    <motion.div
                                                        key={`${d.ip}:${d.port}`}
                                                        initial={initialDevice}
                                                        animate={animateDevice}
                                                        exit={exitDevice}
                                                        transition={transition}
                                                    >
                                                        <Flex align="center" justify="between" gapX="6" key={`${d.ip}:${d.port}`}>
                                                            <Flex align="center" gapX="3">
                                                                <Avatar
                                                                    model={d.model}
                                                                    style={modelStyle}
                                                                />
                                                                <Box>
                                                                    <Text size="2" as="div" truncate>
                                                                        { `${d.brand} ${d.model}` }
                                                                    </Text>
                                                                    <Text size="2" as="div" color="gray" truncate>
                                                                        {`${d.ip} | ${d.name}`}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                            <Box>
                                                                <Button
                                                                    size="2"
                                                                    variant="soft"
                                                                    data-mmc-device-endpoint={`${d.ip}:${d.port}`}
                                                                    onClick={() => tryToConnectToFound(d)}
                                                                    disabled={devicesHas(d.ip, d.port)}
                                                                >
                                                                    { devicesHas(d.ip, d.port) ? t('Connected') : t('Connect') }
                                                                </Button>
                                                            </Box>
                                                        </Flex>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </Flex>
                                    </motion.div>
                                )}
                                {content === 'searching' && (
                                    <motion.div
                                        key="searching"
                                        initial={initialContents}
                                        animate={animateContents}
                                        exit={exitContents}
                                        transition={transition}
                                    >
                                        <Flex direction="column" align="center" justify="center" gapY="5">
                                            <Spinner />
                                            {suggestRunDemo && !demoRunning && (
                                                <Button size="2" variant="ghost" onClick={() => runDemo('x18')} mb="1">
                                                    { t('Run demo?') }
                                                </Button>
                                            )}
                                        </Flex>
                                    </motion.div>
                                )}
                                {content === 'waiting-for-network' && (
                                    <motion.div
                                        key="waiting-for-network"
                                        initial={initialContents}
                                        animate={animateContents}
                                        exit={exitContents}
                                        transition={transition}
                                    >
                                        <Flex align="center" justify="between" gapX="2">
                                            <Text size="2">{ t('Waiting for a network connection') }</Text>
                                            <Spinner />
                                        </Flex>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Flex>
                    </ScrollArea>
                </Card>
                <GlobalInfoCallout />
            </Flex>
        </>
    );
};
