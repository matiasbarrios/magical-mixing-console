// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { useSceneFinalName } from './name';


// Exported
const ViewScene = ({ sceneId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const name = useSceneFinalName(sceneId);
    const navigate = useNavigate();

    const onViewClick = useCallback((e) => {
        e.stopPropagation();
        navigate(`/scene/${sceneId}`);
    }, [navigate, sceneId]);

    if (!name) return null;

    return (
        <Button
            size={textSize}
            variant="ghost"
            color="gray"
            disabled={disabled}
            onClick={onViewClick}
            aria-label={t('View scene')}
            className="mmc-btn-nowrap"
            mx="1.5"
        >
            { name }
        </Button>
    );
};


export default ViewScene;
