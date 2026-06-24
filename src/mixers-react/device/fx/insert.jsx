// Requirements
import { useContext } from 'react';
import { DeviceContext } from '..';
import { useHasGetSet } from '../../helpers/hasGetSet';
import { useHas } from '../../helpers/has';
import { useOptions } from '../../helpers/options';


// Exported
export const useFxInsertHas = (fxId) => {
    const { features: { fx: { insert } } } = useContext(DeviceContext);

    const has = useHas(insert, fxId);

    return { has };
};


export const useFxInsertOn = (fxId) => {
    const { features: { fx: { insert: { on } } } } = useContext(DeviceContext);

    const [has, value, set, toggle] = useHasGetSet(on, fxId);

    return {
        has, value, set, toggle,
    };
};


export const useFxInsertLeft = (fxId) => {
    const { features: { fx: { insert: { left } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(left, fxId);

    const options = useOptions(left, fxId);

    return {
        has, value, set, options,
    };
};


export const useFxInsertRight = (fxId) => {
    const { features: { fx: { insert: { right } } } } = useContext(DeviceContext);

    const [has, value, set] = useHasGetSet(right, fxId);

    const options = useOptions(right, fxId);

    return {
        has, value, set, options,
    };
};
