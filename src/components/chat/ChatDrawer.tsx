'use client';

import { useEffect, useState } from 'react';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { IoChatbubbles } from 'react-icons/io5';
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
    ToggleButton
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

    return (
        <>
            <ToggleButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <IoChatbubbles size={24} />
                {!isOpen && 'Chat'}
            </ToggleButton>

            <ChatDrawerContainer $isOpen={isOpen}>
                <ChatHeader>
                    <ChatTitle>Mensajes</ChatTitle>
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
                                <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                            )}
                        </ConversationItem>
                    ))}
                </ConversationsList>
            </ChatDrawerContainer>
        </>
    );
} 