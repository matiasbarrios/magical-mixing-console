// Requirements
import { useNavigate } from 'react-router';
import { DropdownMenu } from '@radix-ui/themes';
import { useDevice, useSceneHas } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../language';


// Exported
export default () => {
    const { disabled } = useDevice();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { has } = useSceneHas();
    return (
        <DropdownMenu.Item
            onSelect={() => navigate(has ? '/scene/list/device' : '/scene/list/app')}
            disabled={disabled}
        >
            { t('Scenes') }
        </DropdownMenu.Item>
    );
};
