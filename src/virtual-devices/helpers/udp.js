// Requirements
import dgram from 'dgram';


// Variables
let nextSocketId = 0;
const sockets = {};


// Internal
const bindSocket = (socket, bindAddress, port) => new Promise((resolve, reject) => {
    const onBound = (error) => {
        if (error) {
            reject(error);
            return;
        }
        try {
            socket.setBroadcast(true);
        } catch (broadcastError) {
            reject(broadcastError);
            return;
        }
        resolve();
    };

    if (bindAddress && port) {
        socket.bind({ port, address: bindAddress, exclusive: true }, onBound);
    } else if (bindAddress) {
        socket.bind({ port: 0, address: bindAddress, exclusive: true }, onBound);
    } else {
        socket.bind(onBound);
    }
});


const getSocket = socketId => sockets[socketId] ?? null;


// Exported
export const udpSocketOpen = async (bindAddress, port) => {
    const socketId = nextSocketId;
    nextSocketId += 1;

    const s = dgram.createSocket({
        type: 'udp4',
        reuseAddr: !bindAddress,
    });

    await bindSocket(s, bindAddress, port);

    sockets[socketId] = s;
    return socketId;
};


export const udpSocketClose = async (socketId) => {
    const socket = getSocket(socketId);
    if (!socket) return;
    delete sockets[socketId];
    try {
        await new Promise((resolve) => {
            socket.close(() => resolve());
        });
    } catch (error) {
        console.error(`UDP close socket error: ${error.message}`);
    }
};


export const udpMessageSend = (
    socketId, address, port, message, onError
) => {
    const socket = getSocket(socketId);
    if (!socket) return;
    socket.send(
        message, 0, message.length, port, address, (error) => {
            if (!error) return;
            console.error(`UDP message error: ${error}`);
            if (onError) onError(error, socketId);
        }
    );
};


export const onUDPMessageReceived = (onMessageReceived, socketId) => {
    const socket = getSocket(socketId);
    if (!socket) return () => {};

    const onReceive = (buffer, { address, port }) => {
        if (!getSocket(socketId)) return;
        onMessageReceived(buffer, address, port);
    };

    socket.on('message', onReceive);
    return () => {
        socket.off('message', onReceive);
    };
};
