// Requirements
import { Button } from '@radix-ui/themes';
import { useCallback } from 'react';
import { useBusOptions } from '@magical-mixing/mixers-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../language';
import { useUiSize } from '../../theme';
import { useFooter } from './context';


// Exported
export default () => {
    const { soloOn } = useFooter();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const navigate = useNavigate();
    const { soloOne } = useBusOptions();

    const navigateToSolo = useCallback(() => {
        navigate(`/bus/${soloOne.id}`);
    }, [navigate, soloOne]);

    if (!soloOn) return null;

    return (
        <Button size={textSize} variant="ghost" color="yellow" onClick={navigateToSolo}>
            {t('Solo on')}
        </Button>
    );
};

