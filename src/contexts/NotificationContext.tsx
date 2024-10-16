import React, { createContext, useState, useContext, useCallback } from 'react';

interface Notification {
    message: string;
    type: 'success' | 'error';
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let globalAddNotification: ((notification: Notification) => void) | null = null;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Notification) => {
        setNotifications(prevNotifications => [...prevNotifications, notification]);
        setTimeout(() => {
            setNotifications(prevNotifications => prevNotifications.slice(1));
        }, 3000);
    }, []);

    globalAddNotification = addNotification;

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const showNotification = (message: string, type: 'success' | 'error') => {
    if (globalAddNotification) {
        globalAddNotification({ message, type });
    }
};