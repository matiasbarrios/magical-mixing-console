// Requirements
import {
    createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import {
    DropdownMenu, Flex, IconButton, Text,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import {
    useBusFromToReset, useBusStereoLink, useBusToOnAndLevelAbove, useDevice,
} from '@magical-mixing/mixers-react';
import { ADD_ROAM_ID, RESET_ROAM_ID, focusRoamAttrs } from '../../../../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../../../../components/base/resetIcon';
import { useLanguage } from '../../../../../components/language';
import { Alert } from '../../../../../components/base/alert';
import { DropdownMenuTrigger } from '../../../../../components/base/dropdownMenuTrigger';
import { useUiSize } from '../../../../../components/theme';
import { ICON_STYLE } from '../../../../../helpers/values';
import { BusIconNameLabeled } from '../../name';
import { DropdownMenuContent } from '../../../../../components/base/dropdownMenuContent';


// Internal
const ToVisibilityContext = createContext(null);


const ReportVisible = ({ id, visible }) => {
    const ctx = useContext(ToVisibilityContext);

    useLayoutEffect(() => {
        if (!ctx) return undefined;
        ctx.setVisible(id, visible);
        return () => ctx.remove(id);
    }, [ctx, id, visible]);

    return null;
};


const ToAddOption = ({ busIdFrom, busIdTo }) => {
    const { canEnableOnOrLevelAbove, enableOnOrLevelAbove } = useBusToOnAndLevelAbove(busIdFrom,
        busIdTo);

    const onSelect = useCallback(() => {
        enableOnOrLevelAbove();
    }, [enableOnOrLevelAbove]);

    if (!canEnableOnOrLevelAbove) return null;

    return (
        <DropdownMenu.Item onSelect={onSelect}>
            <BusIconNameLabeled busId={busIdTo} size="2" />
        </DropdownMenu.Item>
    );
};


// Exported
export const ToVisibilityScope = ({ children }) => {
    const visibleRef = useRef(new Map());
    const [, setVersion] = useState(0);

    const api = useMemo(() => ({
        setVisible: (id, visible) => {
            const prev = visibleRef.current.get(id);
            visibleRef.current.set(id, visible);
            if (prev !== visible) setVersion(v => v + 1);
        },
        remove: (id) => {
            if (visibleRef.current.has(id)) {
                visibleRef.current.delete(id);
                setVersion(v => v + 1);
            }
        },
    }), []);

    let hasVisible = false;
    visibleRef.current.forEach((visible) => {
        if (visible) hasVisible = true;
    });

    return (
        <ToVisibilityContext.Provider value={api}>
            {children(hasVisible)}
        </ToVisibilityContext.Provider>
    );
};


export const ToEvaluator = ({ busIdFrom, busIdTo, children }) => {
    const { onOrLevelAbove } = useBusToOnAndLevelAbove(busIdFrom, busIdTo);
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair, side: stereoLinkSide,
    } = useBusStereoLink(busIdTo);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const doNotRender = useMemo(() => {
        if (stereoLinked && stereoLinkSide === 'R') return true;
        return onOrLevelAbove !== true;
    }, [onOrLevelAbove, stereoLinked, stereoLinkSide]);

    return children(doNotRender);
};


export const ToVisibilityReporter = ({ busIdFrom, busIdTo }) => (
    <ToEvaluator busIdFrom={busIdFrom} busIdTo={busIdTo}>
        {doNotRender => (
            <ReportVisible id={busIdTo} visible={!doNotRender} />
        )}
    </ToEvaluator>
);


export const AddTo = ({ busIdFrom, busIdsTo, trigger = 'icon' }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    if (!busIdsTo.length) return null;

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            {trigger === 'button' ? (
                <DropdownMenuTrigger
                    square
                    size={textSize}
                    variant="soft"
                    color="blue"
                    onClick={toggleOpened}
                    {...focusRoamAttrs(ADD_ROAM_ID)}
                >
                    { t('Send now') }
                </DropdownMenuTrigger>
            ) : (
                <DropdownMenuTrigger
                    size={textSize}
                    variant="soft"
                    color="gray"
                    onClick={toggleOpened}
                    {...focusRoamAttrs(ADD_ROAM_ID)}
                >
                    <PlusIcon style={ICON_STYLE} />
                </DropdownMenuTrigger>
            )}
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Add') }</DropdownMenu.Label>
                {busIdsTo.map(busIdTo => (
                    <ToAddOption
                        key={busIdTo}
                        busIdFrom={busIdFrom}
                        busIdTo={busIdTo}
                    />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


export const ToEmptyState = ({ busIdFrom, busIdsTo }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    return (
        <Flex flexGrow="1" align="center" justify="center" width="100%" minHeight="0">
            <Flex direction="column" align="center" gap="3" p="1">
                <Text size={textSize} color="gray" align="center">
                    { t('Nothing is being sent from this bus yet') }
                </Text>
                <AddTo busIdFrom={busIdFrom} busIdsTo={busIdsTo} trigger="button" />
            </Flex>
        </Flex>
    );
};


export const ResetTo = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useBusFromToReset(busId, 'to');

    return (
        <Alert
            onAccept={reset}
            accept={t('Reset')}
            title={t('Reset all sends?')}
            description={t('Resets levels, pan and tap for all sends from this bus to default. This cannot be undone.')}
        >
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Reset')}
                    {...focusRoamAttrs(RESET_ROAM_ID)}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};
