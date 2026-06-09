// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import {
    useBusFromToReset, useBusOptions, useBusStereoLink, useBusToOnAndLevelAbove,
    useBusToOptions,
    useDevice,
} from '@magical-mixing/mixers-react';
import ResetIcon from '../../../../components/base/resetIcon';
import { useLanguage } from '../../../../components/language';
import { useFallbackBusesSorted } from '../../../../components/fallback';
import { Alert } from '../../../../components/base/alert';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import { useUiSize } from '../../../../components/theme';
import { ICON_STYLE } from '../../../../helpers/values';
import ListStack from '../../../../components/layout/list/stack';
import { BusIconNameLabeled } from '../name';
import ToRow from './toRow';
import { DropdownMenuContent } from './../../../../components/base/dropdownMenuContent';


// Internal
const ToEvaluator = ({ busIdFrom, busIdTo, children }) => {
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


const Evaluate = ({ busIdFrom, busIdTo, linkDestination }) => (
    <ToEvaluator busIdFrom={busIdFrom} busIdTo={busIdTo}>
        {doNotRender => (doNotRender ? null : (
            <ToRow
                busIdFrom={busIdFrom}
                busIdTo={busIdTo}
                linkDestination={linkDestination}
            />
        ))}
    </ToEvaluator>
);


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


const AddTo = ({ busIdFrom, busIdsTo }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    if (!busIdsTo.length) return null;

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger size={textSize} variant="soft" color="gray" onClick={toggleOpened}>
                <PlusIcon style={ICON_STYLE} />
            </DropdownMenuTrigger>
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


const ResetTo = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useBusFromToReset(busId, 'to');

    const onReset = useCallback(async () => {
        await reset();
    }, [reset]);

    return (
        <Alert
            onAccept={onReset}
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
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


const ToContents = ({ busId, linkDestination }) => {
    const { soloOne } = useBusOptions();
    const { options: busesTo } = useBusToOptions(busId);
    const { sortedBuses } = useFallbackBusesSorted();

    const busIdsTo = useMemo(() => sortedBuses
        .filter(s => busesTo.some(b => b.id === s.id))
        .filter(s => s.id !== soloOne.id)
        .map(s => s.id), [sortedBuses, busesTo, soloOne]);

    if (!busIdsTo.length) return null;

    return (
        <Flex direction="column" gapY="3" width="100%">
            <ListStack>
                {busIdsTo.map(busIdTo => (
                    <Evaluate
                        key={busIdTo}
                        busIdFrom={busId}
                        busIdTo={busIdTo}
                        linkDestination={linkDestination}
                    />
                ))}
            </ListStack>
            <Flex align="center" justify="end" gap="1">
                <ResetTo busId={busId} />
                <AddTo busIdFrom={busId} busIdsTo={busIdsTo} />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busId, linkDestination }) => (
    <ToContents busId={busId} linkDestination={linkDestination} />
);
