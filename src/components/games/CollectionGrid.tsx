'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCollectionGames, SortType, CollectionGame } from '@/hooks/useCollectionGames';
import { API_BASE_URL } from '@/services/api';
import Link from 'next/link';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0 1rem;
  min-width: 0;
  width: 100%;
  transition: all 0.3s ease-in-out;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Pagination = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const PageButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: 8px 12px;
  border: none;
  background-color: ${props => props.active ? 'var(--app-yellow)' : 'var(--background)'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    background-color: ${props => props.disabled ? 'var(--background)' : 'var(--app-yellow)'};
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
  margin: 0;
  font-size: 18px;
  color: var(--dark-grey);
  font-weight: bold;
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

const ITEMS_PER_PAGE = 10;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: 2rem;
`;

const Content = styled.div`
  flex: 1;
`;

const PaginationContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

interface CollectionGridProps {
  selectedPlatformIds: number[];
  selectedGenreIds: number[];
  sortType: SortType;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({
  selectedPlatformIds,
  selectedGenreIds,
  sortType
}) => {
  const { games, loading, error, totalPages, fetchCollectionGames } = useCollectionGames();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const filter = {
      ...(selectedPlatformIds.length > 0 && { platformIds: selectedPlatformIds }),
      ...(selectedGenreIds.length > 0 && { genreIds: selectedGenreIds })
    };

    fetchCollectionGames({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortType
    }, Object.keys(filter).length > 0 ? filter : undefined);
  }, [currentPage, sortType, selectedPlatformIds, selectedGenreIds, fetchCollectionGames]);

  const getGameImageUrl = (game: CollectionGame) => {
    return game.coverImage
      ? `${API_BASE_URL}/${game.coverImage.path}`
      : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
  };

  if (loading) return <p>Cargando colección...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!games || games.length === 0) return <p>No hay juegos disponibles</p>;

  return (
    <Container>
      <Content>
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
                </GameContent>
              </GameCard>
            </StyledLink>
          ))}
        </GridContainer>
      </Content>

      <PaginationContainer>
        <Pagination>
          <PageButton
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </PageButton>

          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
              disabled={totalPages <= 1}
            >
              {page}
            </PageButton>
          ))}

          <PageButton
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages <= 1}
          >
            Siguiente
          </PageButton>
        </Pagination>
      </PaginationContainer>
    </Container>
  );
};

export default CollectionGrid;