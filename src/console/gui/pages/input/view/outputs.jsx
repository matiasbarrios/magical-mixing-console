// Requirements
import { useCallback, useMemo, useState } from 'react';
import {
    useOutputOptions, useOutputResetAllWithSource,
    useDevice, useOutputSource,
} from '@magical-mixing/mixers-react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { ADD_ROAM_ID, RESET_ROAM_ID, focusRoamAttrs } from '../../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../../components/base/resetIcon';
import { ICON_STYLE } from '../../../helpers/values';
import { useLanguage } from '../../../components/language';
import {
    LabelControlTable, LABEL_CONTROL_CLASS,
} from '../../../components/base/labelControlTable';
import { useUiSize } from '../../../components/theme';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { Alert } from '../../../components/base/alert';
import { useOutputNameTranslated } from '../../output/view/name';
import OutputRow from './outputRow';
import { DropdownMenuContent } from './../../../components/base/dropdownMenuContent';


// Internal
const OutputAddOption = ({ outputId, inputId }) => {
    const { name } = useOutputNameTranslated(outputId);
    const {
        has, value, set, options,
    } = useOutputSource(outputId);

    const sourceOption = useMemo(() => options
        .find(o => o.type === 'input' && o.externalId === inputId), [options, inputId]);

    const assigned = useMemo(() => (
        has && sourceOption && value === sourceOption.id
    ), [has, sourceOption, value]);

    const assign = useCallback(() => {
        if (sourceOption) set(sourceOption.id);
    }, [set, sourceOption]);

    if (!sourceOption || assigned) return null;

    return (
        <DropdownMenu.Item onSelect={assign}>
            { name }
        </DropdownMenu.Item>
    );
};


const AddOutputs = ({ inputId }) => {
    const { t } = useLanguage();
    const { options } = useOutputOptions();

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    if (!options.length) return null;

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenuTrigger
                variant="soft"
                color="gray"
                onClick={toggleOpened}
                {...focusRoamAttrs(ADD_ROAM_ID)}
            >
                <PlusIcon style={ICON_STYLE} />
            </DropdownMenuTrigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Label>{ t('Add') }</DropdownMenu.Label>
                {options.map(o => (
                    <OutputAddOption key={o.id} outputId={o.id} inputId={inputId} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const ResetOutputs = ({ inputId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();
    const { reset } = useOutputResetAllWithSource('input', inputId);

    return (
        <Alert
            onAccept={reset}
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
                    {...focusRoamAttrs(RESET_ROAM_ID)}
                >
                    <ResetIcon />
                </IconButton>
            )}
        </Alert>
    );
};


const Evaluate = ({ outputId, inputId }) => (
    <OutputRow outputId={outputId} inputId={inputId} />
);


const List = ({ inputId }) => {
    const { options } = useOutputOptions();

    return (
        <Flex direction="column" gapY="3" width="100%">
            <LabelControlTable.List className={LABEL_CONTROL_CLASS}>
                {options.map(o => (
                    <Evaluate key={o.id} outputId={o.id} inputId={inputId} />
                ))}
            </LabelControlTable.List>
            <Flex align="center" justify="end" gap="1">
                <ResetOutputs inputId={inputId} />
                <AddOutputs inputId={inputId} />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ inputId }) => <List inputId={inputId} />;
