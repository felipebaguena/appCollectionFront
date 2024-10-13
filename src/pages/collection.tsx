import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  font-weight: bold;
`;

const CollectionPage: React.FC = () => {
    return (
        <Container>
            Toda la colección
        </Container>
    );
};

export default CollectionPage;