// Requirements
import { useCallback, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { ADD_ROAM_ID, REMOVE_ROAM_ID, focusRoamAttrs } from '../../../helpers/hotkeys/focusRoam';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import {
    FallbackBusDcaOn, useFallbackBusDca, useFallbackDcaOptions,
} from '../../../components/fallback';
import { ICON_STYLE } from '../../../helpers/values';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { DcaIconName, DcaIconNameLink } from '../../dca/view/name';
import { DropdownMenuContent } from './../../../components/base/dropdownMenuContent';


// Internal
const DcaAddOption = ({ busId, dcaId }) => (
    <FallbackBusDcaOn busId={busId} dcaId={dcaId}>
        {({ has, value, set }) => {
            if (!has || value) return null;
            return (
                <DropdownMenu.Item onSelect={() => set(true)}>
                    <DcaIconName dcaId={dcaId} size="1" />
                </DropdownMenu.Item>
            );
        }}
    </FallbackBusDcaOn>
);


const AddDcas = ({ busId }) => {
    const { t } = useLanguage();
    const { options } = useFallbackDcaOptions();

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
                    <DcaAddOption key={o.id} busId={busId} dcaId={o.id} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const UnassignDca = ({ set }) => {
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
            aria-label={t('Unassign DCA')}
            {...focusRoamAttrs(REMOVE_ROAM_ID)}
        >
            <MinusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


const DcaRow = ({ dcaId, set }) => {
    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0">
                <DcaIconNameLink dcaId={dcaId} size="1" />
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            <Flex
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <UnassignDca set={set} />
            </Flex>
        </Flex>
    );
};


const Evaluate = ({ dcaId, busId }) => (
    <FallbackBusDcaOn busId={busId} dcaId={dcaId}>
        {({ has, value, set }) => (has && value ? <DcaRow dcaId={dcaId} set={set} /> : null)}
    </FallbackBusDcaOn>
);


const DcaTab = ({ busId }) => {
    const { options } = useFallbackDcaOptions();

    return (
        <Flex direction="column" gapY="3" width="100%">
            {options.map(o => <Evaluate key={o.id} dcaId={o.id} busId={busId} />)}
            <Flex align="center" justify="end" gap="1">
                <AddDcas busId={busId} />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busId }) => {
    const { has } = useFallbackBusDca(busId);
    if (!has) return null;
    return <DcaTab busId={busId} />;
};
