// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { DropdownMenu } from '@radix-ui/themes';
import {
    useBusLevelLowerMany, useBusMuteMany, useBusNameResetAll, useBusResetAll, useDevice,
} from '@magical-mixing/mixers-react';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import {
    DndContext, useSensor, TouchSensor, MouseSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ResetIcon from '../../components/base/resetIcon';
import { useLanguage } from '../../components/language';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import { useFallbackBusColors, useFallbackBusIcons, useFallbackBusesSorted } from '../../components/fallback';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import { ListFilterScope, useListFilterVisibility } from '../../components/layout/list/filterEmpty';
import { DropdownMenuTrigger } from '../../components/base/dropdownMenuTrigger';
import { ICON_STYLE } from '../../helpers/values';
import ListStack from '../../components/layout/list/stack';
import { Alert } from '../../components/base/alert';
import ListFooter from '../../components/layout/list/footer';
import { formatBusIdentifierShort, useBusNameTranslated } from './view/name';
import Edit from './view/edit';
import ListRow from './listRow';
import { DropdownMenuContent } from './../../components/base/dropdownMenuContent';


// Internal
const SortableBusRow = ({
    busId, onEdit,
}) => {
    const {
        attributes, listeners, setNodeRef, transform, transition,
        setActivatorNodeRef, isDragging,
    } = useSortable({ id: busId });

    const sortableStyle = useMemo(() => ({
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Transform.toString(transform),
        transition,
    }), [isDragging, transform, transition]);

    const dragHandle = useMemo(() => ({
        attributes, listeners, setActivatorNodeRef,
    }), [attributes, listeners, setActivatorNodeRef]);

    return (
        <ListRow
            busId={busId}
            onEdit={onEdit}
            setNodeRef={setNodeRef}
            sortableStyle={sortableStyle}
            dragHandle={dragHandle}
        />
    );
};


const Element = ({
    bus, filterBy, filtered, onEdit,
}) => {
    const { name } = useBusNameTranslated(bus.id);

    const hide = useMemo(() => {
        const filterLower = filterBy.toLowerCase();
        const identifier = formatBusIdentifierShort(bus.type, bus.number) || '';
        return !bus.type.toLowerCase().includes(filterLower)
            && !name.toLowerCase().includes(filterLower)
            && !identifier.toLowerCase().includes(filterLower);
    }, [bus.type, bus.number, filterBy, name]);

    useEffect(() => {
        if (!hide) filtered.current.push(bus.id);
        else filtered.current = filtered.current.filter(id => id !== bus.id);
    }, [hide, bus.id, filtered]);

    useListFilterVisibility(bus.id, hide);

    if (hide) return null;

    return (
        <SortableBusRow busId={bus.id} onEdit={onEdit} />
    );
};


const Elements = ({ filterBy, filtered, onEdit }) => {
    const { sortedBuses } = useFallbackBusesSorted();

    return sortedBuses.map(s => (
        <Element
            key={s.id}
            bus={s}
            filterBy={filterBy}
            filtered={filtered}
            onEdit={onEdit}
        />
    ));
};


const List = ({ filterBy, filtered, onEdit }) => (
    <ListFilterScope filterBy={filterBy}>
        <ListStack>
            <Elements filterBy={filterBy} filtered={filtered} onEdit={onEdit} />
        </ListStack>
    </ListFilterScope>
);


const ApplyFilteredMenu = ({ filtered }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { muteMany, unmuteMany } = useBusMuteMany();
    const { lowerMany } = useBusLevelLowerMany();

    const muteFilteredApply = useCallback(() => muteMany(filtered
        .current), [muteMany, filtered]);
    const unmuteFilteredApply = useCallback(() => unmuteMany(filtered
        .current), [unmuteMany, filtered]);
    const lowerFilteredApply = useCallback(() => lowerMany(filtered
        .current), [lowerMany, filtered]);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                variant="soft"
                color="gray"
                onClick={toggleOpened}
                aria-label={t('Apply to filtered')}
            >
                <MixerHorizontalIcon style={ICON_STYLE} />
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Apply to filtered') }</DropdownMenu.Label>
                <DropdownMenu.Item onSelect={muteFilteredApply} disabled={disabled}>
                    { t('Mute') }
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={unmuteFilteredApply} disabled={disabled}>
                    { t('Unmute') }
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={lowerFilteredApply} disabled={disabled}>
                    { t('Lower level') }
                </DropdownMenu.Item>
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const ResetMenu = () => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { colorsReset } = useFallbackBusColors();
    const { iconsReset } = useFallbackBusIcons();
    const { sortReset } = useFallbackBusesSorted();
    const { resetAll: namesReset } = useBusNameResetAll();
    const { resetAll: busesResetAll } = useBusResetAll();

    const resetAll = useCallback(async () => {
        colorsReset();
        iconsReset();
        sortReset();
        await busesResetAll();
    }, [colorsReset, iconsReset, sortReset, busesResetAll]);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                variant="soft"
                color="gray"
                onClick={toggleOpened}
                aria-label={t('Reset')}
            >
                <ResetIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Reset') }</DropdownMenu.Label>
                <Alert onAccept={namesReset}>
                    {doOpen => (
                        <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
                            { t('Names') }
                        </DropdownMenu.Item>
                    )}
                </Alert>
                <Alert onAccept={colorsReset}>
                    {doOpen => (
                        <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
                            { t('Colors') }
                        </DropdownMenu.Item>
                    )}
                </Alert>
                <Alert onAccept={iconsReset}>
                    {doOpen => (
                        <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
                            { t('Icons') }
                        </DropdownMenu.Item>
                    )}
                </Alert>
                <Alert onAccept={sortReset}>
                    {doOpen => (
                        <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
                            { t('Order') }
                        </DropdownMenu.Item>
                    )}
                </Alert>
                <Alert onAccept={resetAll} accept={t('Restore all buses')}>
                    {doOpen => (
                        <DropdownMenu.Item onSelect={doOpen} disabled={disabled}>
                            { t('All', 'singular') }
                        </DropdownMenu.Item>
                    )}
                </Alert>
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


// Exported
export default () => {
    const { t } = useLanguage();
    const { sortedBuses, sortUpdate } = useFallbackBusesSorted();

    const [filterBy, setFilterBy] = useState('');
    const filtered = useRef([]);

    const [busIdEditing, setBusIdEditing] = useState(null);
    const onEditClose = useCallback(() => { setBusIdEditing(null); }, []);
    const onEdit = useCallback(busId => setBusIdEditing(busId), []);

    useListHeaderTrail(t('Buses'));

    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 100,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    const onDragEnd = useCallback((e) => {
        sortUpdate(e.over ? e.over.id : null, e.active.id);
    }, [sortUpdate]);

    return (
        <>
            {busIdEditing !== null && (
                <Edit busId={busIdEditing} open onOpenChange={onEditClose} />
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
                        <ApplyFilteredMenu filtered={filtered} />
                    </ListFilterActions>
                </ListFilterBar>
                <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                    <SortableContext items={sortedBuses}>
                        <List filterBy={filterBy} filtered={filtered} onEdit={onEdit} />
                    </SortableContext>
                </DndContext>
                <ListFooter reset={<ResetMenu />} />
            </ListPageShell>
        </>
    );
};
