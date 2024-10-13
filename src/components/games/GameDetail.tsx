'use client';

import React from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from '@/services/api';
import { useGame } from '@/hooks/useGame';

interface GameDetailsProps {
    id: string;
}

const DetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const GameTitle = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const GameYear = styled.p`
  font-size: 1rem;
  color: #4a4a4a;
  margin-bottom: 20px;
`;

const GameDescription = styled.p`
  font-size: 1rem;
  color: #333333;
  margin-bottom: 20px;
`;

const GameImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const GameDetails: React.FC<GameDetailsProps> = ({ id }) => {
    const { game, loading, error } = useGame(id);

    if (loading) return <p>Cargando detalles del juego...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!game) return <p>No se encontró el juego</p>;

    const coverImage = game.images.find(img => img.isCover);

    return (
        <DetailsContainer>
            {coverImage && <GameImage src={`${API_BASE_URL}/${coverImage.path}`} alt={game.title} />}
            <GameTitle>{game.title}</GameTitle>
            <GameYear>Año de lanzamiento: {game.releaseYear}</GameYear>
            <GameDescription>{game.description}</GameDescription>
        </DetailsContainer>
    );
};

export default GameDetails;
