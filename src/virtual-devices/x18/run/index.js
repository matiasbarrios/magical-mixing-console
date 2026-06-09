// Requirements
import { createVirtualDesk } from '../../helpers/deskRun.js';
import { addressesValues } from './adressesValues.js';


const desk = createVirtualDesk({
    deviceName: 'X18-DEMO',
    deviceModel: 'X18',
    deviceFirmware: '1.18',
    addressesValues,
});


export const x18Run = desk.run;


export const x18Stop = desk.stop;
