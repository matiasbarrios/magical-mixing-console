// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import { useBusOptions, useBusToOptions } from '@magical-mixing/mixers-react';
import { useFallbackBusesSorted } from '../../../../../../components/fallback';
import { AddTo, ResetTo, ToEmptyState, ToEvaluator, ToVisibilityReporter, ToVisibilityScope } from '../shared';
import ToRow from './row';


// Internal
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
        <Flex direction="column" gapY="3" width="100%">
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
                            <>
                                {busIdsTo.map(busIdTo => (
                                    <Evaluate
                                        key={busIdTo}
                                        busIdFrom={busId}
                                        busIdTo={busIdTo}
                                        linkDestination={linkDestination}
                                    />
                                ))}
                                <Flex align="center" justify="end" gap="1">
                                    <ResetTo busId={busId} />
                                    <AddTo busIdFrom={busId} busIdsTo={busIdsTo} />
                                </Flex>
                            </>
                        ) : (
                            <ToEmptyState busIdFrom={busId} busIdsTo={busIdsTo} />
                        )}
                    </>
                )}
            </ToVisibilityScope>
        </Flex>
    );
};
