// Requirements
import { useCallback } from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../language';
import { useTroubleshooting } from '../../../../pages/troubleshooting/context';


// Exported
export default () => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { openTroubleshooting } = useTroubleshooting();

    const doOpen = useCallback(() => {
        openTroubleshooting();
    }, [openTroubleshooting]);

    return (
        <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
            { t('Troubleshooting') }
        </DropdownMenu.Item>
    );
};
