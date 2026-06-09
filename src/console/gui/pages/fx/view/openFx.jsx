// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { useFxNameTranslated } from './name';


// Exported
const ViewFx = ({ fxId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { name } = useFxNameTranslated(fxId);
    const navigate = useNavigate();

    const onViewClick = useCallback((e) => {
        e.stopPropagation();
        navigate(`/fx/${fxId}`);
    }, [navigate, fxId]);

    if (!name) return null;

    return (
        <Button
            size={textSize}
            variant="ghost"
            color="gray"
            disabled={disabled}
            onClick={onViewClick}
            aria-label={t('View FX')}
            className="mmc-btn-nowrap"
            mx="1.5"
        >
            { name }
        </Button>
    );
};


export default ViewFx;
