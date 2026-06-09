// Requirements
import { x18Run, x18Stop } from './x18/run/index.js';
import { xr12Run, xr12Stop } from './xr12/run/index.js';


const devices = {
    x18: { run: x18Run, stop: x18Stop },
    xr12: { run: xr12Run, stop: xr12Stop },
};


// Exported
export const deviceRun = async (device, { ip, port, platform }) => {
    const d = devices[device];
    if (!d) throw new Error(`Device ${device} not found`);
    return d.run({ ip, port, platform });
};


export const deviceStop = async (device) => {
    const d = devices[device];
    if (!d) throw new Error(`Device ${device} not found`);
    return d.stop();
};
