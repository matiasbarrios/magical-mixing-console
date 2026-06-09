// Requirements
import { useContext, useMemo } from 'react';
import { DeviceContextRoot } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useConfigurationOptions = () => {
    const { features: { configuration: { categories, options } } } = useContext(DeviceContextRoot);

    return { categories, options };
};


export const useConfigurationOption = (optionId) => {
    const { features: { configuration } } = useContext(DeviceContextRoot);

    const { options: configurationOptions } = useConfigurationOptions();
    const o = useMemo(() => configurationOptions
        .find(c => c.optionId === optionId), [configurationOptions, optionId]);
    const option = useMemo(() => configuration[o.categoryId][o
        .categoryOptionId], [o, configuration]);

    const [has, value, set] = useHasGetSet(option);

    const name = useMemo(() => option?.name, [option]);
    const type = useMemo(() => option?.type, [option]);
    const minLength = useMemo(() => option?.minLength, [option]);
    const maxLength = useMemo(() => option?.maxLength, [option]);
    const options = useMemo(() => option?.options, [option]);
    const hideIf = useMemo(() => option?.hideIf, [option]);
    const isValid = useMemo(() => option?.isValid, [option]);

    return {
        has, value, set, name, type, minLength, maxLength, options, hideIf, isValid,
    };
};
