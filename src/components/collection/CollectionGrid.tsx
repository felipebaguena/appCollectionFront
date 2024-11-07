'use client'

import React, { useEffect, useState } from 'react';
import { useCollectionGames, CollectionGame } from '@/hooks/useCollectionGames';
import { API_BASE_URL } from '@/services/api';
import { useRouter } from 'next/navigation';
import { MdLibraryAddCheck, MdDelete, MdEdit, MdAdd } from 'react-icons/md';
import { useUserGames } from '@/hooks/useUserGames';
import { useUserGame } from '@/hooks/useUserGame';
import { useAuth } from '@/contexts/AuthContext';

import Modal from '@/components/ui/Modal';
import AddToCollectionForm from './AddToCollectionForm';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import LoginForm from '../auth/LoginForm';
import CreateUserForm from '@/components/user/CreateUserForm';

import {
  GridContainer,
  GameCardWrapper,
  GameCard,
  ImageContainer,
  ImageWrapper,
  ExpandedImageWrapper,
  GameImage,
  GameContent,
  GameTitle,
  GameInfo,
  GameYear,
  GamePlatforms,
  InfoLabel,
  AddToCollectionLabel,
  Pagination,
  PageButton,
  Container,
  Content,
  PaginationContainer,
  DeleteIcon,
  EditIcon,
  CollectionIcon,
  MobileLoginBanner,
  AddIcon,
  CompactIconsContainer,
  CompactIcon
} from './CollectionGridElements';
import { CollectionGridProps } from '@/types/collection';

const ITEMS_PER_PAGE = 9;

const CollectionGrid: React.FC<CollectionGridProps> = ({
  selectedPlatformIds,
  selectedGenreIds,
  selectedDeveloperIds,
  searchTerm,
  yearRange,
  sortType,
  collectionStatus,
  isCompactView
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<CollectionGame | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<CollectionGame | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingGame, setPendingGame] = useState<CollectionGame | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [hoveredGameId, setHoveredGameId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const { games, loading, error, totalPages, fetchCollectionGames } = useCollectionGames();
  const { addGameToCollection, isLoading: isAddingGame } = useUserGames();
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
      ...(yearRange && { yearRange }),
      collectionStatus
    };

    fetchCollectionGames({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortType
    }, filter);
  }, [currentPage, sortType, selectedPlatformIds, selectedGenreIds, selectedDeveloperIds, searchTerm, yearRange, collectionStatus, fetchCollectionGames]);

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

  useEffect(() => {
    if (!isAuthenticated) {
      fetchCollectionGames({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortType
      }, getCurrentFilter());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effectiveCompactView = isMobile && isCompactView;

  const getGameImageUrl = (game: CollectionGame) => {
    return game.coverImage
      ? `${API_BASE_URL}/${game.coverImage.path}`
      : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
  };

  const handleAddToCollection = (e: React.MouseEvent<HTMLDivElement>, game: CollectionGame) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedGameId(game.id);
    setSelectedGame(game);
    setShowAddToCollectionModal(true);
  };

  const handleEditCollection = (e: React.MouseEvent<HTMLDivElement>, game: CollectionGame) => {
    e.preventDefault();
    e.stopPropagation();
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
    ...(yearRange && { yearRange }),
    collectionStatus
  });

  const handleSubmitForm = async (formData: {
    rating?: number;
    status?: number;
    complete: boolean;
    notes?: string;
    platformIds: number[];
  }) => {
    if (selectedGameId) {
      if (isEditing) {
        const result = await updateUserGame({
          rating: formData.rating || null,
          status: formData.status || null,
          complete: formData.complete,
          notes: formData.notes || null,
          platformIds: formData.platformIds
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

  const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement>, game: CollectionGame) => {
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

  const handleLoginSuccess = async (access_token: string) => {
    login(access_token);
    setShowLoginModal(false);
    router.refresh();
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  if (loading) return <p>Cargando colección...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!games || games.length === 0) return <p>No hay juegos disponibles</p>;

  return (
    <>
      <Container>
        <Content>
          <MobileLoginBanner onClick={() => setShowLoginModal(true)}>
            Inicia sesión para gestionar tu colección
          </MobileLoginBanner>
          <GridContainer>
            {games.map((game) => (
              <GameCardWrapper
                key={game.id}
                href={`/games/${game.id}`}
                $isCompact={effectiveCompactView}
              >
                <GameCard
                  className="game-card"
                  $isCompact={effectiveCompactView}
                >
                  <ImageContainer>
                    {localStorage.getItem('access_token') && (
                      <>
                        {effectiveCompactView ? (
                          <CompactIconsContainer>
                            {game.inCollection ? (
                              <>
                                <CompactIcon
                                  variant="edit"
                                  onClick={(e) => handleEditCollection(e, game)}
                                >
                                  <MdEdit />
                                </CompactIcon>
                                <CompactIcon
                                  variant="delete"
                                  onClick={(e) => handleDeleteClick(e, game)}
                                >
                                  <MdDelete />
                                </CompactIcon>
                              </>
                            ) : (
                              <CompactIcon
                                variant="add"
                                onClick={(e) => handleAddToCollection(e, game)}
                              >
                                <MdAdd />
                              </CompactIcon>
                            )}
                          </CompactIconsContainer>
                        ) : (
                          <>
                            {!effectiveCompactView && game.inCollection && (
                              <>
                                <EditIcon onClick={(e) => handleEditCollection(e, game)}>
                                  <MdEdit />
                                </EditIcon>
                                <DeleteIcon onClick={(e) => handleDeleteClick(e, game)}>
                                  <MdDelete />
                                </DeleteIcon>
                                <CollectionIcon
                                  onClick={(e) => handleDeleteClick(e, game)}
                                  onMouseEnter={() => setHoveredGameId(game.id)}
                                  onMouseLeave={() => setHoveredGameId(null)}
                                >
                                  {hoveredGameId === game.id ? <MdDelete /> : <MdLibraryAddCheck />}
                                </CollectionIcon>
                              </>
                            )}
                            <AddIcon
                              onClick={(e) => handleAddToCollection(e, game)}
                              inCollection={game.inCollection}
                            >
                              <MdAdd />
                            </AddIcon>
                          </>
                        )}
                      </>
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
                      {!localStorage.getItem('access_token') ? (
                        <AddToCollectionLabel
                          className="add-collection-label"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowLoginModal(true);
                          }}
                        >
                          Inicia sesión para gestionar tu colección
                        </AddToCollectionLabel>
                      ) : (
                        game.inCollection ? (
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
                        )
                      )}
                      <InfoLabel className="info-label">Más información</InfoLabel>
                    </ExpandedImageWrapper>
                  </ImageContainer>
                  <GameContent $isCompact={effectiveCompactView}>
                    <GameTitle $isCompact={effectiveCompactView}>{game.title}</GameTitle>
                    <GameInfo $isCompact={effectiveCompactView}>
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
          gameId={selectedGameId || 0}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setShowAddToCollectionModal(false);
            setIsEditing(false);
            clearUserGame();
          }}
          isLoading={isAddingGame || loadingUserGame}
          initialData={isEditing && userGame ? {
            rating: typeof userGame.rating === 'string'
              ? parseFloat(userGame.rating)
              : userGame.rating,
            status: typeof userGame.status === 'string'
              ? parseFloat(userGame.status)
              : userGame.status,
            complete: userGame.complete,
            notes: userGame.notes,
            platforms: userGame.platforms || []
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

      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingGame(null);
        }}
        title="Iniciar Sesión"
      >
        <LoginForm
          onClose={() => {
            setShowLoginModal(false);
            setPendingGame(null);
          }}
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
        />
      </Modal>

      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Crear Usuario"
      >
        <CreateUserForm
          onClose={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </Modal>
    </>
  );
};

export default CollectionGrid;