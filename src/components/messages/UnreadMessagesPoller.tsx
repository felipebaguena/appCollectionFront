'use client';

import { useEffect } from 'react';
import { useUserActions } from '@/hooks/useUserActions';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from '@/contexts/UnreadMessagesContext';

const POLLING_INTERVAL = 30000; // 30 segundos

export default function UnreadMessagesPoller() {
    const { getUnreadMessages } = useUserActions();
    const { isAuthenticated } = useAuth();
    const { setUnreadCount, setHasUnreadComments } = useUnreadMessages();

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchMessages = async () => {
            const response = await getUnreadMessages();
            if (response !== null) {
                setUnreadCount(response.unreadChats);
                setHasUnreadComments(response.unreadComments);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, POLLING_INTERVAL);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return null;
} 