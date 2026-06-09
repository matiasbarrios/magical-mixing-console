// Requirements
import { DropdownMenu } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../language';


// Exported
export default () => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <DropdownMenu.Item onSelect={() => navigate('/bus/list')} disabled={disabled}>
            { t('Buses') }
        </DropdownMenu.Item>
    );
};
