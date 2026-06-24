// Requirements
import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import { useSceneOptions } from '@magical-mixing/mixers-react';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import SceneTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { sceneId } = useParams();
    return { sceneId: parseInt(sceneId, 10) };
};


const Scene = ({ element }) => {
    const { options } = useSceneOptions();

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index > 0 ? options[index - 1] : null;
    }, [options, element.id]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, element.id]);

    const instance = useMemo(() => ({
        sceneId: element.id,
    }), [element.id]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/scene/${previous.id}`,
        next: next && `/scene/${next.id}`,
    });

    return (
        <EntityViewShell>
            <SceneTabs sceneId={element.id} />
        </EntityViewShell>
    );
};


// Exported
export default () => {
    const { sceneId } = useParsedParams();
    const { get } = useSceneOptions();

    const element = useMemo(() => get(sceneId), [get, sceneId]);

    if (!element) return <Navigate to="/scene/list/device" replace />;

    return <Scene element={element} />;
};
