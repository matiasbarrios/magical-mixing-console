// Requirements
import { useMemo } from 'react';
import X18 from '../../static/devices/X18.png';
import XR18 from '../../static/devices/XR18.png';
import MR18 from '../../static/devices/MR18.png';
import XR16 from '../../static/devices/XR16.png';
import XR12 from '../../static/devices/XR12.png';
import MR12 from '../../static/devices/MR12.png';


// Constants
const srcFromModel = {
    X18,
    XR18,
    MR18,
    X18V2: X18,
    XR18V2: XR18,
    MR18V2: MR18,
    XR16,
    XR16V2: XR16,
    XR12,
    MR12,
    XR12V2: XR12,
    MR12V2: MR12,
};


// Exported
export default ({ model, style }) => {
    const src = useMemo(() => srcFromModel[model], [model]);
    if (!src) return null;
    return <img style={style} src={src} alt={model} />;
};
