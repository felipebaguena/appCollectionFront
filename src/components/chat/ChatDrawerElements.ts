import styled from "styled-components";

interface ToggleButtonProps {
  $isOpen: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
  position: fixed;
  right: ${({ $isOpen }) => ($isOpen ? "400px" : "20px")};
  bottom: 20px;
  background-color: var(--mid-grey);
  color: white;
  border: none;
  border-radius: ${({ $isOpen }) => ($isOpen ? "8px 0 0 8px" : "8px")};
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1001;

  &:hover {
    background-color: var(--dark-grey);
  }
`;

interface ChatDrawerContainerProps {
  $isOpen: boolean;
}

export const ChatDrawerContainer = styled.div<ChatDrawerContainerProps>`
  position: fixed;
  right: ${({ $isOpen }) => ($isOpen ? "0" : "-400px")};
  bottom: 0;
  width: 400px;
  height: calc(100vh - 60px);
  background-color: var(--background);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-radius: 8px 0 0 0;
  margin-bottom: 0;
`;

export const ChatHeader = styled.div`
  padding: 1rem;
  background-color: var(--dark-grey);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ChatTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: var(--app-yellow);
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

export const UnreadBadge = styled.div`
  background-color: var(--dark-grey);
  color: var(--app-yellow);
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  padding: 0 6px;
`;
