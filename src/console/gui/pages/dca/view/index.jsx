// Requirements
import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import { FallbackDcaColor, useFallbackDcaOptions } from '../../../components/fallback';
import DcaTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { dcaId } = useParams();
    return { dcaId: parseInt(dcaId, 10) };
};


const Dca = ({ element, color }) => {
    const { options } = useFallbackDcaOptions();

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index > 0 ? options[index - 1] : null;
    }, [options, element.id]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === element.id);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, element.id]);

    const instance = useMemo(() => ({
        dcaId: element.id,
        color,
    }), [element.id, color]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/dca/${previous.id}`,
        next: next && `/dca/${next.id}`,
    });

    return (
        <EntityViewShell>
            <DcaTabs dcaId={element.id} />
        </EntityViewShell>
    );
};


// Exported
export default () => {
    const { dcaId } = useParsedParams();
    const { get } = useFallbackDcaOptions();
    const element = useMemo(() => get(dcaId), [get, dcaId]);
    if (!element) return <Navigate to="/dca/list" replace />;
    return (
        <FallbackDcaColor dcaId={dcaId} defaultValue="gray">
            {({ value: color }) => <Dca element={element} color={color} />}
        </FallbackDcaColor>
    );
};
