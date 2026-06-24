// Requirements
import { AnimatePresence, motion } from 'motion/react';
import {
    Box, DropdownMenu, Flex, Heading, IconButton,
} from '@radix-ui/themes';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { noPointerDown } from '../../../helpers/behaviour';
import { ICON_STYLE } from '../../../helpers/values';
import { DropdownMenuContent } from '../../../components/base/dropdownMenuContent';


// Internal
const titles = {
    'waiting-for-network': 'No network connection',
    'connect-manually': 'Device',
    'devices-found': 'Devices found',
    searching: 'Searching devices',
};


// Exported
export default ({
    content,
    manualMode,
    demoRunning,
    opened,
    setOpened,
    toggleOpened,
    onSwitchToManual,
    onSwitchToSearch,
    onRunDemo,
    onStopDemo,
}) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    return (
        <Flex align="center" width="100%">
            <Box flexGrow="1" />
            <Flex justify="center" flexShrink="0">
                <AnimatePresence mode="wait">
                    {!!titles[content] && (
                        <motion.div
                            key={content}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Heading as="h3" size="4">{ t(titles[content]) }</Heading>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Flex>
            <Flex flexGrow="1" justify="end">
                <DropdownMenu.Root open={opened} onOpenChange={setOpened}>
                    <DropdownMenu.Trigger asChild>
                        <IconButton
                            variant="ghost"
                            radius="full"
                            color="gray"
                            m="2"
                            onPointerDown={noPointerDown}
                            onClick={toggleOpened}
                            size={textSize}
                        >
                            <DotsVerticalIcon style={ICON_STYLE} />
                        </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenuContent size="2">
                        {!manualMode && (
                            <DropdownMenu.Item onSelect={onSwitchToManual}>
                                { t('Specify IP and port') }
                            </DropdownMenu.Item>
                        )}
                        {manualMode && (
                            <DropdownMenu.Item onSelect={onSwitchToSearch}>
                                { t('Search') }
                            </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Separator />
                        {demoRunning ? (
                            <DropdownMenu.Item onSelect={onStopDemo}>
                                { t('Stop demo') }
                            </DropdownMenu.Item>
                        ) : (
                            <>
                                <DropdownMenu.Item onSelect={() => onRunDemo('x18')}>
                                    { t('Run X18 demo') }
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onSelect={() => onRunDemo('xr12')}>
                                    { t('Run XR12 demo') }
                                </DropdownMenu.Item>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu.Root>
            </Flex>
        </Flex>
    );
};
