'use client';

import { useEffect, useState } from 'react';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { IoChatbubbles, IoChevronUp, IoChevronDown } from 'react-icons/io5';
import {
    ChatDrawerContainer,
    ChatHeader,
    ChatTitle,
    ConversationsList,
    ConversationItem,
    Avatar,
    ConversationInfo,
    UserName,
    LastMessage,
    UnreadBadge,
    HeaderActions,
} from './ChatDrawerElements';
import type { Conversation } from '@/hooks/useUserActions';

export default function ChatDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const { getUserConversations, isLoading } = useUserActions();

    useEffect(() => {
        const fetchConversations = async () => {
            const result = await getUserConversations();
            if (result) {
                setConversations(result);
            }
        };

        if (isOpen) {
            fetchConversations();
        }
    }, [isOpen]);

    const totalUnreadCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

    return (
        <ChatDrawerContainer $isOpen={isOpen}>
            <ChatHeader $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <ChatTitle>
                    <IoChatbubbles size={20} />
                    Mensajes
                </ChatTitle>
                <HeaderActions>
                    {!isOpen && totalUnreadCount > 0 && (
                        <UnreadBadge $inHeader>
                            {totalUnreadCount}
                        </UnreadBadge>
                    )}
                    {isOpen ? (
                        <IoChevronDown size={20} color="var(--app-yellow)" />
                    ) : (
                        <IoChevronUp size={20} color="var(--app-yellow)" />
                    )}
                </HeaderActions>
            </ChatHeader>

            <ConversationsList>
                {conversations.map((conversation) => (
                    <ConversationItem key={conversation.friend.id}>
                        <Avatar
                            src={conversation.friend.avatarPath ? getImageUrl(conversation.friend.avatarPath) : '/default-avatar.png'}
                            alt={conversation.friend.name}
                        />
                        <ConversationInfo>
                            <UserName>{conversation.friend.nik}</UserName>
                            <LastMessage>{conversation.lastMessage.content}</LastMessage>
                        </ConversationInfo>
                        {conversation.unreadCount > 0 && (
                            <UnreadBadge>
                                {conversation.unreadCount}
                            </UnreadBadge>
                        )}
                    </ConversationItem>
                ))}
            </ConversationsList>
        </ChatDrawerContainer>
    );
} 