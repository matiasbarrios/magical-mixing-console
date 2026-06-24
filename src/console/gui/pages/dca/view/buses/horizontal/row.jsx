// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { useBusLevel } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../components/language';
import { SourceIcon, SourceViewBus } from '../../../../bus/view/fromTo/from/openFrom';
import Level from '../../../../bus/view/level';
import { BusActions } from '../shared';


// Internal
const LevelTrackStart = ({ busId, label }) => (
    <Flex align="center" gapX="1" wrap="nowrap">
        <SourceIcon busIdFrom={busId} hideIdentifier size="1" />
        <Text size="1" color="gray" wrap="nowrap">
            { label }
        </Text>
    </Flex>
);


const RowInner = ({ busId, onHas, on, set }) => {
    const { t } = useLanguage();
    const { has: levelHas } = useBusLevel(busId);

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const levelInTrack = useMemo(() => on && levelHas,
        [on, levelHas]);

    const levelTrackStart = useMemo(() => (
        levelInTrack ? <LevelTrackStart busId={busId} label={t('Level')} /> : undefined
    ), [levelInTrack, busId, t]);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            <Flex
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <SourceViewBus busIdFrom={busId} />
            </Flex>
            <Flex
                flexGrow="1"
                minWidth="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                {levelInTrack ? (
                    <Level
                        busId={busId}
                        minWidth="0"
                        fullWidth
                        trackStart={levelTrackStart}
                        label=""
                    />
                ) : (
                    <Flex flexGrow="1" minWidth="0" />
                )}
            </Flex>
            <Flex
                align="center"
                gapX="1"
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                {!levelInTrack && (
                    <SourceIcon busIdFrom={busId} />
                )}
                <BusActions
                    busId={busId}
                    onHas={onHas}
                    on={on}
                    set={set}
                />
            </Flex>
        </Flex>
    );
};


// Exported
export default ({ busId, onHas, on, set }) => (
    <RowInner busId={busId} onHas={onHas} on={on} set={set} />
);
