// Requirements
import {
    useState, useRef, useEffect,
} from 'react';
import {
    Dialog, Flex, Progress, Text,
} from '@radix-ui/themes';


// Internal
const ETA_MIN_ELAPSED_S = 1;
const ETA_FALLBACK_ITEMS_PER_S = 30;
const ETA_MIN_PERCENT = 2;
const ETA_PERCENT_CAP = 98;
const ETA_FLOOR_DIVISOR = 4;
const ETA_MAX_DROP_PER_TICK = 2;


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
