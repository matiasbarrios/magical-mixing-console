// UDP sockets with SO_BROADCAST. txiki.js UDPSocket has no broadcast option,
// so these go through tjs:posix-socket (macOS / Linux) or Winsock (Windows).


// Requirements
import { winsockBroadcastSocketOpen } from './udpBroadcastWinsock.js';


// Constants
const RECEIVE_SIZE = 8192;


// Variables
let posixSocket = null;


// Internal
// tjs:posix-socket does not exist on Windows, so it can only be imported lazily
const posixSocketLoad = async () => {
    if (posixSocket !== null) return posixSocket;
    try {
        ({ PosixSocket: posixSocket } = await import('tjs:posix-socket'));
    } catch {
        posixSocket = false;
    }
    return posixSocket;
};


const intOption = value => new Uint8Array(new Int32Array([value]).buffer);


// sockaddr_in keeps the port (big endian) at bytes 2-3 and the IPv4 at bytes 4-7 on
// both BSD and Linux; only the first two bytes (length / family) differ.
const sockaddrParse = addr => ({
    address: `${addr[4]}.${addr[5]}.${addr[6]}.${addr[7]}`,
    port: (addr[2] << 8) | addr[3],
});


// Exported
export const broadcastSocketOpen = async (bindAddress) => {
    const PosixSocket = await posixSocketLoad();
    if (!PosixSocket) return winsockBroadcastSocketOpen(bindAddress);

    const {
        AF_INET, SOCK_DGRAM, IPPROTO_UDP, SOL_SOCKET, SO_BROADCAST, SO_REUSEADDR,
    } = PosixSocket.defines;

    const socket = new PosixSocket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    socket.setopt(SOL_SOCKET, SO_REUSEADDR, intOption(1));
    socket.setopt(SOL_SOCKET, SO_BROADCAST, intOption(1));
    socket.bind(PosixSocket.createSockaddrIn(bindAddress || '0.0.0.0', 0));

    const listeners = new Set();
    let closed = false;

    socket.poll({
        read: () => {
            if (closed) return;
            try {
                const { data, addr } = socket.recvmsg(RECEIVE_SIZE);
                const { address, port } = sockaddrParse(addr);
                listeners.forEach(l => l(data, address, port));
            } catch (error) {
                console.error(`UDP broadcast receive error: ${error.message}`);
            }
        },
        error: (code) => {
            if (!closed) console.error(`UDP broadcast poll error: ${code}`);
        },
    });

    return {
        listeners,
        send: async (address, port, bytes) => {
            socket.sendmsg(PosixSocket.createSockaddrIn(address, port), undefined, 0, bytes);
        },
        close: async () => {
            if (closed) return;
            closed = true;
            socket.stopPoll();
            socket.close();
        },
    };
};
