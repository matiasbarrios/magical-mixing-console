
// Requirements
import {
    useMemo, useState,
} from 'react';
import { useSceneHas, useSceneOptions } from '@magical-mixing/mixers-react';
import ListStack from '../../components/layout/list/stack';
import { useLanguage } from '../../components/language';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import { ListFilterScope, useListFilterVisibility } from '../../components/layout/list/filterEmpty';
import { useSceneDefaultName, useSceneFinalName } from './view/name';
import ListDeviceRow from './listDeviceRow';


// Internal
const Element = ({ sceneId, filterBy }) => {
    const name = useSceneFinalName(sceneId);
    const identifier = useSceneDefaultName(sceneId);

    const hide = useMemo(() => {
        const filterLower = filterBy.toLowerCase();
        return !name.toLowerCase().includes(filterLower)
            && !identifier.toLowerCase().includes(filterLower);
    }, [name, identifier, filterBy]);

    useListFilterVisibility(sceneId, hide);

    if (hide) return null;

    return <ListDeviceRow sceneId={sceneId} />;
};


const Elements = ({ filterBy }) => {
    const { options } = useSceneOptions();

    return options.map(i => (
        <Element
            key={i.id}
            sceneId={i.id}
            filterBy={filterBy}
        />
    ));
};


const List = () => {
    const { t } = useLanguage();
    const [filterBy, setFilterBy] = useState('');

    useListHeaderTrail(t('Device scenes'));

    return (
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
                <ListFilterActions />
            </ListFilterBar>
            <ListFilterScope filterBy={filterBy}>
                <ListStack>
                    <Elements filterBy={filterBy} />
                </ListStack>
            </ListFilterScope>
        </ListPageShell>
    );
};


// Exported
export default () => {
    const { has } = useSceneHas();
    if (!has) return null;
    return <List />;
};
