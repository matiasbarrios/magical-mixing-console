// Requirements
import { Toast } from '@capacitor/toast';


// Exported
export const toastShow = (message) => {
    setTimeout(async () => {
        await Toast.show({ text: message });
    });
};
