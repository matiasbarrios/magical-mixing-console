// Requirements
import {
    useCallback, useMemo, useState,
} from 'react';
import { useParams } from 'react-router';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useDevice, useInputOptions } from '@magical-mixing/mixers-react';
import { HeaderIconButton } from '../../../components/layout/header/iconButton';
import { ICON_STYLE } from '../../../helpers/values';
import { useEntityHeaderTrail } from '../../../components/layout/headerTrail/hooks/useHeaderTrail';
import EntityViewShell from '../../../components/layout/entity/shell';
import EntityNotFound from '../../../components/base/entityNotFound';
import Edit, { useInputEdit } from './edit';
import InputTabs from './tabs';


// Internal
const useParsedParams = () => {
    const { inputId } = useParams();
    return { inputId: parseInt(inputId, 10) };
};


const Input = ({ input }) => {
    const { disabled } = useDevice();
    const { options } = useInputOptions();
    const { has: editHas } = useInputEdit(input.id);

    const previous = useMemo(() => {
        const index = options.findIndex(d => d.id === input.id);
        return index > 0 ? options[index - 1] : null;
    }, [options, input.id]);

    const next = useMemo(() => {
        const index = options.findIndex(d => d.id === input.id);
        return index < options.length - 1 ? options[index + 1] : null;
    }, [options, input.id]);

    const [editOpened, setEditOpened] = useState(false);
    const editOpen = useCallback(() => setEditOpened(true), []);

    const actions = useMemo(() => {
        if (!editHas) return undefined;
        return (
            <HeaderIconButton disabled={disabled} onClick={editOpen}>
                <Pencil1Icon style={ICON_STYLE} />
            </HeaderIconButton>
        );
    }, [disabled, editHas, editOpen]);

    const instance = useMemo(() => ({
        inputId: input.id,
    }), [input.id]);

    useEntityHeaderTrail({
        instance,
        previous: previous && `/input/${previous.id}`,
        next: next && `/input/${next.id}`,
        actions,
    });

    return (
        <>
            {editHas && (
                <Edit
                    inputId={input.id}
                    open={editOpened}
                    onOpenChange={setEditOpened}
                />
            )}
            <EntityViewShell>
                <InputTabs inputId={input.id} />
            </EntityViewShell>
        </>
    );
};


// Exported
export default () => {
    const { inputId } = useParsedParams();
    const { get } = useInputOptions();
    const input = useMemo(() => get(inputId), [get, inputId]);
    if (!input) return <EntityNotFound listTo="/input/list" />;
    return <Input input={input} />;
};
