// Requirements
import { DropdownMenu } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useCallback } from 'react';
import { useLanguage } from '../../../language';
import { FreshStartDialog } from '../../../base/freshStartDialog';
import { useSetupWizard } from '../../../../pages/wizard/context';


// Exported
export default () => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { runFreshStart } = useSetupWizard();

    const doReset = useCallback(() => {
        runFreshStart();
    }, [runFreshStart]);

    return (
        <FreshStartDialog onAccept={doReset}>
            {doOpen => (
                <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
                    { t('Start in a new place') }
                </DropdownMenu.Item>
            )}
        </FreshStartDialog>
    );
};
