// Requirements
import { useContext, useEffect, useMemo, useState } from 'react';
import { DeviceContextRoot } from '..';
import { hasGet } from '../../helpers/feature';


// Internal
const isAssignedToBus = (source, outputId, sourceId, busId) => {
    if (sourceId === undefined) return false;
    const assigned = source.options(outputId).find(o => o.id === sourceId);
    return assigned?.type === 'bus' && assigned?.externalId === busId;
};


// Exported
export const useBusAssignableOutputs = (busId) => {
    const { features: { output: { source, options } } } = useContext(DeviceContextRoot);

    const outputs = useMemo(() => {
        if (busId === null || busId === undefined) return [];
        return options.filter((output) => {
            const sourceOptions = source.options(output.id);
            return sourceOptions.some(o => o.type === 'bus' && o.externalId === busId);
        });
    }, [busId, options, source]);

    const defaultOutputId = useMemo(() => {
        const match = outputs.find((output) => {
            const def = source.defaultOption(output.id);
            return def?.type === 'bus' && def.externalId === busId;
        });
        return match?.id ?? null;
    }, [busId, outputs, source]);

    return { outputs, defaultOutputId };
};


export const useBusAddableOutputs = (busId) => {
    const { features: { output: { source } } } = useContext(DeviceContextRoot);
    const { outputs: assignable } = useBusAssignableOutputs(busId);
    const [assignedById, setAssignedById] = useState({});

    useEffect(() => {
        if (!assignable.length) {
            setAssignedById({});
            return () => {};
        }

        const assigned = {};
        const sync = () => setAssignedById({ ...assigned });

        const unlisteners = assignable.map(output => hasGet(source,
            [output.id],
            (has) => {
                if (!has) {
                    delete assigned[output.id];
                    sync();
                }
            },
            (sourceId) => {
                if (isAssignedToBus(source, output.id, sourceId, busId)) {
                    assigned[output.id] = true;
                } else {
                    delete assigned[output.id];
                }
                sync();
            }));

        return () => unlisteners.forEach(u => u());
    }, [assignable, busId, source]);

    const outputs = useMemo(() => assignable.filter(o => !assignedById[o.id]),
        [assignable, assignedById]);

    const types = useMemo(() => [...new Set(outputs.map(o => o.type))], [outputs]);

    return { outputs, types };
};
