import styled from "styled-components";

interface ChatDrawerContainerProps {
  $isOpen: boolean;
}

export const ChatDrawerContainer = styled.div<ChatDrawerContainerProps>`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 400px;
  height: ${({ $isOpen }) => ($isOpen ? "calc(100vh - 10rem)" : "45px")};
  background-color: var(--background);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: height 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

interface ChatHeaderProps {
  $isOpen: boolean;
}

export const ChatHeader = styled.div<ChatHeaderProps>`
  padding: ${({ $isOpen }) => ($isOpen ? "1rem" : "0.5rem 1rem")};
  background-color: var(--dark-grey);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: var(--mid-grey);
  }
`;

export const ChatTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: var(--app-yellow);
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--clear-grey);
  }
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
`;

export const ConversationInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  font-weight: 600;
  color: var(--dark-grey);
`;

export const LastMessage = styled.div`
  color: var(--mid-grey);
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

interface UnreadBadgeProps {
  $inHeader?: boolean;
}

export const UnreadBadge = styled.div<UnreadBadgeProps>`
  background-color: ${({ $inHeader }) =>
    $inHeader ? "var(--app-yellow)" : "var(--dark-grey)"};
  color: ${({ $inHeader }) =>
    $inHeader ? "var(--dark-grey)" : "var(--app-yellow)"};
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  padding: 0 6px;
`;

export const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface MessageBubbleProps {
  $isFromMe: boolean;
}

export const MessageBubble = styled.div<MessageBubbleProps>`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  align-self: ${({ $isFromMe }) => ($isFromMe ? "flex-end" : "flex-start")};
  background-color: ${({ $isFromMe }) =>
    $isFromMe ? "var(--dark-grey)" : "var(--clear-grey)"};
  color: ${({ $isFromMe }) =>
    $isFromMe ? "var(--app-yellow)" : "var(--dark-grey)"};
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--app-yellow);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;
