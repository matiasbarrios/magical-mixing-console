// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import {
    useBusFromOptions, useBusFromToReset, useBusOptions, useBusStereoLink,
    useBusToOnAndLevelAbove,
    useDevice,
} from '@magical-mixing/mixers-react';
import ResetIcon from '../../../../components/base/resetIcon';
import { useLanguage } from '../../../../components/language';
import { useFallbackBusesSorted, useFallbackDcaOptions } from '../../../../components/fallback';
import { Alert } from '../../../../components/base/alert';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import { useUiSize } from '../../../../components/theme';
import { ICON_STYLE } from '../../../../helpers/values';
import ListStack from '../../../../components/layout/list/stack';
import { BusIconNameLabeled } from '../name';
import FromRow from './fromRow';
import { DcaFrom } from './dca';
import { DropdownMenuContent } from './../../../../components/base/dropdownMenuContent';


// Internal
const FromEvaluator = ({ busIdFrom, busIdTo, children }) => {
    const { onOrLevelAbove } = useBusToOnAndLevelAbove(busIdFrom, busIdTo);
    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair, side: stereoLinkSide,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const doNotRender = useMemo(() => {
        if (stereoLinked && stereoLinkSide === 'R') return true;
        return onOrLevelAbove !== true;
    }, [onOrLevelAbove, stereoLinked, stereoLinkSide]);

    return children(doNotRender);
};


const Evaluate = ({ busIdFrom, busIdTo }) => (
    <FromEvaluator busIdFrom={busIdFrom} busIdTo={busIdTo}>
        {doNotRender => (doNotRender ? null : (
            <FromRow
                busIdFrom={busIdFrom}
                busIdTo={busIdTo}
            />
        ))}
    </FromEvaluator>
);


const FromAddOption = ({ busIdFrom, busIdTo }) => {
    const { canEnableOnOrLevelAbove, enableOnOrLevelAbove } = useBusToOnAndLevelAbove(busIdFrom,
        busIdTo);

    const onSelect = useCallback(() => {
        enableOnOrLevelAbove();
    }, [enableOnOrLevelAbove]);

    if (!canEnableOnOrLevelAbove) return null;

    return (
        <DropdownMenu.Item onSelect={onSelect}>
            <BusIconNameLabeled busId={busIdFrom} size="2" />
        </DropdownMenu.Item>
    );
};


const AddFrom = ({ busIdTo, busIdsFrom }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    if (!busIdsFrom.length) return null;

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger size={textSize} variant="soft" color="gray" onClick={toggleOpened}>
                <PlusIcon style={ICON_STYLE} />
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Add') }</DropdownMenu.Label>
                {busIdsFrom.map(busIdFrom => (
                    <FromAddOption
                        key={busIdFrom}
                        busIdFrom={busIdFrom}
                        busIdTo={busIdTo}
                    />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const ResetFrom = ({ busIdTo }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useBusFromToReset(busIdTo, 'from');

    return (
        <Alert
            onAccept={reset}
            accept={t('Reset')}
            title={t('Reset all receptions?')}
            description={t('Resets levels, pan and tap for all sends into this bus to default. This cannot be undone.')}
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


const FromContents = ({ busIdTo }) => {
    const { options: busesFrom } = useBusFromOptions(busIdTo);
    const { sortedBuses } = useFallbackBusesSorted();
    const { get } = useBusOptions();
    const { options: dcaOptions } = useFallbackDcaOptions();

    const busTo = useMemo(() => get(busIdTo), [busIdTo, get]);
    const isMonitor = useMemo(() => busTo?.type === 'monitor', [busTo]);

    const busIdsFrom = useMemo(() => sortedBuses
        .filter(s => busesFrom.some(b => b.id === s.id))
        .map(s => s.id), [sortedBuses, busesFrom]);

    const hasBusFrom = busIdsFrom.length > 0;
    const hasDcaFrom = isMonitor && dcaOptions.length > 0;
    if (!hasBusFrom && !hasDcaFrom) return null;

    return (
        <Flex direction="column" gapY="3" width="100%">
            <ListStack>
                {busIdsFrom.map(busIdFrom => (
                    <Evaluate
                        key={busIdFrom}
                        busIdFrom={busIdFrom}
                        busIdTo={busIdTo}
                    />
                ))}
                {hasDcaFrom && dcaOptions.map(o => (
                    <DcaFrom key={`dca-${o.id}`} dcaId={o.id} />
                ))}
            </ListStack>
            {hasBusFrom && (
                <Flex align="center" justify="end" gap="1">
                    <ResetFrom busIdTo={busIdTo} />
                    <AddFrom busIdTo={busIdTo} busIdsFrom={busIdsFrom} />
                </Flex>
            )}
        </Flex>
    );
};


// Exported
export default ({ busId }) => (
    <FromContents busIdTo={busId} />
);
