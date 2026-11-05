// UDP sockets with SO_BROADCAST on Windows, through tjs:ffi over ws2_32.dll.
// There is no readiness notification for a socket created this way, so the
// socket is non-blocking and gets drained on a timer.


// Constants
const RECEIVE_SIZE = 8192;
const POLL_INTERVAL = 4; // ms; Windows timers round this up to its tick (~15.6 ms)
const POLL_MAX_READS = 256; // per tick, so a flood can't starve the event loop

const AF_INET = 2;
const SOCK_DGRAM = 2;
const IPPROTO_UDP = 17;
const SOL_SOCKET = 0xffff;
const SO_BROADCAST = 0x0020;
const FIONBIO = 0x8004667e;
const INVALID_SOCKET = -1;
const SOCKET_ERROR = -1;
const WSAEWOULDBLOCK = 10035;
const WSAECONNRESET = 10054;
const SOCKADDR_IN_SIZE = 16;


// Variables
let winsock = null;


// Internal
// SOCKET is a UINT_PTR; as a signed 64-bit value INVALID_SOCKET reads as -1
const winsockLoad = async () => {
    if (winsock !== null) return winsock;
    try {
        const { dlopen } = await import('tjs:ffi');
        const { symbols } = dlopen('ws2_32.dll', {
            WSAStartup: { returns: 'i32', args: ['u16', 'buffer'] },
            WSAGetLastError: { returns: 'i32', args: [] },
            socket: { returns: 'i64', args: ['i32', 'i32', 'i32'] },
            setsockopt: { returns: 'i32', args: ['i64', 'i32', 'i32', 'buffer', 'i32'] },
            ioctlsocket: { returns: 'i32', args: ['i64', 'u32', 'buffer'] },
            bind: { returns: 'i32', args: ['i64', 'buffer', 'i32'] },
            sendto: { returns: 'i32', args: ['i64', 'buffer', 'i32', 'i32', 'buffer', 'i32'] },
            recvfrom: { returns: 'i32', args: ['i64', 'buffer', 'i32', 'i32', 'buffer', 'buffer'] },
            closesocket: { returns: 'i32', args: ['i64'] },
        });

        // libuv already initialised Winsock; this only takes one more reference
        const wsaData = new Uint8Array(512);
        const startup = symbols.WSAStartup(0x0202, wsaData);
        if (startup !== 0) throw new Error(`WSAStartup failed: ${startup}`);

        winsock = symbols;
    } catch (error) {
        console.error(`Winsock not available: ${error.message}`);
        winsock = false;
    }
    return winsock;
};


const intOption = value => new Uint8Array(new Int32Array([value]).buffer);


// Same wording as libuv's, which the GUI matches to pick its message
const winsockErrorNames = {
    '10013': ['EACCES', 'permission denied'],
    '10050': ['ENETDOWN', 'network is down'],
    '10051': ['ENETUNREACH', 'network is unreachable'],
    '10064': ['EHOSTDOWN', 'host is down'],
    '10065': ['EHOSTUNREACH', 'no route to host'],
};


const winsockError = (ws, call) => {
    const wsaCode = ws.WSAGetLastError();
    const [code, text] = winsockErrorNames[wsaCode] ?? [`WSA${wsaCode}`, `WSA error ${wsaCode}`];
    const error = new Error(`${code}: ${text} (${call})`);
    error.code = code;
    return error;
};


const ipv4Parse = (address) => {
    const parts = String(address).split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => !Number.isInteger(p) || p < 0 || p > 255)) {
        throw new Error(`Invalid IPv4 address: ${address}`);
    }
    return parts;
};


// sockaddr_in: family (little endian), port (big endian), IPv4, 8 bytes of zero
const sockaddrCreate = (address, port) => {
    const addr = new Uint8Array(SOCKADDR_IN_SIZE);
    const view = new DataView(addr.buffer);
    view.setUint16(0, AF_INET, true);
    view.setUint16(2, port, false);
    addr.set(ipv4Parse(address), 4);
    return addr;
};


const sockaddrParse = addr => ({
    address: `${addr[4]}.${addr[5]}.${addr[6]}.${addr[7]}`,
    port: (addr[2] << 8) | addr[3],
});


// Exported
export const winsockBroadcastSocketOpen = async (bindAddress) => {
    const ws = await winsockLoad();
    if (!ws) return null;

    const fd = ws.socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (fd === INVALID_SOCKET) throw winsockError(ws, 'socket');

    const check = (result, call) => {
        if (result === SOCKET_ERROR) {
            const error = winsockError(ws, call);
            ws.closesocket(fd);
            throw error;
        }
    };

    const broadcastOption = intOption(1);
    check(ws.setsockopt(
        fd, SOL_SOCKET, SO_BROADCAST, broadcastOption, broadcastOption.length
    ),
    'setsockopt');
    check(ws.ioctlsocket(fd, FIONBIO, intOption(1)), 'ioctlsocket');
    const bindAddr = sockaddrCreate(bindAddress || '0.0.0.0', 0);
    check(ws.bind(fd, bindAddr, bindAddr.length), 'bind');

    const listeners = new Set();
    const receiveBuffer = new Uint8Array(RECEIVE_SIZE);
    const fromAddr = new Uint8Array(SOCKADDR_IN_SIZE);
    const fromLen = new Uint8Array(4);
    const fromLenView = new DataView(fromLen.buffer);
    let closed = false;

    const drain = () => {
        for (let i = 0; i < POLL_MAX_READS && !closed; i += 1) {
            fromLenView.setInt32(0, SOCKADDR_IN_SIZE, true);
            const size = ws.recvfrom(
                fd, receiveBuffer, RECEIVE_SIZE, 0, fromAddr, fromLen
            );
            if (size === SOCKET_ERROR) {
                const code = ws.WSAGetLastError();
                if (code === WSAEWOULDBLOCK) return;
                // ICMP port unreachable from an earlier sendto; the socket is still usable
                if (code === WSAECONNRESET) continue;
                console.error(`UDP broadcast receive error: WSA error ${code}`);
                return;
            }
            const data = receiveBuffer.slice(0, size);
            const { address, port } = sockaddrParse(fromAddr);
            listeners.forEach(l => l(data, address, port));
        }
    };

    const timer = setInterval(drain, POLL_INTERVAL);

    return {
        listeners,
        send: async (address, port, bytes) => {
            if (closed) throw new Error('Socket closed');
            const data = bytes instanceof Uint8Array
                ? bytes
                : new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
            const toAddr = sockaddrCreate(address, port);
            const sent = ws.sendto(
                fd, data, data.byteLength, 0, toAddr, toAddr.length
            );
            if (sent === SOCKET_ERROR) throw winsockError(ws, 'sendto');
        },
        close: async () => {
            if (closed) return;
            closed = true;
            clearInterval(timer);
            ws.closesocket(fd);
        },
    };
};
