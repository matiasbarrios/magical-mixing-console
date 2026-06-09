// Requirements
import { useEffect, useMemo } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useFooter } from '../../../components/layout/footer';
import { useUnsavedValues } from './unsavedContext';


// Exported
export default () => {
    const { t } = useLanguage();
    const { disabled: deviceDisabled } = useDevice();
    const { setOverrideWithAction } = useFooter();
    const { save, unsavedChanges } = useUnsavedValues();

    const disabled = useMemo(() => deviceDisabled
        || !unsavedChanges, [deviceDisabled, unsavedChanges]);

    useEffect(() => {
        setOverrideWithAction({
            action: save,
            label: t('Save'),
            color: 'blue',
            size: '1',
            disabled,
        });
        return () => { setOverrideWithAction(null); };
    }, [setOverrideWithAction, t, save, disabled]);

    return null;
};
