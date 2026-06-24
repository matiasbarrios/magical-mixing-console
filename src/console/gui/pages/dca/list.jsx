// Requirements
import {
    useCallback, useMemo, useState,
} from 'react';
import { IconButton } from '@radix-ui/themes';
import { useDevice } from '@magical-mixing/mixers-react';
import { PlusIcon } from '@radix-ui/react-icons';
import { ADD_ROAM_ID, RESET_ROAM_ID, focusRoamAttrs } from '../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../components/base/resetIcon';
import { ICON_STYLE } from '../../helpers/values';
import ListStack from '../../components/layout/list/stack';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import {
    useFallbackBusDcaUnassignAllOfAll, useFallbackDcaColors,
    useFallbackDcaLevels,
    useFallbackDcaNames, useFallbackDcaOptions, FallbackDcaName,
} from '../../components/fallback';
import { useFallbackDcaIcons } from '../../components/fallback/dca/icon';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import { ListFilterScope, useListFilterVisibility } from '../../components/layout/list/filterEmpty';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { Alert } from '../../components/base/alert';
import Add from './view/add';
import Edit from './view/edit';
import ListRow from './listRow';


// Internal
const ToolbarReset = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();

    const { colorsReset } = useFallbackDcaColors();
    const { iconsReset } = useFallbackDcaIcons();
    const { namesReset } = useFallbackDcaNames();
    const { levelsReset } = useFallbackDcaLevels();
    const { unassignAll: unassignAllBusesOfAll } = useFallbackBusDcaUnassignAllOfAll();

    const resetAll = useCallback(async () => {
        await colorsReset();
        await iconsReset();
        await namesReset();
        await levelsReset();
        await unassignAllBusesOfAll();
    }, [colorsReset, iconsReset, namesReset, levelsReset, unassignAllBusesOfAll]);

    return (
        <Alert onAccept={resetAll} accept={t('Clear all DCAs')}>
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Clear all DCAs')}
                    {...focusRoamAttrs(RESET_ROAM_ID)}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


const ToolbarAdd = ({ onAdd }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();

    return (
        <IconButton
            variant="soft"
            color="gray"
            size={textSize}
            radius="full"
            onClick={onAdd}
            disabled={disabled}
            aria-label={t('Add')}
            {...focusRoamAttrs(ADD_ROAM_ID)}
        >
            <PlusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


const Element = ({
    dcaId, name, identifier, filterBy, onEdit,
}) => {
    const hide = useMemo(() => {
        const filterLower = filterBy.toLowerCase();
        return !name.toLowerCase().includes(filterLower)
            && !identifier.toLowerCase().includes(filterLower);
    }, [name, identifier, filterBy]);

    useListFilterVisibility(dcaId, hide);

    if (hide) return null;

    return <ListRow dcaId={dcaId} onEdit={onEdit} />;
};


const Elements = ({ filterBy, onEdit }) => {
    const { options } = useFallbackDcaOptions();
    return (options.map(i => (
        <FallbackDcaName key={i.id} dcaId={i.id}>
            {({ has, value, defaultName }) => {
                const name = ((!has || !value) ? defaultName : value);
                return (
                    <Element
                        dcaId={i.id}
                        name={name}
                        identifier={defaultName}
                        filterBy={filterBy}
                        onEdit={onEdit}
                    />
                );
            }}
        </FallbackDcaName>
    )));
};


const List = ({ filterBy, onEdit }) => (
    <ListFilterScope filterBy={filterBy}>
        <ListStack>
            <Elements filterBy={filterBy} onEdit={onEdit} />
        </ListStack>
    </ListFilterScope>
);


// Exported
export default () => {
    const { t } = useLanguage();

    const [filterBy, setFilterBy] = useState('');

    const [addOpened, setAddOpened] = useState(false);
    const addOpen = useCallback(() => setAddOpened(true), []);
    const addClose = useCallback(() => setAddOpened(false), []);

    const [dcaIdEditing, setDcaIdEditing] = useState(null);
    const onEditClose = useCallback(() => { setDcaIdEditing(null); }, []);
    const onEdit = useCallback(dcaId => setDcaIdEditing(dcaId), []);

    useListHeaderTrail(t('DCAs'));

    return (
        <>
            {addOpened && <Add open close={addClose} />}
            {dcaIdEditing !== null && (
                <Edit dcaId={dcaIdEditing} open onOpenChange={onEditClose} />
            )}
            <ListPageShell>
                <ListFilterBar>
                    <ListFilterTitle>
                        <TextFieldErasable
                            variant="surface"
                            placeholder={t('Name')}
                            value={filterBy}
                            set={setFilterBy}
                            debounceTime={250}
                            width="100%"
                        />
                    </ListFilterTitle>
                    <ListFilterActions>
                        <ToolbarReset />
                        <ToolbarAdd onAdd={addOpen} />
                    </ListFilterActions>
                </ListFilterBar>
                <List filterBy={filterBy} onEdit={onEdit} />
            </ListPageShell>
        </>
    );
};
