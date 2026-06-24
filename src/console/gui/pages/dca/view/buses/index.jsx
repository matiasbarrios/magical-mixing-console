// Requirements
import { useMemo } from 'react';
import { useEntityViewLayout } from '../../../../components/theme';
import { SourceBusEditProvider } from '../../../bus/view/fromTo/from/sourceBusEdit';
import BusesHorizontal from './horizontal';
import BusesVertical from './vertical';


// Internal
const BusesByLayout = ({ dcaId, layout }) => {
    if (layout === 'vertical') return <BusesVertical dcaId={dcaId} />;
    return <BusesHorizontal dcaId={dcaId} />;
};


// Exported
export default ({ dcaId }) => {
    const { entityViewLayout } = useEntityViewLayout();

    const busesTree = useMemo(() => (
        <BusesByLayout dcaId={dcaId} layout={entityViewLayout} />
    ), [dcaId, entityViewLayout]);

    return (
        <SourceBusEditProvider>
            { busesTree }
        </SourceBusEditProvider>
    );
};
