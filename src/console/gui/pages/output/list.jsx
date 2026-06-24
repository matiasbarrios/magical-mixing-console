// Requirements
import {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
    Button, Dialog, Flex, IconButton, Text,
} from '@radix-ui/themes';
import {
    useDevice, useOutputOptions, useOutputResetAll, useOutputTapOptions, useOutputTapSetMany,
} from '@magical-mixing/mixers-react';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { RESET_ROAM_ID, focusRoamAttrs } from '../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../components/base/resetIcon';
import { ICON_STYLE } from '../../helpers/values';
import ListStack from '../../components/layout/list/stack';
import { useLanguage } from '../../components/language';
import { useUiSize } from '../../components/theme';
import { useScreen } from '../../components/base/screen';
import ListPageShell from '../../components/layout/list/shell';
import { useListHeaderTrail } from '../../components/layout/headerTrail/hooks/useHeaderTrail';
import TextFieldErasable from '../../components/base/textFieldErasable';
import { ListFilterBar, ListFilterTitle, ListFilterActions } from '../../components/layout/list/filterBar';
import { ListFilterScope, useListFilterVisibility } from '../../components/layout/list/filterEmpty';
import DialogHeader from '../../components/base/dialogHeader';
import { Alert } from '../../components/base/alert';
import { DropdownSelect } from '../../components/base/dropdownSelect';
import {
    Label, LabelControlTable, LABEL_CONTROL_CLASS, LABEL_WIDTH,
} from '../../components/base/labelControlTable';
import { useOutputNameTranslated } from './view/name';
import ListRow from './listRow';


// Internal
const TapEditFiltered = ({ open, onOpenChange, filtered }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { options } = useOutputTapOptions();
    const { setMany } = useOutputTapSetMany();

    const [tap, setTap] = useState(options[0].id);

    const selectedOption = useMemo(() => options.find(o => o.id === tap), [options, tap]);

    const displayValue = useMemo(() => (selectedOption ? t(selectedOption.name) : ''),
        [selectedOption, t]);

    const edit = useCallback(() => {
        setMany(tap, filtered.current);
        onOpenChange(false);
    }, [onOpenChange, tap, filtered, setMany]);

    if (tap === undefined) return null;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content aria-describedby={undefined}>
                <DialogHeader>
                    { t('Edit filtered') }
                </DialogHeader>
                <Flex direction="column" gapY="3">
                    <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                        <LabelControlTable.Row>
                            <LabelControlTable.Cell width={LABEL_WIDTH}>
                                <Label>
                                    { t('Tap') }
                                </Label>
                            </LabelControlTable.Cell>
                            <LabelControlTable.Cell>
                                <Flex align="center" justify="end" width="100%" minWidth="0">
                                    {disabled ? (
                                        <Button size={textSize} variant="soft" color="gray" disabled>
                                            <Text size="1" wrap="nowrap">{ displayValue }</Text>
                                        </Button>
                                    ) : (
                                        <DropdownSelect.Root set={setTap}>
                                            <DropdownSelect.Trigger square size={textSize} variant="soft" color="gray">
                                                <Text size="1" wrap="nowrap">{ displayValue }</Text>
                                            </DropdownSelect.Trigger>
                                            <DropdownSelect.Content>
                                                <DropdownSelect.Label>{ t('Tap') }</DropdownSelect.Label>
                                                {options.map(o => (
                                                    <DropdownSelect.Option
                                                        key={o.id}
                                                        id={o.id}
                                                        selected={tap === o.id}
                                                    >
                                                        <Text size="2">{ t(o.name) }</Text>
                                                    </DropdownSelect.Option>
                                                ))}
                                            </DropdownSelect.Content>
                                        </DropdownSelect.Root>
                                    )}
                                </Flex>
                            </LabelControlTable.Cell>
                        </LabelControlTable.Row>
                    </LabelControlTable.List>
                    <Flex align="center" justify="end" gapX="1">
                        <Button size={textSize} variant="soft" color="blue" onClick={edit} disabled={disabled}>
                            { t('Edit') }
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};


const FilterToolbar = ({ filtered }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    const [openedTapEditFiltered, setOpenedTapEditFiltered] = useState(false);
    const openTapEditFiltered = useCallback(() => setOpenedTapEditFiltered(true), []);

    return (
        <>
            <IconButton
                size={textSize}
                variant="soft"
                color="gray"
                radius="full"
                onClick={openTapEditFiltered}
                disabled={disabled}
                aria-label={t('Edit filtered')}
            >
                <MixerHorizontalIcon style={ICON_STYLE} />
            </IconButton>
            <TapEditFiltered
                open={openedTapEditFiltered}
                onOpenChange={setOpenedTapEditFiltered}
                filtered={filtered}
            />
        </>
    );
};


const ListToolbarActions = () => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { disabled } = useDevice();
    const { resetAll } = useOutputResetAll();

    return (
        <Alert onAccept={resetAll} accept={t('Restore all outputs')}>
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Restore all outputs')}
                    {...focusRoamAttrs(RESET_ROAM_ID)}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


const Element = ({
    outputId, filterBy, filtered, inlineSource,
}) => {
    const { translateOption } = useLanguage();
    const { get } = useOutputOptions();
    const { name } = useOutputNameTranslated(outputId);
    const option = useMemo(() => get(outputId), [get, outputId]);
    const identifier = useMemo(() => translateOption(option), [translateOption, option]);
    const hide = useMemo(() => {
        const filterLower = filterBy.toLowerCase();
        return !name.toLowerCase().includes(filterLower)
            && !identifier.toLowerCase().includes(filterLower);
    }, [name, identifier, filterBy]);

    useEffect(() => {
        if (!hide) filtered.current.push(outputId);
        else filtered.current = filtered.current.filter(id => id !== outputId);
    }, [hide, outputId, filtered]);

    useListFilterVisibility(outputId, hide);

    if (hide) return null;

    return (
        <ListRow
            outputId={outputId}
            inlineSource={inlineSource}
        />
    );
};


const Elements = ({
    filterBy, filtered, inlineSource,
}) => {
    const { options } = useOutputOptions();

    return options.map(o => (
        <Element
            key={o.id}
            outputId={o.id}
            filterBy={filterBy}
            filtered={filtered}
            inlineSource={inlineSource}
        />
    ));
};


const List = () => {
    const { t } = useLanguage();
    const { md, lg, xl } = useScreen();
    const inlineSource = md || lg || xl;

    const [filterBy, setFilterBy] = useState('');
    const filtered = useRef([]);

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
                    <FilterToolbar filtered={filtered} />
                    <ListToolbarActions />
                </ListFilterActions>
            </ListFilterBar>
            <ListFilterScope filterBy={filterBy}>
                <ListStack>
                    <Elements
                        filterBy={filterBy}
                        filtered={filtered}
                        inlineSource={inlineSource}
                    />
                </ListStack>
            </ListFilterScope>
        </ListPageShell>
    );
};


// Exported
export default () => {
    const { t } = useLanguage();

    useListHeaderTrail(t('Outputs'));

    return <List />;
};
