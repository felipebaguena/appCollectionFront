'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCollectionGames, SortType, CollectionGame } from '@/hooks/useCollectionGames';
import { API_BASE_URL } from '@/services/api';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import CollectionPlatformFilter from '@/components/collection/CollectionPlatformFilter';
import { Platform } from '@/types/platform';
import { NAVBAR_HEIGHT } from '../layout/NavbarElements';
import { IoClose, IoFilter } from 'react-icons/io5';

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

const GridSection = styled.div`
  display: flex;
  gap: 20px;
  min-width: 0;
  transition: gap 0.3s ease-in-out;
`;

const FiltersPanel = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? 'auto' : '0'};
  min-width: ${props => props.isOpen ? 'auto' : '0'};
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  padding: ${props => props.isOpen ? '20px' : '0'};
  margin-top: 20px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};

  @media (max-width: 568px) {
    position: fixed;
    display: flex;
    justify-content: center;
    top: ${NAVBAR_HEIGHT};
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background: white;
    z-index: 1000;
    margin: 0;
    padding: ${props => props.isOpen ? '2rem' : '0'};
  }
`;

const CloseFiltersButton = styled.button`
  display: none;

  @media (max-width: 568px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px 16px;
    background-color: var(--app-yellow);
    border: none;
    cursor: pointer;
    color: var(--dark-grey);
    font-weight: bold;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const FiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--dark-grey);
  font-weight: bold;
  font-size: 1rem;
  margin-right: auto;
`;

const PaginationContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const CollectionGrid: React.FC = () => {
    const { games, loading, error, totalPages, fetchCollectionGames } = useCollectionGames();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortType, setSortType] = useState<SortType>("YEAR_DESC");
    const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);

    useEffect(() => {
        fetchCollectionGames({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortType
        });
    }, [currentPage, sortType, fetchCollectionGames]);

    const sortOptions = [
        { value: 'TITLE_ASC', label: 'Título (A-Z)' },
        { value: 'TITLE_DESC', label: 'Título (Z-A)' },
        { value: 'YEAR_ASC', label: 'Año (Ascendente)' },
        { value: 'YEAR_DESC', label: 'Año (Descendente)' }
    ];

    const handleSortChange = (value: string) => {
        setSortType(value as SortType);
        setCurrentPage(1);
    };

    const getGameImageUrl = (game: CollectionGame) => {
        return game.coverImage
            ? `${API_BASE_URL}/${game.coverImage.path}`
            : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
    };

    const handlePlatformsChange = (platforms: Platform[]) => {
        console.log('Plataformas seleccionadas:', platforms);
    };

    if (loading) return <p>Cargando colección...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!games || games.length === 0) return <p>No hay juegos disponibles</p>;

    return (
        <Container>
            <Content>
                <Controls>
                    <FiltersButton onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}>
                        Filtros <IoFilter size={18} />
                    </FiltersButton>
                    <CustomSelect
                        options={sortOptions}
                        value={sortType}
                        onChange={handleSortChange}
                        placeholder="Ordenar por..."
                    />
                </Controls>

                <GridSection>
                    <FiltersPanel isOpen={isFiltersPanelOpen}>
                        <CloseFiltersButton onClick={() => setIsFiltersPanelOpen(false)}>
                            <IoClose size={20} />
                        </CloseFiltersButton>
                        <CollectionPlatformFilter onPlatformsChange={handlePlatformsChange} />
                    </FiltersPanel>

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
                </GridSection>
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