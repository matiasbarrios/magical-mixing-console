// Requirements
import { useMemo } from 'react';
import { useEntityViewLayout } from '../../../../../components/theme';
import ToHorizontal from './horizontal';
import ToVertical from './vertical';


// Internal
const ToByLayout = ({ busId, linkDestination, layout }) => {
    if (layout === 'vertical') return <ToVertical busId={busId} linkDestination={linkDestination} />;
    return <ToHorizontal busId={busId} linkDestination={linkDestination} />;
};


// Exported
export default ({ busId, linkDestination }) => {
    const { entityViewLayout } = useEntityViewLayout();

    const toTree = useMemo(() => (
        <ToByLayout busId={busId} linkDestination={linkDestination} layout={entityViewLayout} />
    ), [busId, linkDestination, entityViewLayout]);

    return toTree;
};
