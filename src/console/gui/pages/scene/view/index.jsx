// Requirements
import {
    useCallback, useMemo, useState,
} from 'react';
import { useParams } from 'react-router';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useDevice, useSceneOptions } from '@magical-mixing/mixers-react';
import { HeaderIconButton } from '../../../components/layout/header/iconButton';
import { ICON_STYLE } from '../../../helpers/values';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import EntityNotFound from '../../../components/base/entityNotFound';
import Edit from './edit';
import SceneTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { sceneId } = useParams();
    return { sceneId: parseInt(sceneId, 10) };
};


const Scene = ({ element }) => {
    const { disabled } = useDevice();
    const { options } = useSceneOptions();

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index > 0 ? options[index - 1] : null;
    }, [options, element.id]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, element.id]);

    const [editOpened, setEditOpened] = useState(false);
    const editOpen = useCallback(() => setEditOpened(true), []);

    const actions = useMemo(() => (
        <HeaderIconButton disabled={disabled} onClick={editOpen}>
            <Pencil1Icon style={ICON_STYLE} />
        </HeaderIconButton>
    ), [disabled, editOpen]);

    const instance = useMemo(() => ({
        sceneId: element.id,
    }), [element.id]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/scene/${previous.id}`,
        next: next && `/scene/${next.id}`,
        actions,
    });

    return (
        <>
            <Edit
                sceneId={element.id}
                open={editOpened}
                onOpenChange={setEditOpened}
            />
            <EntityViewShell>
                <SceneTabs sceneId={element.id} />
            </EntityViewShell>
        </>
    );
};


// Exported
export default () => {
    const { sceneId } = useParsedParams();
    const { get } = useSceneOptions();

    const element = useMemo(() => get(sceneId), [get, sceneId]);

    if (!element) return <EntityNotFound listTo="/scene/list/device" />;

    return <Scene element={element} />;
};
