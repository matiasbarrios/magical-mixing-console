// Requirements
import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import { useOutputOptions } from '@magical-mixing/mixers-react';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import OutputTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { outputId } = useParams();
    return { outputId: parseInt(outputId, 10) };
};


const Output = ({ outputId }) => {
    const { options } = useOutputOptions();

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === outputId);
        return index > 0 ? options[index - 1] : null;
    }, [options, outputId]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === outputId);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, outputId]);

    const instance = useMemo(() => ({
        outputId,
    }), [outputId]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/output/${previous.id}`,
        next: next && `/output/${next.id}`,
    });

    return (
        <EntityViewShell>
            <OutputTabs outputId={outputId} />
        </EntityViewShell>
    );
};


// Exported
export default () => {
    const { outputId } = useParsedParams();
    const { get } = useOutputOptions();
    const output = useMemo(() => get(outputId), [get, outputId]);
    if (!output) return <Navigate to="/output/list" replace />;
    return <Output outputId={outputId} />;
};
