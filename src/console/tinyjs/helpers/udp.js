// Requirements
import { Buffer } from 'buffer';
import { call, on } from './bridge';


// Variables
const listeners = new Map();

const errorListeners = new Set();

let subscribed = false;


// Internal
const subscribe = () => {
    if (subscribed) return;
    subscribed = true;

    on('udp', ({
        socketId, data, address, port,
    }) => {
        const socketListeners = listeners.get(socketId);
        if (!socketListeners?.size) return;
        const buffer = Buffer.from(data, 'base64');
        socketListeners.forEach(l => l(buffer, address, port));
    });

    on('udpError', ({ error, socketId }) => {
        errorListeners.forEach(l => l(error, socketId));
    });
};


// Exported
export const udpSocketOpen = async (bindAddress, port, enableBroadcast = false) => {
    subscribe();
    return call('udpSocketOpen', bindAddress ?? null, port ?? null, enableBroadcast);
};


export const udpSocketClose = async (socketId) => {
    listeners.delete(socketId);
    await call('udpSocketClose', socketId);
};


export const udpMessageSend = (socketId, address, port, message) => {
    const buffer = Buffer.isBuffer(message) ? message : Buffer.from(message);
    call(
        'udpMessageSend', socketId, address, port, buffer.toString('base64')
    ).catch(error => console.error(`UDP message error: ${error.message}`));
};


export const onUDPMessageReceived = (callback, socketId) => {
    if (!listeners.has(socketId)) listeners.set(socketId, new Set());
    const socketListeners = listeners.get(socketId);
    socketListeners.add(callback);
    return () => {
        socketListeners.delete(callback);
    };
};


export const onUDPError = (callback) => {
    subscribe();
    errorListeners.add(callback);
    return () => {
        errorListeners.delete(callback);
    };
};
