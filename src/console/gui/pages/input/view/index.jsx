// Requirements
import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import { useInputOptions } from '@magical-mixing/mixers-react';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import InputTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { inputId } = useParams();
    return { inputId: parseInt(inputId, 10) };
};


const Input = ({ input }) => {
    const { options } = useInputOptions();

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === input.id);
        return index > 0 ? options[index - 1] : null;
    }, [options, input.id]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === input.id);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, input.id]);

    const instance = useMemo(() => ({
        inputId: input.id,
    }), [input.id]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/input/${previous.id}`,
        next: next && `/input/${next.id}`,
    });

    return (
        <EntityViewShell>
            <InputTabs inputId={input.id} />
        </EntityViewShell>
    );
};


// Exported
export default () => {
    const { inputId } = useParsedParams();
    const { get } = useInputOptions();
    const input = useMemo(() => get(inputId), [get, inputId]);
    if (!input) return <Navigate to="/input/list" replace />;
    return <Input input={input} />;
};
