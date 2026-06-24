// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useOptions } from '../../helpers/options';
import { useHas } from '../../helpers/has';
import { useHasGetSet } from '../../helpers/hasGetSet';


// Exported
export const useFxParameters = (fxId, typeId) => {
    const { features: { fx: { parameters } } } = useContext(DeviceContext);

    const has = useHas(parameters, [fxId, typeId]);

    const options = useOptions(parameters, [fxId, typeId]);

    return { has, options };
};


export const useFxParametersParameter = (fxId, typeId, parameterId) => {
    const { features: { fx: { parameters: { parameter } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(parameter, [fxId, typeId, parameterId]);

    return { has, value, set };
};
