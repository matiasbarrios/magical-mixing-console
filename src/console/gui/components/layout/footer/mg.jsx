// Requirements
import { DropdownMenu } from '@radix-ui/themes';
import { useCallback, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { FallbackMgMute, useFallbackMgOptions } from '../../fallback';
import { MgIconName } from '../../../pages/mg/view/name';
import { useLanguage } from '../../language';
import { preventDefault } from '../../../helpers/behaviour';
import { DropdownMenuTrigger } from '../../base/dropdownMenuTrigger';
import { DropdownMenuContent } from './../../base/dropdownMenuContent';


// Exported
export default () => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { options } = useFallbackMgOptions();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger square variant="ghost" color="gray" onClick={toggleOpened}>
                {t('Mute groups')}
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                {options.map(option => (
                    <FallbackMgMute key={option.id} mgId={option.id}>
                        {({ has, toggle }) => (
                            has && (
                                <DropdownMenu.Item
                                    onClick={preventDefault(toggle)}
                                    disabled={disabled}
                                >
                                    <MgIconName mgId={option.id} size="2" identifierFirst />
                                </DropdownMenu.Item>
                            )
                        )}
                    </FallbackMgMute>
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};

