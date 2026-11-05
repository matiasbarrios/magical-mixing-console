// Sidechain source ids: 0 is Self, 1–16 are Channel 1–16, 17–22 are Secondary 1–6.
const SEND_PARAMS = ['on', 'level', 'pan', 'tap'];


// Exported
export const sidechainSourceId = (busOption) => {
    if (!busOption?.number) return null;
    const number = Number(busOption.number);
    if (!Number.isInteger(number)) return null;
    if (busOption.type === 'channel' && number >= 1 && number <= 16) return number;
    if (busOption.type === 'secondary' && number >= 1 && number <= 6) return 16 + number;
    return null;
};


export const rewriteBusPath = (path, fromId, toId) => {
    const match = path.match(/\((\d+)\)/);
    if (!match || Number(match[1]) !== fromId) return null;
    const index = match.index;
    return `${path.slice(0, index)}(${toId})${path.slice(index + match[0].length)}`;
};


// Incoming sends store the destination bus as the second id: bus.to(sender).level(aux).
export const rewriteSendDestination = (path, fromId, toId) => {
    const match = path.match(/^bus\.to\((\d+)\)\.(on|level|pan|tap)\((\d+)\)$/);
    if (!match || Number(match[3]) !== fromId) return null;
    return `bus.to(${match[1]}).${match[2]}(${toId})`;
};


export const remapSidechainSource = (path, value, fromSidechainId, toSidechainId) => {
    if (!path.endsWith('.sidechain.source')) return value;
    if (typeof value !== 'number') return value;
    if (typeof fromSidechainId !== 'number' || typeof toSidechainId !== 'number') return value;
    if (value !== fromSidechainId) return value;
    return toSidechainId;
};


export const busMoveChanges = (captured, fromId, toId, sidechainIds = {}) => {
    const fromSidechainId = Object.hasOwn(sidechainIds, 'from') ? sidechainIds.from : fromId + 1;
    const toSidechainId = Object.hasOwn(sidechainIds, 'to') ? sidechainIds.to : toId + 1;
    const changes = [];
    captured.forEach(([path, value]) => {
        const nextPath = rewriteBusPath(path, fromId, toId);
        if (!nextPath) return;
        changes.push([
            nextPath,
            remapSidechainSource(nextPath, value, fromSidechainId, toSidechainId),
        ]);
    });
    return changes;
};


export const receptionPaths = (busOptions, busId, skipIds) => {
    const paths = [];
    busOptions.forEach(({ id }) => {
        if (skipIds.has(id)) return;
        SEND_PARAMS.forEach((param) => {
            paths.push(`bus.to(${id}).${param}(${busId})`);
        });
    });
    return paths;
};


export const sidechainFollowPaths = (busOptions, skipIds) => {
    const paths = [];
    busOptions.forEach(({ id }) => {
        if (skipIds.has(id)) return;
        paths.push(`bus.compressor(${id}).sidechain.source`);
        paths.push(`bus.gate(${id}).sidechain.source`);
    });
    return paths;
};


export const receptionMoveChanges = (captured, fromId, toId) => {
    const changes = [];
    captured.forEach(([path, value]) => {
        const nextPath = rewriteSendDestination(path, fromId, toId);
        if (!nextPath) return;
        changes.push([nextPath, value]);
    });
    return changes;
};


export const sidechainFollowChanges = (captured, fromSidechainId, toSidechainId) => {
    const changes = [];
    captured.forEach(([path, value]) => {
        const next = remapSidechainSource(path, value, fromSidechainId, toSidechainId);
        if (next === value) return;
        changes.push([path, next]);
    });
    return changes;
};
