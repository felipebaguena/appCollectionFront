import React from 'react';
import styled from 'styled-components';
import { useNotification } from '@/contexts/NotificationContext';

const NotificationContainer = styled.div`
  position: fixed;
  top: 4rem;
  right: 0.5rem;
  max-width: 300px;
`;

const NotificationItem = styled.div<{ type: 'success' | 'error' }>`
  background-color: ${props => props.type === 'success' ? '#4CAF50' : '#f44336'};
  color: white;
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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