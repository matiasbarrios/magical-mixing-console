// Requirements
import { useCallback, useMemo } from 'react';
import { DropdownMenu, Text } from '@radix-ui/themes';
import { useFxOptions } from '@magical-mixing/mixers-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../../components/language';
import SectionInstanceDropdown from '../../../components/layout/headerTrail/instance/dropdown';
import { useFxNameTranslated } from './name';


// Internal
const FxMenuItem = ({ fxId, onSelect }) => {
    const { name } = useFxNameTranslated(fxId);

    return (
        <DropdownMenu.Item onSelect={onSelect(fxId)}>
            <Text size="2">{ name }</Text>
        </DropdownMenu.Item>
    );
};


// Exported
export default ({ fxId, color = 'gray' }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { options } = useFxOptions();
    const { name } = useFxNameTranslated(fxId);

    const others = useMemo(() => options.filter(o => o.id !== fxId),
        [options, fxId]);

    const onSelect = useCallback(id => () => navigate(`/fx/${id}`), [navigate]);
    const goToList = useCallback(() => navigate('/fx/list'), [navigate]);

    const label = <Text size="2" color={color}>{ name }</Text>;

    return (
        <SectionInstanceDropdown color={color} label={label} hasMenu>
            {others.map(o => (
                <FxMenuItem key={o.id} fxId={o.id} onSelect={onSelect} />
            ))}
            {others.length > 0 && <DropdownMenu.Separator />}
            <DropdownMenu.Item onSelect={goToList}>
                { t('List') }
            </DropdownMenu.Item>
        </SectionInstanceDropdown>
    );
};
