// Requirements
import { useMemo } from 'react';
import {
    useConfigurationHas, useDevice,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import EntityViewShell from '../../../components/layout/entity/shell';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import { UnsavedValuesProvider } from './unsavedContext';
import DeviceSettingsTabs from './tabs';
import SaveButton from './saveButton';
import NavigationGuard from './navigationGuard';


// Exported
export default () => {
    const { t } = useLanguage();
    const { has } = useConfigurationHas();
    const { name } = useDevice();

    const entity = useMemo(() => ({ name: t('Settings') }), [t]);
    const instance = useMemo(() => ({ name }), [name]);
    useEntityHeaderTrail({ entity, instance });

    if (!has) return null;

    return (
        <UnsavedValuesProvider>
            <EntityViewShell>
                <DeviceSettingsTabs />
            </EntityViewShell>
            <SaveButton />
            <NavigationGuard />
        </UnsavedValuesProvider>
    );
};
