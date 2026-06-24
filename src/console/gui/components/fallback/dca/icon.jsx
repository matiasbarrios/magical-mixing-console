// Requirements
import { useCallback, useContext } from 'react';
import { useDcaIcon, useDcaIconResetAll } from '@magical-mixing/mixers-react';
import {
    useFallbackIcons, useFallbackIcon, FallbackIcon, iconOptions,
} from '../shared/icon';
import { FallbackContext } from '../context';


// Internal
const FallbackIconUse = ({ dcaId, children }) => {
    const {
        has, value, set, options,
    } = useFallbackIcon('dca', dcaId);
    return children({
        has, value, set, options,
    });
};


const DeviceIconUse = ({ dcaId, children }) => {
    const { has, value, set } = useDcaIcon(dcaId);
    if (!has) return <FallbackIconUse dcaId={dcaId}>{children}</FallbackIconUse>;
    return children({
        has, value, set, options: iconOptions,
    });
};


export const useFallbackDcaIcon = (dcaId) => {
    const { dcaOptions } = useContext(FallbackContext);
    const deviceIcon = useDcaIcon(dcaId);
    const fallbackIcon = useFallbackIcon('dca', dcaId);

    const isVirtual = dcaOptions?.find(o => o.id === dcaId);
    if (isVirtual) return fallbackIcon;
    if (deviceIcon.has) return { ...deviceIcon, options: iconOptions };
    return fallbackIcon;
};


// Exported
export const useFallbackDcaIcons = () => {
    const { iconsReset } = useFallbackIcons('dca');
    const { resetAll } = useDcaIconResetAll();

    const iconsResetFinal = useCallback(async () => {
        iconsReset();
        await resetAll();
    }, [iconsReset, resetAll]);

    return { iconsReset: iconsResetFinal };
};


export const FallbackDcaIconUse = ({ dcaId, children }) => {
    const { dcaOptions } = useContext(FallbackContext);
    if (!dcaOptions
        .find(o => o.id === dcaId)) return <DeviceIconUse dcaId={dcaId}>{children}</DeviceIconUse>;
    return <FallbackIconUse dcaId={dcaId}>{children}</FallbackIconUse>;
};


export const FallbackDcaIcon = ({
    dcaId, width, height, color, onClick, to,
}) => (
    <FallbackDcaIconUse dcaId={dcaId}>
        {({ has, value }) => (
            <FallbackIcon
                has={has}
                value={value}
                width={width}
                height={height}
                color={color}
                onClick={onClick}
                to={to}
            />
        )}
    </FallbackDcaIconUse>
);
