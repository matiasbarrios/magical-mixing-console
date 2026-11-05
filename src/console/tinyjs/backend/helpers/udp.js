// Requirements
import { Buffer } from 'buffer';
import { broadcastSocketOpen } from './udpBroadcast.js';


// Variables
let nextSocketId = 1;
const sockets = new Map();


// Internal
const toBuffer = data => Buffer.from(data.buffer, data.byteOffset, data.byteLength);


// A failed send doesn't reject writer.write(): it later errors the stream, and every
// following write fails too. The error goes to errorListeners, and the next send
// reopens the socket on the same local port, which the desk session is tied to.
const plainSocketOpen = async (bindAddress, port) => {
    const localAddress = bindAddress || '0.0.0.0';
    let localPort = (bindAddress && port) ? Number(port) : 0;

    const listeners = new Set();
    const errorListeners = new Set();
    let closed = false;
    let current = null;
    let reopening = null;

    const readLoop = async (state, reader) => {
        try {
            const { value, done } = await reader.read();
            if (done || closed || state !== current) return;
            listeners.forEach(l => l(value.data, value.remoteAddress, value.remotePort));
            readLoop(state, reader);
        } catch (error) {
            if (!closed && state === current) console.error(`UDP receive error: ${error.message}`);
        }
    };

    const open = async () => {
        const socket = new UDPSocket({ localAddress, localPort, reuseAddr: true });
        const opened = await socket.opened;
        localPort = opened.localPort;
        const state = { socket, writer: opened.writable.getWriter(), error: null };
        state.writer.closed.catch((error) => {
            state.error = error;
            if (closed || state !== current) return;
            console.error(`UDP send error: ${error.message}`);
            errorListeners.forEach(l => l(error));
        });
        current = state;
        readLoop(state, opened.readable.getReader());
    };

    const reopen = () => {
        if (!reopening) {
            reopening = (async () => {
                try {
                    current.socket.close();
                } catch {
                    // Already closed
                }
                await open();
            })().finally(() => { reopening = null; });
        }
        return reopening;
    };

    await open();

    return {
        listeners,
        errorListeners,
        send: async (address, port, bytes) => {
            if (closed) throw new Error('Socket closed');
            if (current.error) await reopen();
            await current.writer.write({
                data: bytes,
                remoteAddress: address,
                remotePort: port,
            });
        },
        close: async () => {
            if (closed) return;
            closed = true;
            await reopening?.catch(() => {});
            current.socket.close();
            await current.socket.closed;
        },
    };
};


// Exported
export const udpSocketOpen = async (bindAddress, port, enableBroadcast = false) => {
    let socket = null;
    if (enableBroadcast) {
        socket = await broadcastSocketOpen(bindAddress);
        if (!socket) console.warn('UDP broadcast not available on this platform');
    }
    if (!socket) socket = await plainSocketOpen(bindAddress, port);

    const socketId = nextSocketId;
    nextSocketId += 1;
    sockets.set(socketId, socket);
    return socketId;
};


export const udpSocketClose = async (socketId) => {
    const socket = sockets.get(socketId);
    if (!socket) return;
    sockets.delete(socketId);
    try {
        await socket.close();
    } catch (error) {
        console.error(`UDP close socket error: ${error.message}`);
    }
};


export const udpSocketsClose = async () => {
    await Promise.all([...sockets.keys()].map(udpSocketClose));
};


export const udpMessageSend = (
    socketId, address, port, message, onError
) => {
    const socket = sockets.get(socketId);
    if (!socket) return;

    const doOnError = (error) => {
        console.error(`UDP message error: ${error?.message ?? error}`);
        if (onError) onError(error, socketId);
    };

    try {
        Promise.resolve(socket.send(address, Number(port), message)).catch(doOnError);
    } catch (error) {
        doOnError(error);
    }
};


export const onUDPMessageReceived = (onMessageReceived, socketId) => {
    const socket = sockets.get(socketId);
    if (!socket) return () => {};

    const onReceive = (data, address, port) => {
        if (!sockets.has(socketId)) return;
        onMessageReceived(toBuffer(data), address, port);
    };

    socket.listeners.add(onReceive);
    return () => {
        socket.listeners.delete(onReceive);
    };
};


// Errors that surface after send() returned; broadcast sockets throw from send() instead
export const onUDPSocketError = (onError, socketId) => {
    const socket = sockets.get(socketId);
    if (!socket?.errorListeners) return () => {};

    const onSocketError = (error) => {
        if (sockets.has(socketId)) onError(error, socketId);
    };

    socket.errorListeners.add(onSocketError);
    return () => {
        socket.errorListeners.delete(onSocketError);
    };
};
