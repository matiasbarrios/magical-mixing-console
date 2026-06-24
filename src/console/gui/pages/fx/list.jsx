// Requirements
import {
    useMemo, useState,
} from 'react';
import { IconButton } from '@radix-ui/themes';
import { useDevice, useFxOptions, useFxResetAll } from '@magical-mixing/mixers-react';
import { RESET_ROAM_ID, focusRoamAttrs } from '../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../components/base/resetIcon';
import ListStack from '../../components/layout/list/stack';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import { ListFilterScope, useListFilterVisibility } from '../../components/layout/list/filterEmpty';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { Alert } from '../../components/base/alert';
import { useFxNameTranslated } from './view/name';
import { useFxTypeName } from './view/type';
import ListRow from './listRow';


// Internal
const ListToolbarActions = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const { resetAll } = useFxResetAll();

    return (
        <Alert onAccept={resetAll} accept={t('Restore all FX')}>
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Restore all FX')}
                    {...focusRoamAttrs(RESET_ROAM_ID)}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


const Element = ({ fxId, filterBy }) => {
    const { name } = useFxNameTranslated(fxId);
    const { name: typeName } = useFxTypeName(fxId);
    const hide = useMemo(() => {
        const filterLower = filterBy.toLowerCase();
        return !name.toLowerCase().includes(filterLower)
            && !(typeName?.toLowerCase().includes(filterLower) ?? false);
    }, [name, typeName, filterBy]);

    useListFilterVisibility(fxId, hide);

    if (hide) return null;

    return <ListRow fxId={fxId} />;
};


const Elements = ({ filterBy }) => {
    const { options } = useFxOptions();

    return options.map(i => (
        <Element
            key={i.id}
            fxId={i.id}
            filterBy={filterBy}
        />
    ));
};


const List = ({ filterBy }) => (
    <ListFilterScope filterBy={filterBy}>
        <ListStack>
            <Elements filterBy={filterBy} />
        </ListStack>
    </ListFilterScope>
);


// Exported
export default () => {
    const { t } = useLanguage();

    const [filterBy, setFilterBy] = useState('');

    useListHeaderTrail(t('FXs'));

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
                <ListFilterActions>
                    <ListToolbarActions />
                </ListFilterActions>
            </ListFilterBar>
            <List filterBy={filterBy} />
        </ListPageShell>
    );
};
