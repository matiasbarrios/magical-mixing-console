// Requirements
import { useCallback } from 'react';
import { useBusIcon, useBusIconResetAll } from '@magical-mixing/mixers-react';
import { useFallbackIcons, useFallbackIcon, FallbackIcon } from '../shared/icon';


// Exported
export const useFallbackBusIcons = () => {
    const { iconsReset } = useFallbackIcons('bus');
    const { resetAll } = useBusIconResetAll();

    const iconsResetFinal = useCallback(async () => {
        iconsReset();
        await resetAll();
    }, [iconsReset, resetAll]);

    return { iconsReset: iconsResetFinal };
};


export const useFallbackBusIcon = (busId) => {
    const deviceBusIcon = useBusIcon(busId);
    const fallbackBusIcon = useFallbackIcon('bus', busId);
    return deviceBusIcon.has ? deviceBusIcon : fallbackBusIcon;
};


export const FallbackBusIcon = ({
    busId, width, height, color, onClick, to, monochrome = false,
}) => {
    const { has, value } = useFallbackBusIcon(busId);
    return (
        <FallbackIcon
            has={has}
            value={value}
            width={width}
            height={height}
            color={color}
            monochrome={monochrome}
            onClick={onClick}
            to={to}
        />
    );
};
