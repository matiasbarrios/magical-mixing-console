// Requirements
import { useMemo } from 'react';
import { Flex } from '@radix-ui/themes';
import {
    useBusMute, useBusOptions, useBusToOn,
} from '@magical-mixing/mixers-react';
import Solo from './solo';
import Mute from './mute';


// Internal
export const useBusQuickActionsCount = (busId) => {
    const { soloOne } = useBusOptions();
    const { has: soloHas } = useBusToOn(busId, soloOne?.id);
    const { has: muteHas } = useBusMute(busId);

    return useMemo(() => [soloHas, muteHas]
        .filter(Boolean).length,
    [soloHas, muteHas]);
};


// Exported
export default ({ busId, stacked = false }) => (
    <Flex
        direction={stacked ? 'column' : 'row'}
        align="center"
        gap={stacked ? '1' : undefined}
        gapX={stacked ? undefined : '1'}
        flexShrink="0"
    >
        <Solo busId={busId} />
        <Mute busId={busId} />
    </Flex>
);
