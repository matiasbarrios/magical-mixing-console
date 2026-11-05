// Requirements
import { loadPlatform } from './adapter.tinyjs.js';


// Variables
let platform = null;

const userAgent = navigator.userAgent.toLowerCase();


// Exported
export const isProduction = process.env.NODE_ENV === 'production';


export const isMobile = !window?.tiny;


export const isLinux = userAgent.includes('linux') && !userAgent.includes('android');


export const platformLoad = async () => {
    if (platform !== null) return;
    platform = await loadPlatform();
};


export const platformGet = () => platform;
