// Requirements
import { useDevice } from '@magical-mixing/mixers-react';
import { useCallback, useMemo } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useFallbackDcaOptions } from '../../../components/fallback';
import { Alert } from '../../../components/base/alert';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { ICON_STYLE } from '../../../helpers/values';


// Exported
export default ({ dcaId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const navigate = useNavigate();
    const { hasRemove, remove } = useFallbackDcaOptions();
    const has = useMemo(() => hasRemove(dcaId), [hasRemove, dcaId]);

    const doRemove = useCallback(() => {
        remove(dcaId);
        navigate('/dca/list');
    }, [remove, dcaId, navigate]);

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
