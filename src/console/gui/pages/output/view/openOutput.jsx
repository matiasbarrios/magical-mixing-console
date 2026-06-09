// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { useOutputNameTranslated } from './name';


// Exported
export default ({ outputId, mx = '1.5' }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { name } = useOutputNameTranslated(outputId);
    const navigate = useNavigate();

    const onViewClick = useCallback((e) => {
        e.stopPropagation();
        navigate(`/output/${outputId}`);
    }, [navigate, outputId]);

    if (!name) return null;

    return (
        <Button
            size={textSize}
            variant="ghost"
            color="gray"
            disabled={disabled}
            onClick={onViewClick}
            aria-label={t('View output')}
            className="mmc-btn-nowrap"
            mx={mx}
        >
            { name }
        </Button>
    );
};
