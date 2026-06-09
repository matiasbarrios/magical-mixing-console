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
import { FallbackDcaColor, useFallbackDcaOptions } from '../../../components/fallback';
import Edit from './edit';
import DcaTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { dcaId } = useParams();
    return { dcaId: parseInt(dcaId, 10) };
};


const Dca = ({ element, color }) => {
    const { disabled } = useDevice();
    const { options } = useFallbackDcaOptions();

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
        dcaId: element.id,
        color,
    }), [element.id, color]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/dca/${previous.id}`,
        next: next && `/dca/${next.id}`,
        actions,
    });

    return (
        <>
            <Edit
                dcaId={element.id}
                open={editOpened}
                onOpenChange={setEditOpened}
            />
            <EntityViewShell>
                <DcaTabs dcaId={element.id} />
            </EntityViewShell>
        </>
    );
};


// Exported
export default () => {
    const { dcaId } = useParsedParams();
    const { get } = useFallbackDcaOptions();
    const element = useMemo(() => get(dcaId), [get, dcaId]);
    if (!element) return <EntityNotFound listTo="/dca/list" />;
    return (
        <FallbackDcaColor dcaId={dcaId} defaultValue="gray">
            {({ value: color }) => <Dca element={element} color={color} />}
        </FallbackDcaColor>
    );
};
