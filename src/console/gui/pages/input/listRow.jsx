// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useLanguage } from '../../components/language';
import ViewInput from './view/openInput';
import Gain from './view/gain';
import Phantom from './view/phantom';
import AssignedBuses from './listAssignedBuses';


// Internal
const GainTrackStart = ({ label }) => (
    <Text size="1" color="gray" wrap="nowrap">
        { label }
    </Text>
);


// Exported
export default ({ inputId, inlineBuses = false }) => {
    const { t } = useLanguage();

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const gainTrackStart = useMemo(() => (
        <GainTrackStart label={t('Gain')} />
    ), [t]);

    const assignedBuses = (
        <Flex
            flexShrink="0"
            minWidth={inlineBuses ? '0' : undefined}
            onPointerDown={stopRowOpen}
            onClick={stopRowOpen}
        >
            <AssignedBuses inputId={inputId} />
        </Flex>
    );

    const mainRow = (
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
            {inlineBuses && assignedBuses}
        </Flex>
    );

    if (inlineBuses) {
        return (
            <Flex width="100%" minWidth="0">
                { mainRow }
            </Flex>
        );
    }

    return (
        <Flex
            direction="column"
            gapY="1"
            width="100%"
            minWidth="0"
        >
            { mainRow }
            <Flex align="center" justify="end" gapX="1" wrap="wrap" minWidth="0" pl="2">
                { assignedBuses }
            </Flex>
        </Flex>
    );
};
