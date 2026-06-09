// Requirements
import { useCallback, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import {
    DropdownMenu, Flex, IconButton,
} from '@radix-ui/themes';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { FallbackBusMgOn, useFallbackBusMg, useFallbackMgOptions } from '../../../components/fallback';
import { ICON_STYLE } from '../../../helpers/values';
import ListStack from '../../../components/layout/list/stack';
import { DropdownMenuTrigger } from '../../../components/base/dropdownMenuTrigger';
import { MgFinalName } from '../../mg/view/name';
import ViewMg from '../../mg/view/openMg';
import { DropdownMenuContent } from './../../../components/base/dropdownMenuContent';


// Internal
const MgAddOption = ({ busId, mgId }) => (
    <FallbackBusMgOn busId={busId} mgId={mgId}>
        {({ has, value, set }) => {
            if (!has || value) return null;
            return (
                <DropdownMenu.Item onSelect={() => set(true)}>
                    <MgFinalName mgId={mgId} />
                </DropdownMenu.Item>
            );
        }}
    </FallbackBusMgOn>
);


const AddMgs = ({ busId }) => {
    const { t } = useLanguage();
    const { options } = useFallbackMgOptions();

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
                    <MgAddOption key={o.id} busId={busId} mgId={o.id} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};


const UnassignMg = ({ set }) => {
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
            aria-label={t('Unassign mute group')}
        >
            <MinusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


const MgRow = ({ mgId, set }) => {
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
                <ViewMg mgId={mgId} />
            </Flex>
            <Flex flexGrow="1" minWidth="0" />
            <Flex
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <UnassignMg set={set} />
            </Flex>
        </Flex>
    );
};


const Evaluate = ({ mgId, busId }) => (
    <FallbackBusMgOn busId={busId} mgId={mgId}>
        {({ has, value, set }) => (has && value ? <MgRow mgId={mgId} set={set} /> : null)}
    </FallbackBusMgOn>
);


const MgTab = ({ busId }) => {
    const { options } = useFallbackMgOptions();

    return (
        <Flex direction="column" gapY="3" width="100%">
            <ListStack>
                {options.map(o => <Evaluate key={o.id} mgId={o.id} busId={busId} />)}
            </ListStack>
            <Flex align="center" justify="end" gap="1">
                <AddMgs busId={busId} />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busId }) => {
    const { has } = useFallbackBusMg(busId);
    if (!has) return null;
    return <MgTab busId={busId} />;
};
