'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCollectionGames, SortType, CollectionGame } from '@/hooks/useCollectionGames';
import { API_BASE_URL } from '@/services/api';
import Link from 'next/link';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--grey);
`;

const Pagination = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 20px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: none;
  background-color: ${props => props.active ? 'var(--app-yellow)' : 'var(--background)'};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: var(--app-yellow);
  }
`;

const GameCard = styled.div`
  background-color: var(--background);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GameImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const GameTitle = styled.h3`
  padding: 10px;
  margin: 0;
  text-align: center;
  color: var(--dark-grey);
`;

const ITEMS_PER_PAGE = 12;

const CollectionGrid: React.FC = () => {
    const { games, loading, error, totalPages, fetchCollectionGames } = useCollectionGames();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortType, setSortType] = useState<SortType>("YEAR_DESC");

    useEffect(() => {
        fetchCollectionGames({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortType
        });
    }, [currentPage, sortType, fetchCollectionGames]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortType(event.target.value as SortType);
        setCurrentPage(1);
    };

    const getGameImageUrl = (game: CollectionGame) => {
        return game.coverImage
            ? `${API_BASE_URL}/${game.coverImage.path}`
            : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
    };

    if (loading) return <p>Cargando colección...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!games || games.length === 0) return <p>No hay juegos disponibles</p>;

    return (
        <div>
            <Controls>
                <Select value={sortType} onChange={handleSortChange}>
                    <option value="TITLE_ASC">Título (A-Z)</option>
                    <option value="TITLE_DESC">Título (Z-A)</option>
                    <option value="YEAR_ASC">Año (Antiguo-Nuevo)</option>
                    <option value="YEAR_DESC">Año (Nuevo-Antiguo)</option>
                </Select>
            </Controls>

            <GridContainer>
                {games.map((game) => (
                    <Link href={`/games/${game.id}`} key={game.id} style={{ textDecoration: 'none' }}>
                        <GameCard>
                            <GameImage src={getGameImageUrl(game)} alt={game.title} />
                            <GameTitle>{game.title}</GameTitle>
                        </GameCard>
                    </Link>
                ))}
            </GridContainer>

            {totalPages > 1 && (
                <Pagination>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PageButton
                            key={page}
                            active={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </PageButton>
                    ))}
                </Pagination>
            )}
        </div>
    );
};

export default CollectionGrid;