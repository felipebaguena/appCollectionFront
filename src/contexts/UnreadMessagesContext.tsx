'use client';

import React, { createContext, useContext, useState } from 'react';

interface UnreadMessagesContextType {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: React.ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </UnreadMessagesContext.Provider>
    );
}

export function useUnreadMessages() {
    const context = useContext(UnreadMessagesContext);
    if (context === undefined) {
        throw new Error('useUnreadMessages debe usarse dentro de un UnreadMessagesProvider');
    }
    return context;
} 