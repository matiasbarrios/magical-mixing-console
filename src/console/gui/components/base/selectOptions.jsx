// Requirements
import {
    useCallback, useEffect, useMemo, useState,
} from 'react';


// Exported
export const useSelectOptions = ({
    has, value, set, options,
}) => {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!options.some(o => o.id === value)) {
            setSelected(null);
        } else {
            setSelected([null, undefined].includes(value) ? value : parseInt(value, 10));
        }
    }, [options, value]);

    const selectedOption = useMemo(() => (value !== null
        ? options.find(o => o.id === value)
        : null), [options, value]);

    const onChange = useCallback((v) => {
        set(v !== null ? parseInt(v, 10) : null);
    }, [set]);

    const nullOptions = useMemo(() => (has ? options
        .filter(o => o.id === null) : []), [has, options]);

    const otherOptions = useMemo(() => (has ? options
        .filter(o => o.id !== null) : []), [has, options]);

    const hideOptions = useMemo(() => otherOptions.length === 1
        && otherOptions[0].id === value, [otherOptions, value]);

    return {
        selected,
        selectedOption,
        onChange,
        nullOptions,
        otherOptions,
        hideOptions,
    };
};
