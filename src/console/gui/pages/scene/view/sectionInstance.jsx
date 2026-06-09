// Requirements
import { useCallback, useMemo } from 'react';
import { DropdownMenu, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router';
import { useSceneOptions } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import SectionInstanceDropdown from '../../../components/layout/headerTrail/instance/dropdown';
import { useSceneFinalName } from './name';


// Internal
const SceneMenuItem = ({ sceneId, onSelect }) => {
    const name = useSceneFinalName(sceneId);

    return (
        <DropdownMenu.Item onSelect={onSelect(sceneId)}>
            <Text size="2">{ name }</Text>
        </DropdownMenu.Item>
    );
};


// Exported
export default ({ sceneId, color = 'gray' }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { options } = useSceneOptions();
    const name = useSceneFinalName(sceneId);

    const others = useMemo(() => options.filter(o => o.id !== sceneId),
        [options, sceneId]);

    const onSelect = useCallback(id => () => navigate(`/scene/${id}`), [navigate]);
    const goToList = useCallback(() => navigate('/scene/list/device'), [navigate]);

    const label = <Text size="2" color={color}>{ name }</Text>;

    return (
        <SectionInstanceDropdown color={color} label={label} hasMenu>
            {others.map(o => (
                <SceneMenuItem key={o.id} sceneId={o.id} onSelect={onSelect} />
            ))}
            {others.length > 0 && <DropdownMenu.Separator />}
            <DropdownMenu.Item onSelect={goToList}>
                { t('List') }
            </DropdownMenu.Item>
        </SectionInstanceDropdown>
    );
};
