// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { useInputNameTranslated } from './name';


// Exported
const ViewInput = ({ inputId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { name } = useInputNameTranslated(inputId);
    const navigate = useNavigate();

    const onViewClick = useCallback((e) => {
        e.stopPropagation();
        navigate(`/input/${inputId}`);
    }, [navigate, inputId]);

    if (!name) return null;

    return (
        <Button
            size={textSize}
            variant="ghost"
            color="gray"
            disabled={disabled}
            onClick={onViewClick}
            aria-label={t('View input')}
            className="mmc-btn-nowrap"
            mx="1.5"
        >
            { name }
        </Button>
    );
};


export default ViewInput;
