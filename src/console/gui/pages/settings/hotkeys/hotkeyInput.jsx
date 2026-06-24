// Requirements
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { formatBinding } from '../../../helpers/hotkeys/format';
import { normalizeKeyboardEvent } from '../../../helpers/hotkeys/normalize';


// Exported
export default ({ binding, onChange, onReset }) => {
    const { t } = useLanguage();
    const { textSize } = useUiSize();
    const [recording, setRecording] = useState(false);

    const stopRecording = useCallback(() => {
        setRecording(false);
    }, []);

    const startRecording = useCallback(() => {
        setRecording(true);
    }, []);

    useEffect(() => {
        if (!recording) return undefined;

        const handleKeyDown = (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (event.code === 'Escape') {
                stopRecording();
                return;
            }

            const next = normalizeKeyboardEvent(event);
            if (!next) return;

            onChange(next);
            stopRecording();
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [recording, onChange, stopRecording]);

    const display = useMemo(() => recording ? t('Press a key...') : formatBinding(binding), [recording, binding, t]);

    return (
        <Flex align="center" justify="end" gap="3" width="100%" minWidth="0">
            <Button
                variant="soft"
                color={recording ? 'blue' : 'gray'}
                size={textSize}
                onClick={startRecording}
                data-hotkey-recording={recording ? '' : undefined}
            >
                <Text size={textSize} wrap="nowrap">{ display }</Text>
            </Button>
            {onReset && (
                <Button variant="ghost" color="gray" size={textSize} onClick={onReset}>
                    <Text size={textSize} wrap="nowrap">{ t('Reset to default') }</Text>
                </Button>
            )}
        </Flex>
    );
};
