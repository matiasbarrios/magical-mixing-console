// Requirements
import { useMemo } from 'react';
import { useEntityViewLayout } from '../../../../../components/theme';
import FromHorizontal from './horizontal';
import FromVertical from './vertical';
import { ProcessingPreviewProvider } from './previewDialog';
import { SourceBusEditProvider } from './sourceBusEdit';


// Internal
const FromByLayout = ({ busId, layout }) => {
    if (layout === 'vertical') return <FromVertical busId={busId} />;
    return <FromHorizontal busId={busId} />;
};


// Exported
export default ({ busId }) => {
    const { entityViewLayout } = useEntityViewLayout();

    const fromTree = useMemo(() => (
        <FromByLayout busId={busId} layout={entityViewLayout} />
    ), [busId, entityViewLayout]);

    return (
        <ProcessingPreviewProvider>
            <SourceBusEditProvider>
                { fromTree }
            </SourceBusEditProvider>
        </ProcessingPreviewProvider>
    );
};
