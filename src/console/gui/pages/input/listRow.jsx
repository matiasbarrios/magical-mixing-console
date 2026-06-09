// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../components/language';
import ViewInput from './view/openInput';
import Gain from './view/gain';
import Phantom from './view/phantom';


// Internal
const GainTrackStart = ({ label }) => (
    <Text size="1" color="gray" wrap="nowrap">
        { label }
    </Text>
);


// Exported
export default ({ inputId }) => {
    const { t } = useLanguage();

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const gainTrackStart = useMemo(() => (
        <GainTrackStart label={t('Gain')} />
    ), [t]);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex flexShrink="0">
                <ViewInput inputId={inputId} />
            </Flex>
            <Flex
                flexGrow="1"
                minWidth="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <Gain
                    inputId={inputId}
                    minWidth="0"
                    fullWidth
                    label={gainTrackStart}
                />
            </Flex>
            <Flex
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <Phantom inputId={inputId} />
            </Flex>
        </Flex>
    );
};
