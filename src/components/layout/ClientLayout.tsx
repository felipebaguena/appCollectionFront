'use client';

import React from 'react';
import styled from 'styled-components';

const MainContent = styled.main`
  min-height: calc(100vh - var(--navbar-height));
  width: 100%;
  box-sizing: border-box;
`;

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return <MainContent>{children}</MainContent>;
};

export default ClientLayout;