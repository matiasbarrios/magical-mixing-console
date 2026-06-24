// Requirements
import { useCallback, useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import {
    useBusStereoLink, useBusToLevel, useBusToOn, useBusToPan, useBusToTap,
} from '@magical-mixing/mixers-react';
import { useBusIconNameVisible, useBusStereoIconNameVisible } from '../../../name';
import { useLanguage } from '../../../../../../components/language';
import { useScreen } from '../../../../../../components/base/screen';
import { TapDropdown } from '../../tap';
import DisableOnOrLevelAbove from '../../disableOnOrLevelAbove';
import Pan from '../../pan';
import Level from '../../level';
import {
    SourceBusEditButton, SourceIcon, SourceQuickActions, SourceViewBus,
} from '../openFrom';
import { SourceBusTabLinks } from '../sourceBusTabLinks';


// Internal
const FromControls = ({
    busIdFrom, busIdTo, stereoLinked, stereoLinkPair, extended, levelHas,
    levelTrackStart,
}) => (
    <Flex
        align="center"
        gapX="1"
        width="100%"
        wrap="nowrap"
    >
        {extended && (
            <>
                {levelHas && (
                    <Flex flexGrow="1" minWidth="0" width="100%">
                        <Level
                            busIdFrom={busIdFrom}
                            busIdTo={busIdTo}
                            busIdStereoLinked={
                                stereoLinked ? stereoLinkPair : undefined
                            }
                            minWidth="0"
                            trackStart={levelTrackStart}
                        />
                    </Flex>
                )}
            </>
        )}
    </Flex>
);


// Exported
export default ({ busIdFrom, busIdTo }) => {
    const { t } = useLanguage();
    const { md, lg, xl } = useScreen();
    const showRemoveFromSends = useMemo(() => md || lg || xl, [md, lg, xl]);
    const { has: tapHas } = useBusToTap(busIdFrom, busIdTo);
    const { has: onHas, value: on } = useBusToOn(busIdFrom, busIdTo);
    const { has: panHas } = useBusToPan(busIdFrom, busIdTo);
    const { has: levelHas } = useBusToLevel(busIdFrom, busIdTo);

    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdFrom);
    const stereoLinked = useMemo(() => stereoLinkHas
        && !!stereoLinkValue && stereoLinkPair !== undefined,
    [stereoLinkHas, stereoLinkValue, stereoLinkPair]);

    const extended = useMemo(() => (!onHas || on) && (panHas || levelHas),
        [onHas, on, panHas, levelHas]);

    const stopRowOpen = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const showControls = tapHas || extended;

    const levelInTrack = useMemo(() => levelHas && extended,
        [levelHas, extended]);

    const monoIconVisible = useBusIconNameVisible(busIdFrom, {
        hideIdentifier: true,
        hideNameIfDefault: true,
    });
    const stereoIconVisible = useBusStereoIconNameVisible(busIdFrom,
        stereoLinkPair ?? busIdFrom,
        { hideIdentifier: true });
    const sourceIconVisible = stereoLinked && stereoLinkPair ? stereoIconVisible : monoIconVisible;

    const levelTrackStart = useMemo(() => (
        levelInTrack && sourceIconVisible
            ? <SourceIcon busIdFrom={busIdFrom} hideIdentifier />
            : undefined
    ), [levelInTrack, sourceIconVisible, busIdFrom]);

    return (
        <Flex
            align="center"
            gapX="1"
            width="100%"
            wrap="nowrap"
            minWidth="0"
        >
            {showRemoveFromSends && (
                <Flex
                    flexShrink="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <DisableOnOrLevelAbove
                        busIdFrom={busIdFrom}
                        busIdTo={busIdTo}
                        ariaLabel={t('Remove from sends')}
                    />
                </Flex>
            )}
            <SourceBusTabLinks busIdFrom={busIdFrom} />
            <Flex
                align="center"
                gapX="1"
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <SourceViewBus busIdFrom={busIdFrom} />
                <SourceBusEditButton busIdFrom={busIdFrom} />
            </Flex>
            {showControls ? (
                <Flex
                    flexGrow="1"
                    minWidth="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <FromControls
                        busIdFrom={busIdFrom}
                        busIdTo={busIdTo}
                        stereoLinked={stereoLinked}
                        stereoLinkPair={stereoLinkPair}
                        extended={extended}
                        levelHas={levelHas}
                        levelTrackStart={levelTrackStart}
                    />
                </Flex>
            ) : (
                <Flex flexGrow="1" minWidth="0" />
            )}
            <Flex
                align="center"
                gapX="1"
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                {!levelInTrack && (
                    <SourceIcon busIdFrom={busIdFrom} />
                )}
                {tapHas && (
                    <TapDropdown
                        busIdFrom={busIdFrom}
                        busIdTo={busIdTo}
                        showValue
                        abbreviate
                    />
                )}
                {extended && (
                    <>
                        <Pan busIdFrom={busIdFrom} busIdTo={busIdTo} />
                        {stereoLinked && stereoLinkPair && (
                            <Pan
                                busIdFrom={stereoLinkPair}
                                busIdTo={busIdTo}
                            />
                        )}
                    </>
                )}
                <SourceQuickActions busIdFrom={busIdFrom} />
            </Flex>
        </Flex>
    );
};
