// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import {
    useBusFromOptions, useBusOptions,
} from '@magical-mixing/mixers-react';
import { useFallbackBusesSorted, useFallbackDcaOptions } from '../../../../../../components/fallback';
import { DcaFrom } from '../dca';
import { AddFrom, FromEmptyState, FromEvaluator, FromVisibilityReporter, FromVisibilityScope, ResetFrom } from '../shared';
import FromRow from './row';


// Internal
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
        <Flex direction="column" gapY="3" width="100%">
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
                                <>
                                    {busIdsFrom.map(busIdFrom => (
                                        <Evaluate
                                            key={busIdFrom}
                                            busIdFrom={busIdFrom}
                                            busIdTo={busId}
                                        />
                                    ))}
                                    <Flex align="center" justify="end" gap="1">
                                        <ResetFrom busIdTo={busId} />
                                        <AddFrom busIdTo={busId} busIdsFrom={busIdsFrom} />
                                    </Flex>
                                </>
                            ) : (
                                <FromEmptyState busIdTo={busId} busIdsFrom={busIdsFrom} />
                            )}
                        </>
                    )}
                </FromVisibilityScope>
            )}
            {hasDcaFrom && dcaOptions.map(o => (
                <DcaFrom key={`dca-${o.id}`} dcaId={o.id} />
            ))}
        </Flex>
    );
};
