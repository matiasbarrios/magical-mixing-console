// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    useBusAddableOutputs,
    useDevice,
    useOutputOptions,
    useOutputReset,
    useOutputResetAllWithSource,
    useOutputSource,
    useOutputSourceDefault,
    useOutputTap,
} from '@magical-mixing/mixers-react';
import {
    DropdownMenu, Flex, IconButton, Text,
} from '@radix-ui/themes';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import ResetIcon from '../../../components/base/resetIcon';
import { Label } from '../../../components/base/labelControlTable';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { useOutputNameTranslated } from '../../output/view/name';
import { TapDropdown } from '../../output/view/tap';
import { ucFirst } from '../../../helpers/format';
import { ICON_STYLE } from '../../../helpers/values';
import ListStack from '../../../components/layout/list/stack';
import Volume from '../../output/view/volume';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { Alert } from '../../../components/base/alert';
import { DropdownMenuContent, DropdownMenuSubContent } from './../../../components/base/dropdownMenuContent';


// Internal
const OutputHasBusAsSource = ({ outputId, busId }) => {
    const { name } = useOutputNameTranslated(outputId);
    const {
        has, value, set, options, get,
    } = useOutputSource(outputId);

    const outputHasBusAsSourceOption = useMemo(() => options
        .find(o => o.type === 'bus' && o.externalId === busId), [options, busId]);

    const sourceAssigned = useMemo(() => get(value), [get, value]);
    const on = useMemo(() => (has && sourceAssigned?.type === 'bus'
        && sourceAssigned?.externalId === busId), [has, sourceAssigned, busId]);

    const assign = useCallback(() => {
        set(outputHasBusAsSourceOption.id);
    }, [set, outputHasBusAsSourceOption]);

    if (!outputHasBusAsSourceOption || on) return null;

    return (
        <DropdownMenu.Item onSelect={assign}>
            { name }
        </DropdownMenu.Item>
    );
};


const OutputsPerType = ({ type, busId, outputs }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();

    const elements = useMemo(() => outputs.filter(e => e.type === type), [outputs, type]);

    if (!elements.length) return null;

    if (elements.length === 1) {
        return (
            <OutputHasBusAsSource outputId={elements[0].id} busId={busId} />
        );
    }

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger disabled={disabled}>
                { t(ucFirst(type)) }
            </DropdownMenu.SubTrigger>
            <DropdownMenuSubContent size="2">
                {elements.map(e => (
                    <OutputHasBusAsSource key={e.id} outputId={e.id} busId={busId} />
                ))}
            </DropdownMenuSubContent>
        </DropdownMenu.Sub>
    );
};


const AddOutputs = ({ busId }) => {
    const { t } = useLanguage();
    const { outputs, types } = useBusAddableOutputs(busId);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    if (!outputs.length) return null;

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger variant="soft" color="gray" onClick={toggleOpened}>
                <PlusIcon style={ICON_STYLE} />
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Add') }</DropdownMenu.Label>
                {types.map(type => (
                    <OutputsPerType key={type} type={type} busId={busId} outputs={outputs} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const ResetOutputs = ({ busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useOutputResetAllWithSource('bus', busId);

    return (
        <Alert
            onAccept={reset}
            accept={t('Reset')}
            title={t('Assign default outputs?')}
            description={t('Resets all outputs assigned to this bus to their default source and tap. This cannot be undone.')}
        >
            {doOpen => (
                <IconButton
                    variant="soft"
                    color="gray"
                    size={textSize}
                    radius="full"
                    onClick={doOpen}
                    disabled={disabled}
                    aria-label={t('Reset')}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


const UnassignOutput = ({ outputId, busId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useOutputReset(outputId);
    const defaultSource = useOutputSourceDefault(outputId);

    const canUnassign = useMemo(() => !(
        defaultSource?.type === 'bus' && defaultSource?.externalId === busId
    ), [defaultSource, busId]);

    if (!canUnassign) return null;

    return (
        <IconButton
            variant="soft"
            color="gray"
            size={textSize}
            radius="full"
            onClick={reset}
            disabled={disabled}
            aria-label={t('Unassign output')}
        >
            <MinusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


const OutputRow = ({ outputId, busId }) => {
    const { name } = useOutputNameTranslated(outputId);
    const { has: tapHas } = useOutputTap(outputId);
    const { t } = useLanguage();

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const levelTrackStart = useMemo(() => (
        <Text size="1" color="gray" wrap="nowrap">
            { t('Level') }
        </Text>
    ), [t]);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0" minWidth="0">
                {tapHas ? (
                    <TapDropdown outputId={outputId} label={name} fillWidth />
                ) : (
                    <Label>{ name }</Label>
                )}
            </Flex>
            <Flex
                flexGrow="1"
                minWidth="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <Volume outputId={outputId} minWidth="0" fullWidth trackStart={levelTrackStart} />
            </Flex>
            <Flex
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <UnassignOutput outputId={outputId} busId={busId} />
            </Flex>
        </Flex>
    );
};


const Evaluate = ({ outputId, busId }) => {
    const { has, value, get } = useOutputSource(outputId);

    const source = useMemo(() => get(value), [get, value]);

    if (!has || value === undefined || source?.type !== 'bus' || source?.externalId !== busId) return null;

    return <OutputRow outputId={outputId} busId={busId} />;
};


// Exported
export default ({ busId }) => {
    const { options } = useOutputOptions();

    return (
        <Flex direction="column" gapY="3" width="100%">
            <ListStack>
                {options.map(b => <Evaluate key={b.id} outputId={b.id} busId={busId} />)}
            </ListStack>
            <Flex align="center" justify="end" gap="1">
                <ResetOutputs busId={busId} />
                <AddOutputs busId={busId} />
            </Flex>
        </Flex>
    );
};
