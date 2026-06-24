// Requirements
import { useCallback } from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../language';
import { useSetupWizard } from '../../../../pages/wizard/context';


// Exported
export default () => {
    const { t } = useLanguage();
    const { isOnline, isHalted, disabled } = useDevice();
    const { openWizard } = useSetupWizard();

    const doOpen = useCallback(() => {
        openWizard();
    }, [openWizard]);

    if (!isOnline || isHalted) return null;

    return (
        <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
                { t('Wizard') }
            </DropdownMenu.Item>
        </>
    );
};
