// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import {
    useBusFromOptions, useBusOptions,
} from '@magical-mixing/mixers-react';
import { useFallbackBusesSorted, useFallbackDcaOptions } from '../../../../../../components/fallback';
import ConditionalScrollX from '../../../../../../components/base/conditionalScrollX';
import ListStack from '../../../../../../components/layout/list/stack';
import { DcaFrom } from '../dca';
import { AddFrom, FromEmptyState, FromEvaluator, FromVisibilityReporter, FromVisibilityScope, ResetFrom } from '../shared';
import Column from './column';


// Internal
const EvaluateColumn = ({ busIdFrom, busIdTo }) => (
    <FromEvaluator busIdFrom={busIdFrom} busIdTo={busIdTo}>
        {doNotRender => (doNotRender ? null : (
            <Column
                busIdFrom={busIdFrom}
                busIdTo={busIdTo}
            />
        ))}
    </FromEvaluator>
);


const FromStripActions = ({ busIdTo, busIdsFrom }) => (
    <Flex
        direction="column"
        align="center"
        justify="center"
        gap="1"
        flexShrink="0"
        height="100%"
        px="2"
    >
        <ResetFrom busIdTo={busIdTo} />
        <AddFrom busIdTo={busIdTo} busIdsFrom={busIdsFrom} />
    </Flex>
);


// Exported
export default ({ busId }) => {
    const { options: busesFrom } = useBusFromOptions(busId);
    const { sortedBuses } = useFallbackBusesSorted();
    const { get } = useBusOptions();
    const { options: dcaOptions } = useFallbackDcaOptions();

    const busTo = useMemo(() => get(busId), [busId, get]);
    const isMonitor = useMemo(() => busTo?.type === 'monitor', [busTo]);

    const busIdsFrom = useMemo(() => sortedBuses
        .filter(s => busesFrom.some(b => b.id === s.id))
        .map(s => s.id), [sortedBuses, busesFrom]);

    const hasBusFrom = busIdsFrom.length > 0;
    const hasDcaFrom = isMonitor && dcaOptions.length > 0;
    if (!hasBusFrom && !hasDcaFrom) return null;

    return (
        <Flex direction="column" flexGrow="1" minHeight="0" height="100%" gapY="3">
            {hasBusFrom && (
                <FromVisibilityScope>
                    {hasVisible => (
                        <>
                            {busIdsFrom.map(busIdFrom => (
                                <FromVisibilityReporter
                                    key={busIdFrom}
                                    busIdFrom={busIdFrom}
                                    busIdTo={busId}
                                />
                            ))}
                            {hasVisible ? (
                                <Flex position="relative" flexGrow="1" minHeight="0" width="100%">
                                    <ConditionalScrollX>
                                        <Flex
                                            gapX="1"
                                            height="100%"
                                            width="max-content"
                                            align="stretch"
                                        >
                                            {busIdsFrom.map(busIdFrom => (
                                                <EvaluateColumn
                                                    key={busIdFrom}
                                                    busIdFrom={busIdFrom}
                                                    busIdTo={busId}
                                                />
                                            ))}
                                            <FromStripActions busIdTo={busId} busIdsFrom={busIdsFrom} />
                                        </Flex>
                                    </ConditionalScrollX>
                                </Flex>
                            ) : (
                                <FromEmptyState busIdTo={busId} busIdsFrom={busIdsFrom} />
                            )}
                        </>
                    )}
                </FromVisibilityScope>
            )}
            {hasDcaFrom && (
                <ListStack>
                    {dcaOptions.map(o => (
                        <DcaFrom key={`dca-${o.id}`} dcaId={o.id} />
                    ))}
                </ListStack>
            )}
        </Flex>
    );
};
