import { io, Socket } from 'socket.io-client';

import { getBasePath } from './api-config';

const API_URL = getBasePath();

// Notification Socket
let notificationSocket: Socket | null = null;

export const getNotificationSocket = (): Socket => {
    if (!notificationSocket) {
        notificationSocket = io(`${API_URL}/notifications`, {
            autoConnect: false,
            transports: ['websocket', 'polling'],
        });
    }
    return notificationSocket;
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

// Support Socket (for disputes chat)
let supportSocket: Socket | null = null;

export const getSupportSocket = (): Socket => {
    if (!supportSocket) {
        supportSocket = io(`${API_URL}/support`, {
            autoConnect: false,
            transports: ['websocket', 'polling'],
        });
    }
    return supportSocket;
};

// Admin Socket (for admin dashboard)
export const connectAdminSocket = () => {
    const socket = getNotificationSocket();
    if (!socket.connected) {
        socket.connect();
    }
    socket.emit('register_admin');
};



