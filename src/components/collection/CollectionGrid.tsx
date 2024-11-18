'use client'

import React, { useEffect, useState } from 'react';
import { useCollectionGames, CollectionGame } from '@/hooks/useCollectionGames';
import { API_BASE_URL } from '@/services/api';
import { useRouter } from 'next/navigation';
import { MdLibraryAddCheck, MdDelete, MdEdit, MdAdd, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
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
  GameImage,
  GameContent,
  GameTitle,
  GameInfo,
  GameYear,
  GamePlatforms,
  InfoLabel,
  AddToCollectionLabel,
  Container,
  Content,
  DeleteIcon,
  EditIcon,
  CollectionIcon,
  MobileLoginBanner,
  AddIcon,
  WishlistIcon,
  CompactWishlistIcon
} from './CollectionGridElements';
import { CollectionGridProps } from '@/types/collection';
import PaginationGrid from '../ui/PaginationGrid';

const ITEMS_PER_PAGE = 40;

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
          ...formData,
          owned: true,
          wished: false
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

  const handleToggleWishlist = async (e: React.MouseEvent<HTMLDivElement>, game: CollectionGame) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (game.wished) {
        // Si ya está en deseados, mostramos el modal de confirmación
        setGameToDelete(game);
        setShowDeleteModal(true);
      } else {
        // Si no está en deseados, lo añadimos
        await addGameToCollection({
          gameId: game.id,
          owned: false,
          wished: true
        });

        // Recargar el grid con los filtros actuales
        await fetchCollectionGames({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortType
        }, getCurrentFilter());
      }
    } catch (error) {
      console.error('Error al gestionar la lista de deseados:', error);
    }
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
          <GridContainer $isCompact={effectiveCompactView}>
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
                        {!isMobile ? (
                          // Vista normal en desktop
                          <>
                            {game.owned && (
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
                            {!game.owned && (
                              <>
                                <AddIcon
                                  onClick={(e) => handleAddToCollection(e, game)}
                                  inCollection={false}
                                >
                                  <MdAdd />
                                </AddIcon>
                                {game.wished && (
                                  <WishlistIcon
                                    onClick={(e) => handleDeleteClick(e, game)}
                                    onMouseEnter={() => setHoveredGameId(game.id)}
                                    onMouseLeave={() => setHoveredGameId(null)}
                                  >
                                    {hoveredGameId === game.id ? <MdDelete /> : <MdFavorite />}
                                  </WishlistIcon>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          // Vista móvil (tanto compacta como normal)
                          <>
                            {game.owned ? (
                              <>
                                <EditIcon $isCompact={true} onClick={(e) => handleEditCollection(e, game)}>
                                  <MdEdit />
                                </EditIcon>
                                <DeleteIcon $isCompact={true} onClick={(e) => handleDeleteClick(e, game)}>
                                  <MdDelete />
                                </DeleteIcon>
                                <CollectionIcon $isCompact={true}>
                                  <MdLibraryAddCheck />
                                </CollectionIcon>
                              </>
                            ) : (
                              <>
                                <AddIcon
                                  $isCompact={true}
                                  onClick={(e) => handleAddToCollection(e, game)}
                                  inCollection={false}
                                >
                                  <MdAdd />
                                </AddIcon>
                                {game.wished ? (
                                  <CompactWishlistIcon
                                    $isCompact={true}
                                    onClick={(e) => handleDeleteClick(e, game)}
                                  >
                                    <MdFavorite />
                                  </CompactWishlistIcon>
                                ) : (
                                  !game.owned && (
                                    <CompactWishlistIcon
                                      $isCompact={true}
                                      onClick={(e) => handleToggleWishlist(e, game)}
                                    >
                                      <MdFavoriteBorder />
                                    </CompactWishlistIcon>
                                  )
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
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
                      <>
                        {!game.owned && !game.wished && (
                          <InfoLabel
                            className="info-label"
                            onClick={(e) => handleToggleWishlist(e, game)}
                          >
                            Añadir a deseados
                          </InfoLabel>
                        )}
                        {game.wished && (
                          <InfoLabel
                            className="info-label"
                            onClick={(e) => handleToggleWishlist(e, game)}
                          >
                            Eliminar de deseados
                          </InfoLabel>
                        )}
                        {game.owned ? (
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
                      </>
                    )}
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

        <PaginationGrid
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={setCurrentPage}
        />
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