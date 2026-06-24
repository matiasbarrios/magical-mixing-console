// Requirements
import { useCallback, useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import {
    useBusStereoLink, useBusToLevel, useBusToOn, useBusToPan, useBusToTap,
} from '@magical-mixing/mixers-react';
import { useLanguage } from '../../../../../../components/language';
import { useScreen } from '../../../../../../components/base/screen';
import { useBusIconNameVisible, useBusStereoIconNameVisible } from '../../../name';
import { TapDropdown } from '../../tap';
import Pan from '../../pan';
import Level from '../../level';
import DisableOnOrLevelAbove from '../../disableOnOrLevelAbove';
import { DestinationIcon, DestinationViewBus } from '../openTo';


// Internal
const ToControls = ({
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
export default ({ busIdFrom, busIdTo, linkDestination }) => {
    const { t } = useLanguage();
    const { md, lg, xl } = useScreen();
    const showRemoveFromSends = useMemo(() => md || lg || xl, [md, lg, xl]);
    const { has: tapHas } = useBusToTap(busIdFrom, busIdTo);
    const { has: onHas, value: on } = useBusToOn(busIdFrom, busIdTo);
    const { has: panHas } = useBusToPan(busIdFrom, busIdTo);
    const { has: levelHas } = useBusToLevel(busIdFrom, busIdTo);

    const {
        has: stereoLinkHas, value: stereoLinkValue, pair: stereoLinkPair,
    } = useBusStereoLink(busIdTo);
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

    const monoIconVisible = useBusIconNameVisible(busIdTo, {
        hideIdentifier: true,
        hideNameIfDefault: true,
    });
    const stereoIconVisible = useBusStereoIconNameVisible(busIdTo,
        stereoLinkPair ?? busIdTo,
        { hideIdentifier: true });
    const destinationIconVisible = stereoLinked && stereoLinkPair ? stereoIconVisible : monoIconVisible;

    const levelTrackStart = useMemo(() => (
        levelInTrack && destinationIconVisible
            ? <DestinationIcon busIdTo={busIdTo} hideIdentifier />
            : undefined
    ), [levelInTrack, destinationIconVisible, busIdTo]);

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
            <Flex
                flexShrink="0"
                onPointerDown={stopRowOpen}
                onClick={stopRowOpen}
            >
                <DestinationViewBus
                    busIdTo={busIdTo}
                    linkDestination={linkDestination}
                />
            </Flex>
            {showControls ? (
                <Flex
                    flexGrow="1"
                    minWidth="0"
                    onPointerDown={stopRowOpen}
                    onClick={stopRowOpen}
                >
                    <ToControls
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
                    <DestinationIcon busIdTo={busIdTo} />
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
            </Flex>
        </Flex>
    );
};
