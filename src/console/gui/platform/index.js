// Variables
let platform = null;

const userAgent = navigator.userAgent.toLowerCase();


// Exported
export const isProduction = process.env.NODE_ENV === 'production';


export const isMobile = !window?.electron;


export const isLinux = userAgent.includes('linux') && !userAgent.includes('android');


export const platformLoad = async () => {
    if (platform !== null) return;
    if (window?.electron) {
        platform = window?.electron;
    } else {
        platform = await import('../../capacitor');
    }
};


export const platformGet = () => platform;
