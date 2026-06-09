// Requirements
import { useCallback, useMemo } from 'react';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { MinusIcon } from '@radix-ui/react-icons';
import { useBusLevel, useDevice } from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../components/language';
import { useUiSize } from '../../../components/theme';
import { FallbackBusDcaOn } from '../../../components/fallback';
import { SourceIcon, SourceViewBus } from '../../bus/view/fromTo/openFrom';
import Mute from '../../bus/view/mute';
import Solo from '../../bus/view/solo';
import Level from '../../bus/view/level';
import { ICON_STYLE } from '../../../helpers/values';


// Internal
const LevelTrackStart = ({ busId, label }) => (
    <Flex align="center" gapX="1" wrap="nowrap">
        <SourceIcon busIdFrom={busId} hideIdentifier size="1" />
        <Text size="1" color="gray" wrap="nowrap">
            { label }
        </Text>
    </Flex>
);


const UnassignBus = ({ set }) => {
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
            aria-label={t('Unassign bus')}
        >
            <MinusIcon style={ICON_STYLE} />
        </IconButton>
    );
};


const BusActions = ({
    busId, onHas, on, set,
}) => {
    if (!onHas) return null;

    return (
        <Flex align="center" gapX="1" flexShrink="0">
            {on && <Solo busId={busId} />}
            {on && <Mute busId={busId} />}
            <UnassignBus set={set} />
        </Flex>
    );
};


const BusRowInner = ({
    busId, onHas, on, set,
}) => {
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
export default ({ busId, dcaId }) => (
    <FallbackBusDcaOn busId={busId} dcaId={dcaId}>
        {({ has: onHas, value: on, set }) => (
            <BusRowInner busId={busId} onHas={onHas} on={on} set={set} />
        )}
    </FallbackBusDcaOn>
);
