// Requirements
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    DropdownMenu, Flex, Text,
} from '@radix-ui/themes';
import { DotsVerticalIcon, LinkBreak2Icon } from '@radix-ui/react-icons';
import { useDevice } from '@magical-mixing/mixers-react';
import Avatar from '../../../devices/avatar';
import { useLanguage } from '../../../language';
import { useDevices } from '../../../devices/context';
import { noPointerDown } from '../../../../helpers/behaviour';
import { ICON_STYLE } from '../../../../helpers/values';
import { HeaderIconButton } from '../iconButton';
import Buses from './buses';
import Other from './other';
import Groups from './groups';
import Footer from './footer';
import App from './app';
import Help from './help';
import Reset from './reset';
import { DropdownMenuContent, DropdownMenuSubContent } from './../../../base/dropdownMenuContent';


// Constants
const modelStyle = {
    objectFit: 'cover',
    borderRadius: 'var(--radius-2)',
    width: '24px',
    height: '24px',
};


// Internal
const Device = ({ model, name, hideIcon }) => (
    <Flex align="center" gapX="2">
        {!hideIcon && <Avatar model={model} style={modelStyle} />}
        <Text size="2" wrap="nowrap">{ name }</Text>
    </Flex>
);


// Exported
export default () => {
    const navigate = useNavigate();
    const {
        devices, focused, focus, deviceRemove,
    } = useDevices();
    const { model, name, disabled } = useDevice();
    const { t } = useLanguage();

    const focusedUnselect = useCallback(() => {
        deviceRemove(focused);
        navigate('/');
    }, [deviceRemove, focused, navigate]);

    const otherDevices = useMemo(() => devices
        .filter(d => d.deviceId !== focused?.deviceId), [devices, focused]);

    const deviceSelect = useCallback(d => () => {
        if (focused?.deviceId !== d.deviceId) {
            focus(d);
        }
        navigate('/');
    }, [focus, focused, navigate]);

    const goTo = useCallback(where => () => {
        navigate(where);
    }, [navigate]);

    const [opened, setOpened] = useState(false);
    const toggleOpened = useCallback(() => setOpened(o => !o), []);

    return (
        <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
            <DropdownMenu.Trigger asChild>
                <HeaderIconButton onPointerDown={noPointerDown} onClick={toggleOpened}>
                    <DotsVerticalIcon style={ICON_STYLE} />
                </HeaderIconButton>
            </DropdownMenu.Trigger>
            <DropdownMenuContent size="2">
                <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                        <Flex align="center" gapX="2">
                            {disabled && <LinkBreak2Icon style={ICON_STYLE} color="red" />}
                            <Device model={model} name={name} hideIcon={disabled} />
                        </Flex>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenuSubContent size="2">
                        <DropdownMenu.Item onSelect={goTo('/settings/device')} disabled={disabled}>
                            { t('Settings') }
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={focusedUnselect}>
                            { t('Disconnect') }
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <Reset />
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item onSelect={goTo('/device/connect')}>
                            { t('Search another device') }
                        </DropdownMenu.Item>
                        {!!otherDevices.length && <DropdownMenu.Separator />}
                        {otherDevices.map(d => (
                            <DropdownMenu.Item onSelect={deviceSelect(d)} key={d.deviceId}>
                                <Device model={d.model} name={d.name} />
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <Buses />
                <DropdownMenu.Separator />
                <Groups />
                <DropdownMenu.Separator />
                <Other />
                <DropdownMenu.Separator />
                <Footer />
                <App />
                <DropdownMenu.Separator />
                <Help />
            </DropdownMenuContent>
        </DropdownMenu.Root>
    );
};
