// Requirements
import { Haptics, ImpactStyle } from '@capacitor/haptics';


// Exported
export const triggerHaptic = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
};
