// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router';
import { useSearch } from '@magical-mixing/mixers-react';
import { useHaptics } from '../../../components/global/mobile';
import { useLanguage } from '../../../components/language';
import { useDevices } from '../../../components/devices/context';
import { platformGet } from '../../../platform';
import { isValidIP, isValidPort } from '../../../helpers/values';
import { filterDuplicateLocalhostDevices } from '../../../helpers/foundDevices';
import getUdpErrorMessage from './udpError';


// Internal
const demoIp = '127.0.0.1';
const demoPort = 10024;
const demoSuggestDelay = 3 * 1000;


// Exported
export default () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
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
    const [connectError, setConnectError] = useState(null);
    const connectErrorLastRef = useRef(null);
    const [demoMessage, setDemoMessage] = useState(null);
    const demoMessageTimerRef = useRef(null);

    const stateRef = useRef({});
    useEffect(() => {
        stateRef.current = {
            searching,
            manualMode,
            connecting,
        };
    }, [searching, manualMode, connecting]);

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
            navigate('/', { replace: true });
        } catch {
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

    useEffect(() => {
        if (content === 'devices-found') hapticsTrigger();
    }, [content, hapticsTrigger]);

    const reportConnectError = useCallback((error) => {
        const message = getUdpErrorMessage(error, t);
        if (!message || connectErrorLastRef.current === message) return;
        connectErrorLastRef.current = message;
        setConnectError(message);
    }, [t]);

    useEffect(() => {
        const unlistenUdpError = platformGet().onUDPError(reportConnectError);
        return () => {
            if (unlistenUdpError) unlistenUdpError();
        };
    }, [reportConnectError]);

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') return undefined;
        window.__mmcTestUdpError = reportConnectError;
        return () => { delete window.__mmcTestUdpError; };
    }, [reportConnectError]);

    useEffect(() => {
        setConnectError(null);
        connectErrorLastRef.current = null;
    }, [content]);

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
        const message = t('Demo device should disappear soon');
        setDemoMessage(message);
        if (demoMessageTimerRef.current) clearTimeout(demoMessageTimerRef.current);
        demoMessageTimerRef.current = setTimeout(() => {
            setDemoMessage(null);
            demoMessageTimerRef.current = null;
        }, 4 * 1000);
    }, [t]);

    useEffect(() => () => {
        if (demoMessageTimerRef.current) clearTimeout(demoMessageTimerRef.current);
    }, []);

    const runDemo = useCallback(async (deviceId) => {
        setDemoRunning(true);
        await platformGet().virtualDeviceRun(deviceId, demoIp, demoPort);
        await switchToSearchMode();
    }, [switchToSearchMode]);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    return {
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
    };
};
