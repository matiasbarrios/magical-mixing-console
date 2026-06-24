// Requirements
import { useCallback, useState } from 'react';
import { useBusOptions, useDevice } from '@magical-mixing/mixers-react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import {
    ADD_ROAM_ID, REMOVE_ROAM_ID, RESET_ROAM_ID, focusRoamAttrs,
} from '../../../../helpers/hotkeys/focusRoam';
import ResetIcon from '../../../../components/base/resetIcon';
import { FallbackBusDcaOn, FallbackBusDcaUnassignAllOf } from '../../../../components/fallback';
import { ICON_STYLE } from '../../../../helpers/values';
import { useLanguage } from '../../../../components/language';
import { useUiSize } from '../../../../components/theme';
import { DropdownMenuTrigger } from '../../../../components/base/dropdownMenuTrigger';
import { Alert } from '../../../../components/base/alert';
import { BusIconNameLabeled } from '../../../bus/view/name';
import Solo from '../../../bus/view/solo';
import Mute from '../../../bus/view/mute';
import { DropdownMenuContent } from '../../../../components/base/dropdownMenuContent';


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


export const UnassignBus = ({ set }) => {
    const { t } = useLanguage();
    const { disabled } = useDevice();
    const { textSize } = useUiSize();

    return (
        <IconButton
            variant="soft"
            color="gray"
            size={textSize}
            radius="full"
            onClick={() => set(false)}
            disabled={disabled}
            aria-label={t('Unassign bus')}
            {...focusRoamAttrs(REMOVE_ROAM_ID)}
        >
            <MinusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


export const BusActions = ({
    busId, onHas, on, set, stacked = false,
}) => {
    if (!onHas) return null;

    return (
        <Flex
            direction={stacked ? 'column' : 'row'}
            align="center"
            gap={stacked ? '1' : undefined}
            gapX={stacked ? undefined : '1'}
            flexShrink="0"
        >
            {on && <Solo busId={busId} />}
            {on && <Mute busId={busId} />}
            {!stacked && <UnassignBus set={set} />}
        </Flex>
    );
};


export const AddBuses = ({ dcaId }) => {
    const { t } = useLanguage();
    const { options } = useBusOptions();

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
                    <BusAddOption key={o.id} busId={o.id} dcaId={dcaId} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


export const ResetBuses = ({ dcaId }) => {
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
                            {...focusRoamAttrs(RESET_ROAM_ID)}
                        >
                            <ResetIcon />
                        </IconButton>
                    )}
                </Alert>
            )}
        </FallbackBusDcaUnassignAllOf>
    );
};


export const BusEvaluator = ({ busId, dcaId, children }) => (
    <FallbackBusDcaOn busId={busId} dcaId={dcaId}>
        {({ has, value, set }) => (has && value ? children({ onHas: has, on: value, set }) : null)}
    </FallbackBusDcaOn>
);
