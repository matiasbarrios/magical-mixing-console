// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { MgIconName } from './name';


// Exported
const ViewMg = ({ mgId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const navigate = useNavigate();

    const onViewClick = useCallback((e) => {
        e.stopPropagation();
        navigate(`/mg/${mgId}`);
    }, [navigate, mgId]);

    return (
        <Button
            size={textSize}
            variant="ghost"
            color="gray"
            disabled={disabled}
            onClick={onViewClick}
            aria-label={t('View mute group')}
            className="mmc-btn-nowrap"
            mx="1.5"
        >
            <MgIconName mgId={mgId} size={textSize} identifierFirst />
        </Button>
    );
};


export default ViewMg;
