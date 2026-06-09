// Requirements
import { createVirtualDesk } from '../../helpers/deskRun.js';
import { addressesValues } from '../../x18/run/adressesValues.js';


const desk = createVirtualDesk({
    deviceName: 'XR12-DEMO',
    deviceModel: 'XR12',
    deviceFirmware: '1.18',
    addressesValues,
});


export const xr12Run = desk.run;


export const xr12Stop = desk.stop;
