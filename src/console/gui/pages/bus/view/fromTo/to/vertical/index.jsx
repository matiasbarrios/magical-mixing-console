// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useBusOptions, useBusToOptions } from '@magical-mixing/mixers-react';
import { useFallbackBusesSorted } from '../../../../../../components/fallback';
import ConditionalScrollX from '../../../../../../components/base/conditionalScrollX';
import { AddTo, ResetTo, ToEmptyState, ToEvaluator, ToVisibilityReporter, ToVisibilityScope } from '../shared';
import Column from './column';


// Internal
const EvaluateColumn = ({ busIdFrom, busIdTo, linkDestination }) => (
    <ToEvaluator busIdFrom={busIdFrom} busIdTo={busIdTo}>
        {doNotRender => (doNotRender ? null : (
            <Column
                busIdFrom={busIdFrom}
                busIdTo={busIdTo}
                linkDestination={linkDestination}
            />
        ))}
    </ToEvaluator>
);


const ToStripActions = ({ busIdFrom, busIdsTo }) => (
    <Flex
        direction="column"
        align="center"
        justify="center"
        gap="1"
        flexShrink="0"
        height="100%"
        px="2"
    >
        <ResetTo busId={busIdFrom} />
        <AddTo busIdFrom={busIdFrom} busIdsTo={busIdsTo} />
    </Flex>
);


// Exported
export default ({ busId, linkDestination }) => {
    const { soloOne } = useBusOptions();
    const { options: busesTo } = useBusToOptions(busId);
    const { sortedBuses } = useFallbackBusesSorted();

    const busIdsTo = useMemo(() => sortedBuses
        .filter(s => busesTo.some(b => b.id === s.id))
        .filter(s => s.id !== soloOne.id)
        .map(s => s.id), [sortedBuses, busesTo, soloOne]);

    if (!busIdsTo.length) return null;

    return (
        <Flex direction="column" flexGrow="1" minHeight="0" height="100%" gapY="3">
            <ToVisibilityScope>
                {hasVisible => (
                    <>
                        {busIdsTo.map(busIdTo => (
                            <ToVisibilityReporter
                                key={busIdTo}
                                busIdFrom={busId}
                                busIdTo={busIdTo}
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
                                        {busIdsTo.map(busIdTo => (
                                            <EvaluateColumn
                                                key={busIdTo}
                                                busIdFrom={busId}
                                                busIdTo={busIdTo}
                                                linkDestination={linkDestination}
                                            />
                                        ))}
                                        <ToStripActions busIdFrom={busId} busIdsTo={busIdsTo} />
                                    </Flex>
                                </ConditionalScrollX>
                            </Flex>
                        ) : (
                            <ToEmptyState busIdFrom={busId} busIdsTo={busIdsTo} />
                        )}
                    </>
                )}
            </ToVisibilityScope>
        </Flex>
    );
};
