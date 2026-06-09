// Requirements
import { UdpSocket } from 'capacitor-udp-socket';


// Variables
let onUDPErrorCallback = null;


// Internal
const parsePort = (value) => {
    const num = Number(value);
    return (Number.isInteger(num)) ? num : undefined;
};


const toByteList = (buffer) => {
    const view = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const out = new Array(view.length);
    for (let i = 0; i < view.length; i += 1) {
        out[i] = view[i];
    }
    return out;
};


const byteListToBuffer = (bytes) => {
    const out = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 1) {
        out[i] = bytes[i] & 0xff;
    }
    return out.buffer;
};


const isBenignUdpReceiveError = (text) => {
    if (!text) return true;
    const normalized = String(text).trim().toLowerCase();
    // Expected when the search socket is closed during connect/handoff (iOS plugin default).
    return normalized === 'socket closed';
};


// Exported
export const udpSocketOpen = async (bindAddress, port, enableBroadcast = false) => {
    const { socketId } = await UdpSocket.create({ properties: { name: 'MMCUDP', bufferSize: 2048 } });

    // In mobile, we cant control the interface to bind to
    const addressFinal = bindAddress === '127.0.0.1' ? bindAddress : (bindAddress || '0.0.0.0');
    const portFinal = parsePort(port) || 0;
    await UdpSocket.bind({ socketId, address: addressFinal, port: portFinal });
    if (enableBroadcast || !portFinal) {
        await UdpSocket.setBroadcast({ socketId, enabled: true });
    }

    return socketId;
};


export const udpSocketClose = async (socketId) => {
    try {
        await UdpSocket.close({ socketId });
    } catch (error) {
        console.error(`UDP close socket error: ${error.message}`);
    }
};


export const udpMessageSend = (socketId, address, port, message) => {
    void UdpSocket.send({
        socketId,
        address,
        port: parsePort(port),
        bytes: toByteList(message),
    });
};


export const onUDPMessageReceived = (callback, socketId) => {
    const onReceive = (event) => {
        if (event.socketId !== socketId || event.bytes == null) return;
        callback(byteListToBuffer(event.bytes), event.remoteAddress, event.remotePort);
    };

    const onError = (event) => {
        const errorText = event.error ?? event.message;
        if (isBenignUdpReceiveError(errorText)) return;
        if (onUDPErrorCallback) onUDPErrorCallback(errorText);
    };

    let receiveHandler = null;
    let errorHandler = null;

    void UdpSocket.addListener('receive', onReceive).then((handler) => {
        receiveHandler = handler;
    });
    void UdpSocket.addListener('receiveError', onError).then((handler) => {
        errorHandler = handler;
    });

    return () => {
        if (receiveHandler) receiveHandler.remove();
        if (errorHandler) errorHandler.remove();
    };
};


export const onUDPError = (callback) => {
    onUDPErrorCallback = callback;
};
