'use client';

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
`;

export default function CollectionPage() {
    return (
        <Container>
            <MainTitle>Gestión de juegos</MainTitle>
        </Container>
    );
}
