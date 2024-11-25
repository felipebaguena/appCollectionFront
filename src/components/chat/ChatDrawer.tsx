'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { IoChatbubbles, IoChevronUp, IoChevronDown, IoArrowBack, IoSend } from 'react-icons/io5';
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
    ChatContent,
    MessagesList,
    MessageBubble,
    BackButton,
    MessageForm,
    MessageInputContainer,
    MessageInput,
    SendButton,
} from './ChatDrawerElements';
import type { Conversation, Message } from '@/hooks/useUserActions';

export default function ChatDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { getUserConversations, getFriendMessages, sendMessage, isLoading } = useUserActions();

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

    useEffect(() => {
        const fetchMessages = async () => {
            if (activeConversation) {
                const result = await getFriendMessages(activeConversation.friend.id.toString());
                if (result) {
                    setMessages(result);
                }
            }
        };

        fetchMessages();
    }, [activeConversation]);

    const totalUnreadCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

    const handleConversationClick = (conversation: Conversation) => {
        setActiveConversation(conversation);
    };

    const handleBack = () => {
        setActiveConversation(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const result = await sendMessage(
            activeConversation.friend.id.toString(),
            newMessage.trim()
        );

        if (result) {
            setMessages(prev => [result, ...prev]);
            setNewMessage('');
        }
    };

    return (
        <ChatDrawerContainer $isOpen={isOpen}>
            <ChatHeader $isOpen={isOpen} onClick={() => !activeConversation && setIsOpen(!isOpen)}>
                <ChatTitle>
                    {activeConversation ? (
                        <>
                            <BackButton onClick={handleBack}>
                                <IoArrowBack size={20} />
                                {activeConversation.friend.nik}
                            </BackButton>
                        </>
                    ) : (
                        <>
                            <IoChatbubbles size={20} />
                            Mensajes
                        </>
                    )}
                </ChatTitle>
                <HeaderActions>
                    {!isOpen && totalUnreadCount > 0 && (
                        <UnreadBadge $inHeader>
                            {totalUnreadCount}
                        </UnreadBadge>
                    )}
                    {!activeConversation && (
                        isOpen ? (
                            <IoChevronDown size={20} color="var(--app-yellow)" />
                        ) : (
                            <IoChevronUp size={20} color="var(--app-yellow)" />
                        )
                    )}
                </HeaderActions>
            </ChatHeader>

            <ChatContent>
                {activeConversation ? (
                    <>
                        <MessagesList>
                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    $isFromMe={message.sender.id !== activeConversation.friend.id}
                                >
                                    {message.content}
                                </MessageBubble>
                            ))}
                        </MessagesList>
                        <MessageForm onSubmit={handleSubmit}>
                            <MessageInputContainer>
                                <MessageInput
                                    type="text"
                                    placeholder="Escribir mensaje..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <SendButton type="submit" disabled={!newMessage.trim() || isLoading}>
                                    <IoSend size={18} />
                                </SendButton>
                            </MessageInputContainer>
                        </MessageForm>
                    </>
                ) : (
                    <ConversationsList>
                        {conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.friend.id}
                                onClick={() => handleConversationClick(conversation)}
                            >
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
                )}
            </ChatContent>
        </ChatDrawerContainer>
    );
} 