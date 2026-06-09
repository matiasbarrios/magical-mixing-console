// Kick → bass compressor sidechain defaults (setup wizard, Bass flow).


export const KICK_SIDECHAIN_MODE = 'Compressor';

export const KICK_SIDECHAIN_RATIO = '4.0';

export const KICK_SIDECHAIN_FILTER_TYPE = 'High cut 12';

export const KICK_SIDECHAIN_FREQUENCY = 250;


export const DEFAULT_KICK_SIDECHAIN = {
    enabled: false,
    kickBusId: null,
};


export const kickSidechainFromSetupType = () => ({ ...DEFAULT_KICK_SIDECHAIN });


/** X-Air channel buses only (ids 0–15). */
export const kickBusIdToSidechainSourceName = (kickBusId) => {
    if (kickBusId === null || kickBusId === undefined) return null;
    if (kickBusId < 0 || kickBusId > 15) return null;
    return `Channel ${kickBusId + 1}`;
};


export const isKickSidechainSourceValid = (kickBusId, bassBusId) => {
    const name = kickBusIdToSidechainSourceName(kickBusId);
    if (!name) return false;
    if (kickBusId === bassBusId) return false;
    return true;
};
