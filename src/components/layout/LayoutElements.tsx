'use client'

import styled from 'styled-components';
import { NAVBAR_HEIGHT } from './NavbarElements';
import { FOOTER_HEIGHT } from './FooterElements';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  padding-top: ${NAVBAR_HEIGHT};
  padding-bottom: ${FOOTER_HEIGHT};
`;