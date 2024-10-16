'use client';

import React from 'react';
import { MainContent } from './LayoutElements';
import { LogProvider } from '@/contexts/LogContext';
import LogDisplay from '../logs/LogDisplay';


interface ClientLayoutProps {
  children: React.ReactNode;
  showLogs?: boolean;
}

const ClientLayoutInner: React.FC<ClientLayoutProps> = ({ children, showLogs }) => {
  return (
    <MainContent>
      {children}
      {showLogs && <LogDisplay />}
    </MainContent>
  );
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, showLogs = false }) => {
  return (
    <LogProvider>
      <ClientLayoutInner showLogs={showLogs}>{children}</ClientLayoutInner>
    </LogProvider>
  );
};

export default ClientLayout;
