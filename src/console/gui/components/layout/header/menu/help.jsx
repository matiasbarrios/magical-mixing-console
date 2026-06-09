// Requirements
import { useCallback } from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import { useLanguage } from '../../../language';
import { useHelp } from '../../../help/context';


// Exported
export default () => {
    const { t } = useLanguage();
    const { openHelp } = useHelp();

    const doOpen = useCallback(() => {
        openHelp();
    }, [openHelp]);

    return (
        <DropdownMenu.Item onSelect={doOpen}>
            { t('Help!') }
        </DropdownMenu.Item>
    );
};
