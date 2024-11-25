'use client';

import { useEffect } from 'react';
import { useUserActions } from '@/hooks/useUserActions';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from '@/contexts/UnreadMessagesContext';

const POLLING_INTERVAL = 30000; // 30 segundos

export default function UnreadMessagesPoller() {
    const { getUnreadMessages } = useUserActions();
    const { isAuthenticated } = useAuth();
    const { setUnreadCount } = useUnreadMessages();

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchMessages = async () => {
            const count = await getUnreadMessages();
            if (count !== null) {
                setUnreadCount(count);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, POLLING_INTERVAL);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return null;
} 