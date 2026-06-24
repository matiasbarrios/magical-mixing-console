// Requirements
import { useCallback, useMemo } from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useFallbackDcaOptions } from '../../../components/fallback';
import { useLanguage } from '../../../components/language';
import SectionInstanceDropdown from '../../../components/layout/headerTrail/instance/dropdown';
import { useUiSize } from '../../../components/theme';
import { DcaIconName } from './name';


// Internal
const DcaMenuItem = ({ dcaId, onSelect }) => (
    <DropdownMenu.Item onSelect={onSelect(dcaId)}>
        <DcaIconName dcaId={dcaId} size="2" />
    </DropdownMenu.Item>
);


// Exported
export default ({ dcaId, color = 'gray' }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { textSize } = useUiSize();
    const { options } = useFallbackDcaOptions();

    const others = useMemo(() => options.filter(o => o.id !== dcaId),
        [options, dcaId]);

    const onSelect = useCallback(id => () => navigate(`/dca/${id}`), [navigate]);
    const goToList = useCallback(() => navigate('/dca/list'), [navigate]);

    const label = <DcaIconName dcaId={dcaId} size={textSize} hideNameIfDefault />;

    return (
        <SectionInstanceDropdown color={color} label={label} hasMenu>
            {others.map(o => (
                <DcaMenuItem key={o.id} dcaId={o.id} onSelect={onSelect} />
            ))}
            {others.length > 0 && <DropdownMenu.Separator />}
            <DropdownMenu.Item onSelect={goToList}>
                { t('List') }
            </DropdownMenu.Item>
        </SectionInstanceDropdown>
    );
};
