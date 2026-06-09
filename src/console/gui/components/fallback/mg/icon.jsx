// Requirements
import { useCallback, useContext } from 'react';
import { useMgIcon, useMgIconResetAll } from '@magical-mixing/mixers-react';
import {
    useFallbackIcons, useFallbackIcon, FallbackIcon, iconOptions,
} from '../shared/icon';
import { FallbackContextRoot } from '../context';


// Internal
const FallbackIconUse = ({ mgId, children }) => {
    const {
        has, value, set, options,
    } = useFallbackIcon('mg', mgId);
    return children({
        has, value, set, options,
    });
};


const DeviceIconUse = ({ mgId, children }) => {
    const { has, value, set } = useMgIcon(mgId);
    if (!has) return <FallbackIconUse mgId={mgId}>{children}</FallbackIconUse>;
    return children({
        has, value, set, options: iconOptions,
    });
};


// Exported
export const useFallbackMgIcons = () => {
    const { iconsReset } = useFallbackIcons('mg');
    const { resetAll } = useMgIconResetAll();

    const iconsResetFinal = useCallback(async () => {
        iconsReset();
        await resetAll();
    }, [iconsReset, resetAll]);

    return { iconsReset: iconsResetFinal };
};


export const FallbackMgIconUse = ({ mgId, children }) => {
    const { mgOptions } = useContext(FallbackContextRoot);
    if (!mgOptions
        .find(o => o.id === mgId)) return <DeviceIconUse mgId={mgId}>{children}</DeviceIconUse>;
    return <FallbackIconUse mgId={mgId}>{children}</FallbackIconUse>;
};


export const FallbackMgIcon = ({
    mgId, width, height, color, onClick, to,
}) => (
    <FallbackMgIconUse mgId={mgId}>
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
    </FallbackMgIconUse>
);
