// Requirements
import {
    AlertDialog, Box, Button, Flex, Text,
} from '@radix-ui/themes';
import { CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useCallback, useMemo, useState } from 'react';
import { useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../language';
import { useUiSize } from '../theme';


// Constants
const listStyle = {
    margin: 0,
    paddingLeft: 'var(--space-4)',
};


const sectionIconStyle = {
    width: 16,
    height: 16,
    flexShrink: 0,
};


// Internal
const Section = ({ icon, title, items, color }) => {
    const { textSize } = useUiSize();

    return (
        <Box>
            <Flex align="center" gapX="2" mb="1">
                { icon }
                <Text size={textSize} weight="medium">
                    { title }
                </Text>
            </Flex>
            <Box asChild pl="1">
                <ul style={listStyle}>
                    {items.map(item => (
                        <li key={item}>
                            <Text size={textSize} color={color}>
                                { item }
                            </Text>
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
};


// Exported
export const FreshStartDialog = ({ onAccept, children }) => {
    const { disabled } = useDevice();
    const { t } = useLanguage();
    const { textSize } = useUiSize();

    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);
    const doOpen = useCallback((e) => {
        e.preventDefault();
        setOpen(true);
    }, []);

    const keptItems = useMemo(() => [
        t('Your saved scenes'),
        t('Device name and network'),
        t('App presets'),
    ], [t]);

    const resetItems = useMemo(() => [
        t('All buses, inputs, outputs, FX, DCAs, and groups'),
        t('Levels (buses are muted)'),
        t('EQ, compressors, gates, and routing'),
        t('Device Audio/MIDI settings'),
    ], [t]);

    const doAccept = useCallback(() => {
        onAccept();
        setOpen(false);
    }, [onAccept]);

    return (
        <>
            <AlertDialog.Root open={open} onOpenChange={onClose}>
                <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>
                        { t('Start in a new place?') }
                    </AlertDialog.Title>
                    <VisuallyHidden>
                        <AlertDialog.Description>
                            { t('Fresh start a11y description') }
                        </AlertDialog.Description>
                    </VisuallyHidden>
                    <Flex direction="column" gapY="3" mt="2">
                        <Text size={textSize}>
                            { t('Fresh start intro') }
                        </Text>
                        <Section
                            icon={<CheckCircledIcon style={sectionIconStyle} color="var(--green-9)" />}
                            title={t('What is kept')}
                            items={keptItems}
                            color="gray"
                        />
                        <Section
                            icon={(
                                <ExclamationTriangleIcon
                                    style={sectionIconStyle}
                                    color="var(--amber-9)"
                                />
                            )}
                            title={t('What is reset')}
                            items={resetItems}
                            color="gray"
                        />
                        <Text size="1" color="gray">
                            { t('You can then use the setup wizard (green wand) to configure channels quickly.') }
                        </Text>
                    </Flex>
                    <Flex justify="end" gapX="3" mt="4">
                        <AlertDialog.Cancel>
                            <Button size={textSize} variant="soft" color="gray">
                                { t('Cancel') }
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button
                                size={textSize}
                                variant="soft"
                                color="red"
                                onClick={doAccept}
                                disabled={disabled}
                            >
                                { t('Yes, start fresh') }
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
            { children(doOpen) }
        </>
    );
};
