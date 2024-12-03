'use client';

import React, { createContext, useContext, useState } from 'react';

interface UnreadMessagesContextType {
    unreadCount: number;
    hasUnreadComments: boolean;
    setUnreadCount: (count: number) => void;
    setHasUnreadComments: (hasUnread: boolean) => void;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: React.ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasUnreadComments, setHasUnreadComments] = useState(false);

    return (
        <UnreadMessagesContext.Provider value={{
            unreadCount,
            hasUnreadComments,
            setUnreadCount,
            setHasUnreadComments
        }}>
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