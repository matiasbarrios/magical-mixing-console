// Requirements
import { useDevice } from '@magical-mixing/mixers-react';
import { useCallback, useMemo } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useFallbackMgOptions } from '../../../components/fallback';
import { Alert } from '../../../components/base/alert';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { ICON_STYLE } from '../../../helpers/values';


// Exported
export default ({ mgId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const navigate = useNavigate();
    const { hasRemove, remove } = useFallbackMgOptions();
    const has = useMemo(() => hasRemove(mgId), [hasRemove, mgId]);

    const doRemove = useCallback(() => {
        remove(mgId);
        navigate('/mg/list');
    }, [remove, mgId, navigate]);

    if (!has) return null;

    return (
        <Alert onAccept={doRemove} title={t('Delete')} accept={t('Delete')}>
            {doOpen => (
                <IconButton size={textSize} variant="soft" radius="full" color="red" disabled={disabled} onClick={doOpen}>
                    <TrashIcon style={ICON_STYLE} />
                </IconButton>
            )}
        </Alert>
    );
};
