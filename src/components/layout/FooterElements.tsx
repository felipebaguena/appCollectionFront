'use client';

import styled from 'styled-components';

export const FOOTER_HEIGHT = '3.5rem';

export const FooterContainer = styled.footer`
  height: ${FOOTER_HEIGHT};
  background-color: var(--dark-grey);
  color: var(--white);
  padding: 1rem 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;