// Requirements
import {
    useMemo,
} from 'react';
import { Navigate, useParams } from 'react-router';
import { useFxOptions } from '@magical-mixing/mixers-react';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import FxTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { fxId } = useParams();
    return { fxId: parseInt(fxId, 10) };
};


const Fx = ({ fx }) => {
    const { options } = useFxOptions();

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === fx.id);
        return index > 0 ? options[index - 1] : null;
    }, [options, fx.id]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === fx.id);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, fx.id]);

    const instance = useMemo(() => ({
        fxId: fx.id,
    }), [fx.id]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/fx/${previous.id}`,
        next: next && `/fx/${next.id}`,
    });

    return (
        <EntityViewShell>
            <FxTabs fxId={fx.id} />
        </EntityViewShell>
    );
};


// Exported
export default () => {
    const { fxId } = useParsedParams();
    const { get } = useFxOptions();
    const fx = useMemo(() => get(fxId), [get, fxId]);

    if (!fx) return <Navigate to="/fx/list" replace />;

    return <Fx fx={fx} />;
};
