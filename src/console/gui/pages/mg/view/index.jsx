// Requirements
import {
    useCallback, useMemo, useState,
} from 'react';
import { useParams } from 'react-router';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import { HeaderIconButton } from '../../../components/layout/header/iconButton';
import { ICON_STYLE } from '../../../helpers/values';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import EntityNotFound from '../../../components/base/entityNotFound';
import { useFallbackMgOptions } from '../../../components/fallback';
import Edit from './edit';
import MgTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { mgId } = useParams();
    return { mgId: parseInt(mgId, 10) };
};


const Mg = ({ element }) => {
    const { disabled } = useDevice();
    const { options } = useFallbackMgOptions();

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
        mgId: element.id,
    }), [element.id]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/mg/${previous.id}`,
        next: next && `/mg/${next.id}`,
        actions,
    });

    return (
        <>
            <Edit
                mgId={element.id}
                open={editOpened}
                onOpenChange={setEditOpened}
            />
            <EntityViewShell>
                <MgTabs mgId={element.id} />
            </EntityViewShell>
        </>
    );
};


// Exported
export default () => {
    const { mgId } = useParsedParams();
    const { get } = useFallbackMgOptions();
    const element = useMemo(() => get(mgId), [get, mgId]);
    if (!element) return <EntityNotFound listTo="/mg/list" />;
    return <Mg element={element} />;
};
