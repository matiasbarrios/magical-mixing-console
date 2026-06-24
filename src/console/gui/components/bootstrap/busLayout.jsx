// Requirements
import {
    useCallback, useEffect, useState,
} from 'react';
import {
    Box, Button, Dialog, Flex, Heading, Separator, Text,
} from '@radix-ui/themes';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useDevices } from '../devices/context';
import { useLanguage } from '../language';
import { readSetting, writeSetting } from '../global/settings';
import { useTheme, useUiSize } from '../theme';
import verticalPreview from '../../static/bootstrap/bus-layout-vertical.svg';
import horizontalPreview from '../../static/bootstrap/bus-layout-horizontal.svg';


// Constants
const SETTINGS_DISMISSED = 'bus-layout-prompt-dismissed';

const optionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: 'var(--space-4)',
    alignItems: 'stretch',
};

const optionGridStyle = {
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr auto',
    gap: 'var(--space-3)',
    justifyItems: 'center',
    minWidth: 0,
    height: '100%',
};


// Internal
const busLayoutPromptIsDismissed = () => !!readSetting(SETTINGS_DISMISSED);

const busLayoutPromptDismiss = () => {
    writeSetting(SETTINGS_DISMISSED, true);
};

const useBusLayoutPrompt = () => {
    const { focused } = useDevices();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!focused || busLayoutPromptIsDismissed()) {
            setOpen(false);
            return;
        }
        setOpen(true);
    }, [focused]);

    const close = useCallback(() => setOpen(false), []);

    return { open, close };
};


const LayoutOption = ({
    imageSrc, title, description, chooseLabel, onChoose, textSize,
}) => (
    <Box style={optionGridStyle}>
        <img
            src={imageSrc}
            alt=""
            width="100%"
            style={{ maxWidth: '240px', display: 'block' }}
        />
        <Heading size="3" align="center">{ title }</Heading>
        <Text size={textSize} color="gray" align="center" style={{ alignSelf: 'start' }}>
            { description }
        </Text>
        <Button size={textSize} onClick={onChoose}>
            { chooseLabel }
        </Button>
    </Box>
);


const BusLayoutPromptDialog = ({ open, onClose }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const { setEntityViewLayout } = useTheme();

    const choose = useCallback((layout) => {
        setEntityViewLayout(layout);
        busLayoutPromptDismiss();
        onClose();
    }, [onClose, setEntityViewLayout]);

    const chooseVertical = useCallback(() => choose('vertical'), [choose]);
    const chooseHorizontal = useCallback(() => choose('horizontal'), [choose]);

    if (!open) return null;

    const chooseLabel = t('Choose this one');

    return (
        <Dialog.Root open onOpenChange={() => {}}>
            <Dialog.Content
                aria-describedby={undefined}
                maxWidth="640px"
                onEscapeKeyDown={e => e.preventDefault()}
                onPointerDownOutside={e => e.preventDefault()}
            >
                <Dialog.Title>
                    { t('Choose your bus layout') }
                </Dialog.Title>
                <VisuallyHidden>
                    <Dialog.Description>
                        { t('Pick how bus stripes are arranged in the bus view.') }
                    </Dialog.Description>
                </VisuallyHidden>
                <Box style={optionsGridStyle} mt="4">
                    <LayoutOption
                        imageSrc={verticalPreview}
                        title={t('Vertical layout')}
                        description={t('Traditional one. I don\'t blame you for choosing this one.')}
                        chooseLabel={chooseLabel}
                        onChoose={chooseVertical}
                        textSize={textSize}
                    />
                    <Separator
                        orientation="vertical"
                        size="4"
                        style={{ height: 'auto', alignSelf: 'stretch' }}
                    />
                    <LayoutOption
                        imageSrc={horizontalPreview}
                        title={t('Horizontal layout')}
                        description={t('More experimental, for those who want to try something different.')}
                        chooseLabel={chooseLabel}
                        onChoose={chooseHorizontal}
                        textSize={textSize}
                    />
                </Box>
                <Flex justify="center" width="100%" mt="6">
                    <Text size="1" color="gray" align="center">
                        { t('You can change this anytime in Appearance settings.') }
                    </Text>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};


export const BusLayoutPrompt = () => {
    const { open, close } = useBusLayoutPrompt();

    return <BusLayoutPromptDialog open={open} onClose={close} />;
};

