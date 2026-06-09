// Requirements
import { useCallback, useState } from 'react';
import { useBusOptions, useDevice } from '@magical-mixing/mixers-react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import ResetIcon from '../../../components/base/resetIcon';
import { FallbackBusDcaOn, FallbackBusDcaUnassignAllOf } from '../../../components/fallback';
import { ICON_STYLE } from '../../../helpers/values';
import ListStack from '../../../components/layout/list/stack';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { Alert } from '../../../components/base/alert';
import { BusIconNameLabeled } from '../../bus/view/name';
import BusRow from './busRow';
import { DropdownMenuContent } from './../../../components/base/dropdownMenuContent';


// Internal
const BusAddOption = ({ busId, dcaId }) => (
    <FallbackBusDcaOn busId={busId} dcaId={dcaId}>
        {({ has, value, set }) => {
            if (!has || value) return null;
            return (
                <DropdownMenu.Item onSelect={() => set(true)}>
                    <BusIconNameLabeled busId={busId} size="2" />
                </DropdownMenu.Item>
            );
        }}
    </FallbackBusDcaOn>
);


const AddBuses = ({ dcaId }) => {
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
                    <BusAddOption key={o.id} busId={o.id} dcaId={dcaId} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const ResetBuses = ({ dcaId }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    return (
        <FallbackBusDcaUnassignAllOf dcaId={dcaId}>
            {({ unassignAllOf }) => (
                <Alert
                    onAccept={unassignAllOf}
                    accept={t('Unassign all')}
                    title={t('Unassign all buses?')}
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
            )}
        </FallbackBusDcaUnassignAllOf>
    );
};


const Evaluate = ({ busId, dcaId }) => (
    <FallbackBusDcaOn busId={busId} dcaId={dcaId}>
        {({ has, value }) => (has && value ? <BusRow busId={busId} dcaId={dcaId} /> : null)}
    </FallbackBusDcaOn>
);


const List = ({ dcaId }) => {
    const { options } = useBusOptions();

    return (
        <Flex direction="column" flexGrow="1" minHeight="0" width="100%" className="mmc-scroll-y" gap="3">
            <ListStack>
                {options.map(o => (
                    <Evaluate key={o.id} busId={o.id} dcaId={dcaId} />
                ))}
            </ListStack>
            <Flex align="center" justify="end" gap="1">
                <ResetBuses dcaId={dcaId} />
                <AddBuses dcaId={dcaId} />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ dcaId }) => <List dcaId={dcaId} />;
