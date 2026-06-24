const udpErrorToText = (error) => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return String(error);
};


const BENIGN_SEARCH_ERROR_CODES = new Set([
    'ehostunreach',
    'enetunreach',
    'enetdown',
    'ehostdown',
]);

const BENIGN_SEARCH_ERROR_PHRASES = [
    'no route to host',
    'network is unreachable',
    'network is down',
    'socket closed',
    'host is down',
];


const isBenignSearchUdpError = (error) => {
    const code = error?.code?.toLowerCase?.() ?? '';
    if (BENIGN_SEARCH_ERROR_CODES.has(code)) return true;

    const text = udpErrorToText(error).toLowerCase();
    return BENIGN_SEARCH_ERROR_PHRASES.some(phrase => text.includes(phrase));
};


const formatUdpError = (error, t) => {
    const code = error?.code?.toLowerCase?.() ?? '';
    const text = udpErrorToText(error).toLowerCase();

    if (code === 'eacces' || text.includes('permission denied')) {
        return t('Network access denied. Check app permissions.');
    }

    if (code === 'enetdown' || code === 'ehostdown' || text.includes('network is down') || text.includes('host is down')) {
        return t('Network connection lost. Check your Wi-Fi or cable.');
    }

    if (code === 'ehostunreach' || code === 'enetunreach'
        || text.includes('no route to host') || text.includes('network is unreachable')) {
        return t('Could not reach the mixer on the network. Check that you are on the same network.');
    }

    return t('A network error occurred while communicating with the mixer.');
};


const getUdpErrorMessage = (error, t) => {
    if (isBenignSearchUdpError(error)) return null;
    return formatUdpError(error, t);
};


export default getUdpErrorMessage;
