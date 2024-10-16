import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNotification } from '@/contexts/NotificationContext';
import { NAVBAR_HEIGHT } from '../layout/NavbarElements';

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: ${NAVBAR_HEIGHT};
  right: 0.5rem;
  max-width: 300px;
  z-index: 1000;
`;

const NotificationItem = styled.div<{ type: 'success' | 'error' }>`
  background-color: ${props => props.type === 'success' ? '#4CAF50' : '#f44336'};
  color: white;
  padding: 16px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  animation: ${slideDown} 0.5s ease forwards, ${slideUp} 0.5s ease forwards 2.5s;
`;

const NotificationDisplay: React.FC = () => {
    const { notifications } = useNotification();
    return (
        <NotificationContainer>
            {notifications.map((notification, index) => (
                <NotificationItem key={index} type={notification.type}>
                    {notification.message}
                </NotificationItem>
            ))}
        </NotificationContainer>
    );
};

export default NotificationDisplay;
