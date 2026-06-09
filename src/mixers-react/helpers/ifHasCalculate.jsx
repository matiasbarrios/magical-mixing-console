// Requirements
import { useEffect, useState } from 'react';
import { hasOnly } from './feature';
import { useStableIds } from './stableIds';


// Exported
export const useIfHasCalculate = (feature, subFeature, ids, defaultValue) => {
    const idsArray = useStableIds(ids);

    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue);
        if (!feature.has) return () => {};

        let active = true;
        let lastHas;

        const unlistenHas = hasOnly(feature, idsArray, (has) => {
            if (!active) return;

            if (has === lastHas) return;
            lastHas = has;

            if (!has) {
                setValue(defaultValue);
                return;
            }
            const v = feature[subFeature](...idsArray);
            setValue((v !== undefined) ? v : defaultValue);
        });

        return () => {
            active = false;
            if (unlistenHas) unlistenHas();
        };
    }, [idsArray, feature, subFeature, defaultValue]);

    return value;
};
