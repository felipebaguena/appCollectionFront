'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useCollectionGames, SortType, CollectionGame } from '@/hooks/useCollectionGames';
import { API_BASE_URL } from '@/services/api';

import Modal from '@/components/ui/Modal';
import AddToCollectionForm from './AddToCollectionForm';
import { MdLibraryAddCheck, MdDelete } from 'react-icons/md';
import { useUserGames } from '@/hooks/useUserGames';
import { useUserGame } from '@/hooks/useUserGame';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const ITEMS_PER_PAGE = 9;

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 1rem;
  width: 100%;
  justify-content: flex-start;
  max-width: 1600px;
  margin: 0 auto;
`;

const GameCardWrapper = styled(Link)`
  flex: 0 0 auto;
  width: calc(33.333% - 14px);
  max-width: 400px;
  min-width: 300px;
  margin: 0;
  text-decoration: none;
  position: relative;

  @media (max-width: 1200px) {
    width: calc(50% - 10px);
    max-width: 400px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    min-width: 250px;
  }

  &:hover {
    .image-wrapper {
      opacity: 0;
    }

    .expanded-wrapper {
      opacity: 1;
    }

    .info-label, .add-collection-label {
      opacity: 1;
      transform: translateY(0);
    }

    .game-card {
      transform: translateY(-2px);
    }
  }
`;

const GameCard = styled.div`
  background-color: var(--background);
  padding: 15px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: 100%;
  transition: transform 0.2s ease-in-out;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ExpandedImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const GameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const GameContent = styled.div`
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const GameTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: var(--dark-grey);
  font-weight: bold;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--grey);
`;

const GameYear = styled.span``;

const GamePlatforms = styled.span``;

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
  transition: all 0.6s cubic-bezier(0.8, 0, 0.4, 1);
`;

const AddToCollectionLabel = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  background-color: var(--grey);
  color: white;
  padding: 0.6rem 0.8rem;
  font-weight: bold;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.6s cubic-bezier(0.8, 0, 0.4, 1);
  cursor: pointer;

  &:hover {
    background-color: var(--dark-grey);
    transition: background-color 0.4s ease;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: 2rem;
  width: 100%;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
`;

const PaginationContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const CollectionIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--app-yellow);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--app-red);
    
    svg {
      color: white;
    }
  }

  svg {
    color: var(--dark-grey);
    font-size: 1.5rem;
    transition: all 0.3s ease;
  }
`;

interface CollectionGridProps {
  selectedPlatformIds: number[];
  selectedGenreIds: number[];
  selectedDeveloperIds: number[];
  searchTerm: string;
  yearRange: { start: number | null; end: number | null } | null;
  sortType: SortType;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({
  selectedPlatformIds,
  selectedGenreIds,
  selectedDeveloperIds,
  searchTerm,
  yearRange,
  sortType
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<CollectionGame | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<CollectionGame | null>(null);
  const [isHoveringIcon, setIsHoveringIcon] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { games, loading, error, totalPages, fetchCollectionGames } = useCollectionGames();
  const { addGameToCollection, isLoading: isAddingGame, error: addGameError } = useUserGames();
  const {
    userGame,
    loading: loadingUserGame,
    updateUserGame,
    fetchUserGame,
    clearUserGame,
    deleteUserGame
  } = useUserGame(selectedGameId || 0);

  useEffect(() => {
    const filter = {
      search: searchTerm,
      ...(selectedPlatformIds.length > 0 && { platformIds: selectedPlatformIds }),
      ...(selectedGenreIds.length > 0 && { genreIds: selectedGenreIds }),
      ...(selectedDeveloperIds.length > 0 && { developerIds: selectedDeveloperIds }),
      ...(yearRange && { yearRange })
    };

    fetchCollectionGames({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortType
    }, filter);
  }, [currentPage, sortType, selectedPlatformIds, selectedGenreIds, selectedDeveloperIds, searchTerm, yearRange, fetchCollectionGames]);

  useEffect(() => {
    if (isEditing && selectedGameId && showAddToCollectionModal) {
      fetchUserGame();
    }
  }, [isEditing, selectedGameId, showAddToCollectionModal, fetchUserGame]);

  useEffect(() => {
    if (gameToDelete) {
      setSelectedGameId(gameToDelete.id);
    }
  }, [gameToDelete]);

  const getGameImageUrl = (game: CollectionGame) => {
    return game.coverImage
      ? `${API_BASE_URL}/${game.coverImage.path}`
      : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
  };

  const handleAddToCollection = (e: React.MouseEvent, game: CollectionGame) => {
    e.preventDefault();
    setSelectedGameId(game.id);
    setSelectedGame(game);
    setShowAddToCollectionModal(true);
  };

  const handleEditCollection = async (e: React.MouseEvent, game: CollectionGame) => {
    e.preventDefault();
    setSelectedGameId(game.id);
    setSelectedGame(game);
    setIsEditing(true);
    setShowAddToCollectionModal(true);
  };

  const getCurrentFilter = () => ({
    search: searchTerm,
    ...(selectedPlatformIds.length > 0 && { platformIds: selectedPlatformIds }),
    ...(selectedGenreIds.length > 0 && { genreIds: selectedGenreIds }),
    ...(selectedDeveloperIds.length > 0 && { developerIds: selectedDeveloperIds }),
    ...(yearRange && { yearRange })
  });

  const handleSubmitForm = async (formData: {
    rating?: number;
    status?: number;
    complete: boolean;
    notes?: string;
  }) => {
    if (selectedGameId) {
      if (isEditing) {
        const result = await updateUserGame({
          rating: formData.rating || null,
          status: formData.status || null,
          complete: formData.complete,
          notes: formData.notes || null
        });

        if (result) {
          setShowAddToCollectionModal(false);
          await fetchCollectionGames({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortType
          }, getCurrentFilter());
        }
      } else {
        const result = await addGameToCollection({
          gameId: selectedGameId,
          ...formData
        });

        if (result) {
          setShowAddToCollectionModal(false);

          // Recargar el grid con los filtros actuales
          const filter = {
            search: searchTerm,
            ...(selectedPlatformIds.length > 0 && { platformIds: selectedPlatformIds }),
            ...(selectedGenreIds.length > 0 && { genreIds: selectedGenreIds }),
            ...(selectedDeveloperIds.length > 0 && { developerIds: selectedDeveloperIds }),
            ...(yearRange && { yearRange })
          };

          await fetchCollectionGames({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sortType
          }, filter);
        }
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, game: CollectionGame) => {
    e.preventDefault();
    e.stopPropagation();
    setGameToDelete(game);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (gameToDelete) {
      try {
        await deleteUserGame();
        await fetchCollectionGames({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortType
        }, getCurrentFilter());
        setShowDeleteModal(false);
        setGameToDelete(null);
        setSelectedGameId(null);
      } catch (error) {
        console.error('Error al eliminar el juego:', error);
      }
    }
  };

  if (loading) return <p>Cargando colección...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!games || games.length === 0) return <p>No hay juegos disponibles</p>;

  return (
    <>
      <Container>
        <Content>
          <GridContainer>
            {games.map((game) => (
              <GameCardWrapper key={game.id} href={`/games/${game.id}`}>
                <GameCard className="game-card">
                  <ImageContainer>
                    {game.inCollection && (
                      <CollectionIcon
                        onMouseEnter={() => setIsHoveringIcon(game.id)}
                        onMouseLeave={() => setIsHoveringIcon(null)}
                        onClick={(e) => handleDeleteClick(e, game)}
                      >
                        {isHoveringIcon === game.id ? <MdDelete /> : <MdLibraryAddCheck />}
                      </CollectionIcon>
                    )}
                    <ImageWrapper className="image-wrapper">
                      <GameImage
                        src={getGameImageUrl(game)}
                        alt={game.title}
                      />
                    </ImageWrapper>
                    <ExpandedImageWrapper className="expanded-wrapper">
                      <GameImage
                        src={getGameImageUrl(game)}
                        alt={game.title}
                      />
                      {game.inCollection ? (
                        <AddToCollectionLabel
                          className="add-collection-label"
                          onClick={(e) => handleEditCollection(e, game)}
                        >
                          Editar juego de colección
                        </AddToCollectionLabel>
                      ) : (
                        <AddToCollectionLabel
                          className="add-collection-label"
                          onClick={(e) => handleAddToCollection(e, game)}
                        >
                          Añadir a la colección
                        </AddToCollectionLabel>
                      )}
                      <InfoLabel className="info-label">Más información</InfoLabel>
                    </ExpandedImageWrapper>
                  </ImageContainer>
                  <GameContent>
                    <GameTitle>{game.title}</GameTitle>
                    <GameInfo>
                      <GameYear>{game.releaseYear}</GameYear>
                      <GamePlatforms>
                        {game.platforms.length > 2
                          ? "Multiplataforma"
                          : game.platforms.map(p => p.name).join(" / ")}
                      </GamePlatforms>
                    </GameInfo>
                  </GameContent>
                </GameCard>
              </GameCardWrapper>
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

      <Modal
        isOpen={showAddToCollectionModal}
        onClose={() => {
          setShowAddToCollectionModal(false);
          setIsEditing(false);
          clearUserGame();
        }}
        title={selectedGame
          ? isEditing
            ? `Editar ${selectedGame.title} en mi colección`
            : `Añadir ${selectedGame.title} a mi colección`
          : 'Añadir a mi colección'}
      >
        <AddToCollectionForm
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setShowAddToCollectionModal(false);
            setIsEditing(false);
            clearUserGame();
          }}
          isLoading={isAddingGame || loadingUserGame}
          initialData={isEditing && userGame ? {
            rating: userGame.rating ? parseFloat(String(userGame.rating)) : 0,
            status: userGame.status ? parseFloat(String(userGame.status)) : 0,
            complete: userGame.complete,
            notes: userGame.notes
          } : undefined}
          isEditing={isEditing}
        />
      </Modal>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setGameToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar juego de la colección"
        message={`¿Estás seguro de que quieres eliminar ${gameToDelete?.title} de tu colección?`}
        confirmText="Eliminar"
        confirmVariant="danger"
      />
    </>
  );
};

export default CollectionGrid;