'use client';

import React from 'react';
import { MainContent } from './LayoutElements';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return <MainContent>{children}</MainContent>;
};

export default ClientLayout;