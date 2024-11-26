'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useUserActions } from '@/hooks/useUserActions';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl } from '@/services/api';
import { IoChatbubbles, IoChevronUp, IoChevronDown, IoArrowBack, IoSend, IoAdd } from 'react-icons/io5';
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
    MessageContainer,
    MessageTimestamp,
    ReadStatus,
} from './ChatDrawerElements';
import type { Conversation, Message } from '@/hooks/useUserActions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { isSameDay, differenceInDays } from 'date-fns';
import Modal from '@/components/ui/Modal';
import NewMessageModal from './NewMessageModal';
import { Friend } from '@/types/friends';
import { USER_PROFILE_AVATAR } from '@/constants/ui';

interface MessageGroup {
    messages: Message[];
    sender: Message['sender'];
    timestamp: string;
}

const groupMessages = (messages: Message[]): MessageGroup[] => {
    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    messages.forEach((message, index) => {
        const nextMessage = messages[index + 1];

        if (!currentGroup ||
            currentGroup.sender.id !== message.sender.id ||
            (nextMessage && differenceInDays(new Date(message.createdAt), new Date(nextMessage.createdAt)) >= 1)) {

            if (currentGroup) {
                groups.push(currentGroup);
            }

            currentGroup = {
                messages: [message],
                sender: message.sender,
                timestamp: message.createdAt
            };
        } else {
            currentGroup.messages.push(message);
            currentGroup.timestamp = message.createdAt;
        }
    });

    if (currentGroup) {
        groups.push(currentGroup);
    }

    return groups;
};

export default function ChatDrawer() {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { getUserConversations, getFriendMessages, sendMessage, isLoading } = useUserActions();
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchConversations = async () => {
            const result = await getUserConversations();
            if (result) {
                setConversations(result);
            }
        };

        fetchConversations();

        const interval = setInterval(fetchConversations, 30000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated || !isOpen) return;

        const fetchConversations = async () => {
            const result = await getUserConversations();
            if (result) {
                setConversations(result);
            }
        };
        fetchConversations();
    }, [isOpen, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated || !activeConversation) return;

        const fetchMessages = async () => {
            const result = await getFriendMessages(activeConversation.friend.id.toString());
            if (result) {
                setMessages(result);
            }
        };

        fetchMessages();
    }, [activeConversation, isAuthenticated]);

    const totalUnreadCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

    const handleConversationClick = (conversation: Conversation) => {
        setActiveConversation(conversation);
    };

    const handleBack = async () => {
        const updatedConversations = await getUserConversations();
        if (updatedConversations) {
            setConversations(updatedConversations);
        }
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

            const updatedConversations = await getUserConversations();
            if (updatedConversations) {
                setConversations(updatedConversations);
            }
        }
    };

    const formatMessageDate = (date: string) => {
        return format(new Date(date), "d MMM, HH:mm", { locale: es });
    };

    const handleNewMessage = (friend: Friend) => {
        const existingConversation = conversations.find(
            conv => conv.friend.id === friend.id
        );

        if (existingConversation) {
            setActiveConversation(existingConversation);
        } else {
            const newConversation: Conversation = {
                friend: {
                    id: friend.id,
                    name: friend.name,
                    nik: friend.nik,
                    avatarPath: friend.avatarPath
                },
                lastMessage: {
                    id: 0,
                    content: '',
                    createdAt: new Date().toISOString(),
                    read: true,
                    isFromMe: true
                },
                unreadCount: 0
            };
            setActiveConversation(newConversation);
        }
        setShowNewMessageModal(false);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
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
                        {!activeConversation && isOpen && (
                            <IoAdd
                                size={20}
                                color="var(--app-yellow)"
                                style={{ cursor: 'pointer', marginRight: '0.5rem' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNewMessageModal(true);
                                }}
                            />
                        )}
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
                                {(() => {
                                    const groups = groupMessages(messages);
                                    const lastReadGroupIndex = groups.findIndex(group =>
                                        group.sender.id !== activeConversation!.friend.id &&
                                        group.messages.every(msg => msg.read)
                                    );

                                    return groups.map((group, index) => {
                                        const isFromMe = group.sender.id !== activeConversation!.friend.id;
                                        const isLastReadMessage = index === lastReadGroupIndex;

                                        return (
                                            <MessageContainer
                                                key={`group-${group.messages[0].id}`}
                                                $isFromMe={isFromMe}
                                            >
                                                {group.messages.map((message) => (
                                                    <MessageBubble
                                                        key={message.id}
                                                        $isFromMe={isFromMe}
                                                    >
                                                        {message.content}
                                                    </MessageBubble>
                                                ))}
                                                <MessageTimestamp
                                                    $isFromMe={isFromMe}
                                                >
                                                    {formatMessageDate(group.timestamp)}
                                                    {isFromMe && isLastReadMessage && (
                                                        <ReadStatus>· visto</ReadStatus>
                                                    )}
                                                </MessageTimestamp>
                                            </MessageContainer>
                                        );
                                    });
                                })()}
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
                                        src={conversation.friend.avatarPath ? getImageUrl(conversation.friend.avatarPath) : USER_PROFILE_AVATAR}
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

            <Modal
                isOpen={showNewMessageModal}
                onClose={() => setShowNewMessageModal(false)}
                title="Nuevo mensaje"
            >
                <NewMessageModal
                    onClose={() => setShowNewMessageModal(false)}
                    onSelectFriend={handleNewMessage}
                />
            </Modal>
        </>
    );
} 