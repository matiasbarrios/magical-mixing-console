// Requirements
import {
    createContext, useState, useMemo, useContext, useCallback, useRef, useEffect,
} from 'react';
import {
    Callout, Box, Dialog, Flex, Progress, Text,
    Button,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'motion/react';
import { useChanges } from '@magical-mixing/mixers-react';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';
import { useHaptics } from './mobile';


// Constants
const globalErrorStyle = {
    position: 'fixed',
    bottom: 'var(--mmc-safe-bottom)',
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1,
};


// Variables
const Context = createContext({});


// Internal
const ETA_MIN_ELAPSED_S = 1;
const ETA_FALLBACK_ITEMS_PER_S = 30;
const ETA_MIN_PERCENT = 2;
const ETA_PERCENT_CAP = 98;
const ETA_FLOOR_DIVISOR = 4;
const ETA_MAX_DROP_PER_TICK = 2;

// Bulk applies (device reset, bus reset, scene load) schedule dozens or hundreds of
// changes; presets and parametric resets stay below this and skip the dialog.
const CHANGES_PROGRESS_THRESHOLD = 50;


const estimateSecondsRemaining = (startTime, total, completed) => {
    if (!startTime || total <= 0) return null;

    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed < ETA_MIN_ELAPSED_S) return null;

    const percent = Math.min(ETA_PERCENT_CAP, (completed / total) * 100);
    const percentRemaining = 100 - percent;

    const floor = Math.max(1, Math.ceil(percentRemaining / ETA_FLOOR_DIVISOR));

    let projected;
    if (percent < ETA_MIN_PERCENT) {
        projected = Math.round(total / ETA_FALLBACK_ITEMS_PER_S);
    } else {
        projected = Math.round((elapsed / percent) * percentRemaining);
    }

    return Math.max(floor, projected);
};


export const useProgressEta = ({ open, total, completed, paused }) => {
    const startTime = useRef(null);
    const wasOpen = useRef(false);
    const [secondsRemaining, setSecondsRemaining] = useState(null);

    useEffect(() => {
        if (!open) {
            startTime.current = null;
            wasOpen.current = false;
            setSecondsRemaining(null);
            return undefined;
        }

        if (!wasOpen.current) {
            wasOpen.current = true;
            startTime.current = Date.now();
        }

        if (paused || total <= 0) {
            setSecondsRemaining(null);
            return undefined;
        }

        const update = () => {
            const next = estimateSecondsRemaining(startTime.current, total, completed);
            if (next === null) return;

            setSecondsRemaining((prev) => {
                if (prev === null) return next;
                if (next < prev) {
                    return Math.max(next, prev - ETA_MAX_DROP_PER_TICK);
                }
                return prev;
            });
        };

        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [open, total, completed, paused]);

    return secondsRemaining;
};


// Exported
export const GlobalCalloutContext = ({ children }) => {
    const [globalError, setGlobalError] = useState(null);
    const [globalInfo, setGlobalInfo] = useState(null);

    const state = useMemo(() => ({
        globalError, setGlobalError, globalInfo, setGlobalInfo,
    }), [globalError, setGlobalError, globalInfo, setGlobalInfo]);

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
};


export const useGlobalError = () => {
    const { globalError, setGlobalError } = useContext(Context);

    const { hapticsTrigger } = useHaptics();

    const globalErrorEdit = useCallback((message) => {
        setGlobalError(message.toString());
        if (message) {
            setTimeout(async () => { await hapticsTrigger(); }, 1);
        }
    }, [setGlobalError, hapticsTrigger]);

    return {
        globalError,
        globalErrorEdit,
    };
};


export const useGlobalInfo = () => {
    const { globalInfo, setGlobalInfo } = useContext(Context);

    const globalInfoEdit = useCallback((message, duration = 3 * 1000) => {
        setGlobalInfo(message.toString());
        if (duration) {
            setTimeout(() => { setGlobalInfo(null); }, duration);
        }
    }, [setGlobalInfo]);

    return {
        globalInfo,
        globalInfoEdit,
    };
};


export const GlobalErrorCallout = () => {
    const { globalError, globalErrorEdit } = useGlobalError();
    const clearGlobalError = useCallback(() => { globalErrorEdit(''); }, [globalErrorEdit]);
    return (
        <AnimatePresence mode="wait">
            {!!globalError && (
                <motion.div
                    key="globalError"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Box style={globalErrorStyle} p="4">
                        <Callout.Root color="red" onClick={clearGlobalError}>
                            <Callout.Icon>
                                <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                {globalError}
                            </Callout.Text>
                        </Callout.Root>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export const GlobalInfoCallout = () => {
    const { textSize } = useUiSize();
    const { globalInfo, globalInfoEdit } = useGlobalInfo();
    const clearGlobalInfo = useCallback(() => { globalInfoEdit(''); }, [globalInfoEdit]);
    return (
        <AnimatePresence mode="wait">
            {!!globalInfo && (
                <motion.div
                    key="globalInfo"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button onClick={clearGlobalInfo} variant="ghost" color="indigo">
                        <Flex align="center" justify="center" gapX="2">
                            <InfoCircledIcon />
                            <Text size={textSize}>
                                {globalInfo}
                            </Text>
                        </Flex>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export const useChangesApplyProgress = ({ threshold = CHANGES_PROGRESS_THRESHOLD } = {}) => {
    const {
        changesRemaining, changesTotal, batchTotal, syncPending, awaitingDesk,
    } = useChanges();

    const changesDone = batchTotal - changesRemaining;
    const total = batchTotal + syncPending;
    const completed = changesDone;
    const open = batchTotal >= threshold && (
        changesTotal > 0 || awaitingDesk || syncPending > 0
    );

    return {
        open,
        total,
        completed,
    };
};


export const formatProgressEta = seconds => `${seconds}s`;


export const ApplyProgressContent = ({
    title, total, completed, textSize, status,
}) => {
    const percent = total > 0
        ? Math.min(100, Math.round((completed / total) * 100))
        : null;

    return (
        <Flex direction="column" gap="3" py={title ? '4' : '0'}>
            {title && (
                <Text size={textSize} weight="medium" align="center">
                    {title}
                </Text>
            )}
            <Progress
                value={percent}
                max={100}
                size="3"
                aria-label={title || undefined}
            />
            {percent !== null && (
                <Text size={textSize} color="gray" weight="medium" align="center">
                    {`${percent}%`}
                </Text>
            )}
            {status && (
                <Text size="1" color="gray" align="center">
                    {status}
                </Text>
            )}
        </Flex>
    );
};


export const ApplyProgressDialog = ({
    open, title, total, completed, textSize, status, eta,
}) => {
    if (!open) return null;

    return (
        <Dialog.Root open>
            <Dialog.Content aria-describedby={undefined}>
                <Flex align="center" justify="between" gap="2" width="100%" mb="4">
                    <Flex align="center" gap="1" minWidth="0" wrap="nowrap" flexGrow="1">
                        <Dialog.Title mb="0" size={textSize} trim="both">
                            {title}
                        </Dialog.Title>
                    </Flex>
                    {eta && (
                        <Flex flexShrink="0">
                            <Text size={textSize} color="gray">
                                {eta}
                            </Text>
                        </Flex>
                    )}
                </Flex>
                <ApplyProgressContent
                    total={total}
                    completed={completed}
                    textSize={textSize}
                    status={status}
                />
            </Dialog.Content>
        </Dialog.Root>
    );
};


export const ChangesCallout = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { open, total, completed } = useChangesApplyProgress();
    const secondsRemaining = useProgressEta({ open, total, completed });
    const eta = secondsRemaining !== null ? formatProgressEta(secondsRemaining) : undefined;

    return (
        <ApplyProgressDialog
            open={open}
            title={t('Applying changes')}
            total={total}
            completed={completed}
            eta={eta}
            textSize={textSize}
        />
    );
};
