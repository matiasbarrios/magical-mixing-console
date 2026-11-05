// Requirements
import { lanRefresh } from './helpers/lan';


// Exported
export * from './helpers/lan';
export * from './helpers/storage';
export * from './helpers/system';
export * from './helpers/udp';
export * from './helpers/virtual';


export const platformReady = async () => {
    await lanRefresh();
};
