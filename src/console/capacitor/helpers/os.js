// Requirements
import { Device } from '@capacitor/device';


// Exported
export const getOSLanguage = async () => {
    const locale = await Device.getLanguageCode();
    return locale?.value || '';
};
