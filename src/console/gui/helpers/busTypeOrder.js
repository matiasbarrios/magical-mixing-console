const BUS_TYPE_ORDER = ['main', 'channel', 'line', 'secondary', 'effect', 'monitor'];

const busTypeOrderIndex = (type) => {
    const index = BUS_TYPE_ORDER.indexOf(type);
    return index === -1 ? BUS_TYPE_ORDER.length : index;
};

const compareBusesByNumber = (a, b) => {
    const aNumber = parseInt(a.number, 10);
    const bNumber = parseInt(b.number, 10);
    if (Number.isNaN(aNumber) || Number.isNaN(bNumber)) {
        return a.number.localeCompare(b.number);
    }
    return aNumber - bNumber;
};

const compareBusesByTypeOrder = (a, b) => {
    const aTypeIndex = busTypeOrderIndex(a.type);
    const bTypeIndex = busTypeOrderIndex(b.type);
    if (aTypeIndex === bTypeIndex) {
        return compareBusesByNumber(a, b);
    }
    return aTypeIndex - bTypeIndex;
};

const sortBusesByTypeOrder = buses => [...buses].sort(compareBusesByTypeOrder);

// Fixed type order for chevrons; within each type, follow bus-list custom sort.
const buildBusChevronNavigationOrder = (options, sortedBuses) => {
    const buses = Array.isArray(options) ? options : [];
    const sorted = Array.isArray(sortedBuses) && sortedBuses.length
        ? sortedBuses
        : sortBusesByTypeOrder(buses);

    return BUS_TYPE_ORDER.flatMap(type => sorted.filter(bus => bus.type === type));
};

export {
    BUS_TYPE_ORDER,
    buildBusChevronNavigationOrder,
    compareBusesByTypeOrder,
    sortBusesByTypeOrder,
};
