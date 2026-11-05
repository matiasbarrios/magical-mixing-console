// Requirements
import { call } from './bridge';


// Exported
export const virtualDeviceRun = (device, ip, port) => call('virtualDeviceRun', device, ip, port);


export const virtualDeviceStop = () => call('virtualDeviceStop');


export const virtualDeviceIsRunning = () => call('virtualDeviceIsRunning');


export const virtualDevicePause = () => call('virtualDevicePause');


export const virtualDeviceResume = () => call('virtualDeviceResume');
