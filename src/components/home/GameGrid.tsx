'use client'

import React from 'react';
import styled from 'styled-components';
import { useGames } from '@/hooks/useGames';
import { API_BASE_URL } from '@/services/api';

interface Game {
  id: number;
  title: string;
  releaseYear: number;
  description: string;
  coverId: number | null;
  images: { id: number; path: string; isCover: boolean }[];
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const GameCard = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const GameImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const GameTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: bold;
`;

const GameYear = styled.p`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #4a4a4a;
`;

const GameDescription = styled.p`
  font-size: 14px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const GameGrid: React.FC = () => {
  const { games, loading, error } = useGames();

  if (loading) return <p>Cargando juegos...</p>;
  if (error) return <p>Error: {error}</p>;

  const getGameImageUrl = (game: Game) => {
    const coverImage = game.images.find(img => img.isCover);
    if (coverImage) {
      return `${API_BASE_URL}/${coverImage.path}`;
    }
    return `${API_BASE_URL}/uploads/resources/no-image.jpg`;
  };

  return (
    <GridContainer>
      {games.map((game) => (
        <GameCard key={game.id}>
          <GameImage
            src={getGameImageUrl(game)}
            alt={game.title}
          />
          <GameTitle>{game.title}</GameTitle>
          <GameYear>{game.releaseYear}</GameYear>
          <GameDescription>{game.description}</GameDescription>
        </GameCard>
      ))}
    </GridContainer>
  );
};

export default GameGrid;