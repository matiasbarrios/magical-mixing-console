// Requirements
import { useCallback } from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import { useLanguage } from '../../../language';
import { useAppearance } from '../../../../pages/settings/appearance';
import { useHotkeysSettings } from '../../../../pages/settings/hotkeys';


// Exported
export default () => {
    const { t } = useLanguage();
    const { openAppearance } = useAppearance();
    const { openHotkeys } = useHotkeysSettings();

    const doOpenAppearance = useCallback(() => {
        openAppearance();
    }, [openAppearance]);

    const doOpenHotkeys = useCallback(() => {
        openHotkeys();
    }, [openHotkeys]);

    return (
        <>
            <DropdownMenu.Item onSelect={doOpenAppearance}>
                { t('Appearance') }
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={doOpenHotkeys}>
                { t('Hotkeys') }
            </DropdownMenu.Item>
        </>
    );
};
