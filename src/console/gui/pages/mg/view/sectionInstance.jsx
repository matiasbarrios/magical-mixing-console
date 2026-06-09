// Requirements
import { useCallback, useMemo } from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useFallbackMgOptions } from '../../../components/fallback';
import { useLanguage } from '../../../components/language';
import SectionInstanceDropdown from '../../../components/layout/headerTrail/instance/dropdown';
import { MgIconName } from './name';


// Internal
const MgMenuItem = ({ mgId, onSelect }) => (
    <DropdownMenu.Item onSelect={onSelect(mgId)}>
        <MgIconName mgId={mgId} size="2" />
    </DropdownMenu.Item>
);


// Exported
export default ({ mgId, color = 'gray' }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { options } = useFallbackMgOptions();

    const others = useMemo(() => options.filter(o => o.id !== mgId),
        [options, mgId]);

    const onSelect = useCallback(id => () => navigate(`/mg/${id}`), [navigate]);
    const goToList = useCallback(() => navigate('/mg/list'), [navigate]);

    const label = <MgIconName mgId={mgId} size="2" hideNameIfDefault />;

    return (
        <SectionInstanceDropdown color={color} label={label} hasMenu>
            {others.map(o => (
                <MgMenuItem key={o.id} mgId={o.id} onSelect={onSelect} />
            ))}
            {others.length > 0 && <DropdownMenu.Separator />}
            <DropdownMenu.Item onSelect={goToList}>
                { t('List') }
            </DropdownMenu.Item>
        </SectionInstanceDropdown>
    );
};
