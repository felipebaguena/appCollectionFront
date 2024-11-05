'use client';

import styled from 'styled-components';

const WelcomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--navbar-height));
`;

const WelcomeText = styled.h1`
  color: var(--dark-grey);
  font-size: 2rem;
  text-align: center;
`;

export default function HomePage() {
    return (
        <WelcomeContainer>
            <WelcomeText>Bienvenido a mi colección</WelcomeText>
        </WelcomeContainer>
    );
}