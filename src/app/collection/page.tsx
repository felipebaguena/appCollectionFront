'use client';

import CollectionGrid from "@/components/games/CollectionGrid";
import styled from 'styled-components';

const Title = styled.h1`
  color: var(--dark-grey);
  text-align: center;
  margin: 1rem 0 1rem 0;
`;

export default function CollectionPage() {
  return (
    <main>
      <Title>Colección de Juegos</Title>
      <CollectionGrid />
    </main>
  );
}
