'use client';

import React from 'react';
import { MainContent } from './LayoutElements';
import { LogProvider } from '@/contexts/LogContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LogDisplay from '../logs/LogDisplay';
import NotificationDisplay from '../notifications/NotificationDisplay';

interface ClientLayoutProps {
  children: React.ReactNode;
  showLogs?: boolean;
}

const ClientLayoutInner: React.FC<ClientLayoutProps> = ({ children, showLogs }) => {
  return (
    <MainContent>
      {children}
      {showLogs && <LogDisplay />}
      <NotificationDisplay />
    </MainContent>
  );
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, showLogs = false }) => {
  return (
    <LogProvider>
      <NotificationProvider>
        <ClientLayoutInner showLogs={showLogs}>{children}</ClientLayoutInner>
      </NotificationProvider>
    </LogProvider>
  );
};

export default ClientLayout;
