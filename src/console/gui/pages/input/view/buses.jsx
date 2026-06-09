// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    useBusInputId, useBusOptions, useDevice,
    useInputBusAssignmentsReset, useOutputResetAllWithSource,
} from '@magical-mixing/mixers-react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import ResetIcon from '../../../components/base/resetIcon';
import { ICON_STYLE } from '../../../helpers/values';
import { useLanguage } from '../../../components/language';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../components/base/labelControlTable';
import { useUiSize } from '../../../components/theme';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { Alert } from '../../../components/base/alert';
import { BusIconNameLabeled } from '../../bus/view/name';
import BusRow from './busRow';
import { DropdownMenuContent } from './../../../components/base/dropdownMenuContent';


// Internal
const BusAddOption = ({ busId, inputId }) => {
    const {
        has, value, set, get,
    } = useBusInputId(busId);

    const isOption = useMemo(() => !!get(inputId), [get, inputId]);
    const assigned = useMemo(() => value === inputId, [value, inputId]);

    const onSelect = useCallback(() => {
        set(inputId);
    }, [set, inputId]);

    if (!has || !isOption || assigned) return null;

    return (
        <DropdownMenu.Item onSelect={onSelect}>
            <BusIconNameLabeled busId={busId} size="2" />
        </DropdownMenu.Item>
    );
};


const AddBuses = ({ inputId }) => {
    const { t } = useLanguage();
    const { options } = useBusOptions();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    if (!options.length) return null;

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger variant="soft" color="gray" onClick={toggleOpened}>
                <PlusIcon style={ICON_STYLE} />
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Add') }</DropdownMenu.Label>
                {options.map(o => (
                    <BusAddOption key={o.id} busId={o.id} inputId={inputId} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const ResetAssignments = ({ inputId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset: resetBuses } = useInputBusAssignmentsReset(inputId);
    const { reset: resetOutputs } = useOutputResetAllWithSource('input', inputId);

    const doReset = useCallback(async () => {
        await resetBuses();
        await resetOutputs();
    }, [resetBuses, resetOutputs]);

    return (
        <Alert
            onAccept={doReset}
            accept={t('Unassign all')}
            title={t('Unassign all assignments?')}
            description={t('Removes all bus and output assignments from this input. This cannot be undone.')}
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


const BusEvaluator = ({ busId, inputId, children }) => {
    const {
        has, value, get,
    } = useBusInputId(busId);

    const isOption = useMemo(() => !!get(inputId), [get, inputId]);
    const assigned = useMemo(() => value === inputId, [value, inputId]);

    if (!has || !isOption || !assigned) return null;

    return children;
};


const Evaluate = ({ busId, inputId }) => (
    <BusEvaluator busId={busId} inputId={inputId}>
        <BusRow busId={busId} inputId={inputId} />
    </BusEvaluator>
);


const List = ({ inputId }) => {
    const { options } = useBusOptions();

    return (
        <Flex direction="column" flexGrow="1" minHeight="0" width="100%" className="mmc-scroll-y" gap="3">
            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                {options.map(o => (
                    <Evaluate key={o.id} busId={o.id} inputId={inputId} />
                ))}
            </LabelControlTable.List>
            <Flex align="center" justify="end" gap="1">
                <ResetAssignments inputId={inputId} />
                <AddBuses inputId={inputId} />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ inputId }) => <List inputId={inputId} />;
