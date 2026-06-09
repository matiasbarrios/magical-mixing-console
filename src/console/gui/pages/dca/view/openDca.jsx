// Requirements
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { FallbackDcaColor, FallbackDcaName } from '../../../components/fallback';


// Internal
const DcaViewDca = ({ dcaId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const navigate = useNavigate();

    const onViewClick = useCallback((e) => {
        e.stopPropagation();
        navigate(`/dca/${dcaId}`);
    }, [navigate, dcaId]);

    return (
        <FallbackDcaName dcaId={dcaId}>
            {({ defaultName }) => {
                if (!defaultName) return null;

                return (
                    <FallbackDcaColor dcaId={dcaId} defaultValue="gray">
                        {({ value: color }) => (
                            <Button
                                size={textSize}
                                variant="ghost"
                                color={color}
                                disabled={disabled}
                                onClick={onViewClick}
                                aria-label={t('View DCA')}
                                className="mmc-btn-nowrap"
                                mx="1.5"
                            >
                                { defaultName }
                            </Button>
                        )}
                    </FallbackDcaColor>
                );
            }}
        </FallbackDcaName>
    );
};


// Exported
export {
    DcaViewDca,
};
