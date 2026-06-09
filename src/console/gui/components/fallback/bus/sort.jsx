// Requirements
import { useCallback, useContext, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { compareBusesByTypeOrder, buildBusChevronNavigationOrder } from '../../../helpers/busTypeOrder';
import { FallbackContextRoot } from '../context';


// Exported
export const useFallbackBusesSorted = () => {
    const {
        sortedIds, setSortedIds, sortedBuses, setSortedBuses,
    } = useContext(FallbackContextRoot);
    const { options } = useBusOptions();

    const sort = useCallback(() => {
        const newBusesToSort = Array.isArray(options) ? [...options] : [];
        if (sortedIds.length > 0) {
            newBusesToSort.sort((a, b) => sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id));
        } else {
            newBusesToSort.sort(compareBusesByTypeOrder);
        }
        return newBusesToSort;
    }, [sortedIds, options]);

    useEffect(() => {
        setSortedBuses(sort());
    }, [setSortedBuses, sort]);

    const sortUpdate = useCallback((overId, activeId) => {
        if (overId === null || overId === activeId) return;
        let newSort = sortedBuses.map(o => o.id);
        const oldIndex = newSort.findIndex(b => b === activeId);
        const newIndex = newSort.findIndex(b => b === overId);
        newSort = arrayMove(newSort, oldIndex, newIndex);
        setSortedIds(newSort);
    }, [setSortedIds, sortedBuses]);

    const sortReset = useCallback(() => {
        setSortedIds([]);
    }, [setSortedIds]);

    // Chevrons: fixed type order; within each type, follow bus-list custom sort.
    const previousBusGet = useCallback((busId) => {
        const bs = buildBusChevronNavigationOrder(options, sortedBuses);
        const index = bs.findIndex(b => b.id === busId);
        return index > 0 ? bs[index - 1] : null;
    }, [options, sortedBuses]);

    const nextBusGet = useCallback((busId) => {
        const bs = buildBusChevronNavigationOrder(options, sortedBuses);
        const index = bs.findIndex(b => b.id === busId);
        return index < bs.length - 1 ? bs[index + 1] : null;
    }, [options, sortedBuses]);

    return {
        sortedBuses,
        sortUpdate,
        sortReset,
        previousBusGet,
        nextBusGet,
    };
};
