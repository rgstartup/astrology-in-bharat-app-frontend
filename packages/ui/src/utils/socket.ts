import { io, Socket } from 'socket.io-client';

const getRawUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543';
const API_URL = getRawUrl().replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "");

// Notification Socket
export const notificationSocket: Socket = io(`${API_URL}/notifications`, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
});

// Support Socket (for disputes)
export const supportSocket: Socket = io(`${API_URL}/support`, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
});

export const getNotificationSocket = (): Socket => {
    return notificationSocket;
};

export const getSupportSocket = (): Socket => {
    return supportSocket;
};

export const connectNotificationSocket = (userId: number) => {
    const socket = getNotificationSocket();
    if (!socket.connected) {
        socket.connect();
    }
    // Register user to receive notifications
    socket.emit('register_user', { userId });
};

export const disconnectNotificationSocket = () => {
    const socket = getNotificationSocket();
    socket.disconnect();
};

// Admin Socket (for admin dashboard)
export const connectAdminSocket = () => {
    const socket = getNotificationSocket();
    if (!socket.connected) {
        socket.connect();
    }
    socket.emit('register_admin');
};



