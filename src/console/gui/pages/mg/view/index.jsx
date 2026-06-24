// Requirements
import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import { useFallbackMgOptions } from '../../../components/fallback';
import MgTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { mgId } = useParams();
    return { mgId: parseInt(mgId, 10) };
};


const Mg = ({ element }) => {
    const { options } = useFallbackMgOptions();

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index > 0 ? options[index - 1] : null;
    }, [options, element.id]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, element.id]);

    const instance = useMemo(() => ({
        mgId: element.id,
    }), [element.id]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/mg/${previous.id}`,
        next: next && `/mg/${next.id}`,
    });

    return (
        <EntityViewShell>
            <MgTabs mgId={element.id} />
        </EntityViewShell>
    );
};


// Exported
export default () => {
    const { mgId } = useParsedParams();
    const { get } = useFallbackMgOptions();
    const element = useMemo(() => get(mgId), [get, mgId]);
    if (!element) return <Navigate to="/mg/list" replace />;
    return <Mg element={element} />;
};
