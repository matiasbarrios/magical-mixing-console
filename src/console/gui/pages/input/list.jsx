// Requirements
import {
    useMemo, useState,
} from 'react';
import { IconButton } from '@radix-ui/themes';
import { useDevice, useInputOptions, useInputResetAll } from '@magical-mixing/mixers-react';
import { RESET_ROAM_ID, focusRoamAttrs } from '../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../components/base/resetIcon';
import ListStack from '../../components/layout/list/stack';
import { useLanguage } from '../../components/language';
import { useScreen } from '../../components/base/screen';
import { useUiSize } from '../../components/theme';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import { ListFilterScope, useListFilterVisibility } from '../../components/layout/list/filterEmpty';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { Alert } from '../../components/base/alert';
import { useInputNameTranslated } from './view/name';
import ListRow from './listRow';


// Internal
const ListToolbarActions = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const { resetAll } = useInputResetAll();

    return (
        <Alert onAccept={resetAll} accept={t('Restore all inputs')}>
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Restore all inputs')}
                    {...focusRoamAttrs(RESET_ROAM_ID)}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


const Element = ({ inputId, filterBy, inlineBuses }) => {
    const { translateOption } = useLanguage();
    const { get } = useInputOptions();
    const { name } = useInputNameTranslated(inputId);
    const option = useMemo(() => get(inputId), [get, inputId]);
    const identifier = useMemo(() => translateOption(option), [translateOption, option]);
    const hide = useMemo(() => {
        const filterLower = filterBy.toLowerCase();
        return !name.toLowerCase().includes(filterLower)
            && !identifier.toLowerCase().includes(filterLower);
    }, [name, identifier, filterBy]);

    useListFilterVisibility(inputId, hide);

    if (hide) return null;

    return <ListRow inputId={inputId} inlineBuses={inlineBuses} />;
};


const Elements = ({ filterBy, inlineBuses }) => {
    const { options } = useInputOptions();

    return options.map(i => (
        <Element
            key={i.id}
            inputId={i.id}
            filterBy={filterBy}
            inlineBuses={inlineBuses}
        />
    ));
};


const List = ({ filterBy, inlineBuses }) => (
    <ListFilterScope filterBy={filterBy}>
        <ListStack>
            <Elements filterBy={filterBy} inlineBuses={inlineBuses} />
        </ListStack>
    </ListFilterScope>
);


// Exported
export default () => {
    const { t } = useLanguage();
    const { xs } = useScreen();
    const inlineBuses = !xs;

    const [filterBy, setFilterBy] = useState('');

    useListHeaderTrail(t('Inputs'));

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
            <List filterBy={filterBy} inlineBuses={inlineBuses} />
        </ListPageShell>
    );
};
