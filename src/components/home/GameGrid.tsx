'use client'

import React from 'react';
import styled from 'styled-components';
import { useGames } from '@/hooks/useGames';
import { API_BASE_URL } from '@/services/api';
import Link from 'next/link';

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

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

const GameCard = styled.div`
  background-color: var(--background);
  padding: 15px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  ${GameCard}:hover & {
    opacity: 0;
  }
`;

const ExpandedImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  ${GameCard}:hover & {
    opacity: 1;
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GameContent = styled.div`
  padding: 10px 10px;
`;

const GameTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
  color: var(--dark-grey);
  font-weight: bold;
`;

const GameYear = styled.p`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--grey);
`;

const GameDescription = styled.p`
  font-size: 14px;
  color: var(--grey);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const InfoLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--app-yellow);
  color: var(--dark-grey);
  padding: 0.6rem 0.8rem;
  font-weight: bold;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.8s cubic-bezier(0.8, 0, 0.4, 1);

  ${GameCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
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
        <StyledLink href={`/games/${game.id}`} key={game.id}>
          <GameCard>
            <ImageContainer>
              <ImageWrapper>
                <GameImage
                  src={getGameImageUrl(game)}
                  alt={game.title}
                />
              </ImageWrapper>
              <ExpandedImageWrapper>
                <GameImage
                  src={getGameImageUrl(game)}
                  alt={game.title}
                />
                <InfoLabel>Más información</InfoLabel>
              </ExpandedImageWrapper>
            </ImageContainer>
            <GameContent>
              <GameTitle>{game.title}</GameTitle>
              <GameYear>{game.releaseYear}</GameYear>
              <GameDescription>{game.description}</GameDescription>
            </GameContent>
          </GameCard>
        </StyledLink>
      ))}
    </GridContainer>
  );
};

export default GameGrid;
