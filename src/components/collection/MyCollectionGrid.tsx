'use client'

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { UserGameInCollection } from '@/types/collection';
import CollectionCard from './CollectionCard';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useUserGame } from '@/hooks/useUserGame';
import Modal from '@/components/ui/Modal';
import AddToCollectionForm from './AddToCollectionForm';
import { Platform } from '@/types/game';
import CompactCollectionCard from './CompactCollectionCard';
import PaginationGrid from '../ui/PaginationGrid';
import { useUserGames } from '@/hooks/useUserGames';

const Container = styled.div<{ $isCompact?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  
  ${props => props.$isCompact && `
    max-width: 1240px; // Ajusta esto según necesites (200px * 6 cards + gaps)
    margin: 0 auto;
  `}
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1.5rem;
  justify-content: flex-start;
  width: 100%;
  margin: 0 auto;
`;

const CardWrapper = styled(Link)`
  position: relative;
  flex: 0 0 auto;
  width: calc(20% - 1.6rem);
  min-width: 250px;
  text-decoration: none;

  @media (max-width: 1800px) {
    width: calc(25% - 1.5rem);
  }

  @media (max-width: 1400px) {
    width: calc(33.333% - 1.334rem);
  }

  @media (max-width: 1100px) {
    width: calc(50% - 1rem);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

const NoGamesMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--clear-grey);
`;

const CompactFlexContainer = styled(FlexContainer)`
  gap: 1rem;
  justify-content: flex-start;

  ${CardWrapper} {
    width: 12rem;
    min-width: unset;
    flex: 0 0 auto;
  }

  @media (max-width: 464px) {
    justify-content: center;
    
    ${CardWrapper} {
      width: 9rem;
      gap: 0.5rem;
    }
  }
`;

interface MyCollectionGridProps {
    games: UserGameInCollection[];
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onGameDeleted?: () => void;
    isCompactView?: boolean;
}

const MyCollectionGrid: React.FC<MyCollectionGridProps> = ({
    games,
    totalItems,
    currentPage,
    onPageChange,
    itemsPerPage,
    onGameDeleted,
    isCompactView = false
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<UserGameInCollection | null>(null);
    const [gameToEdit, setGameToEdit] = useState<UserGameInCollection | null>(null);
    const [selectedGame, setSelectedGame] = useState<UserGameInCollection | null>(null);

    const { deleteUserGame, updateUserGame } = useUserGame(
        gameToDelete?.game.id || gameToEdit?.game.id || 0
    );
    const { addGameToCollection } = useUserGames();

    const handleDeleteClick = (e: React.MouseEvent, game: UserGameInCollection) => {
        e.preventDefault();
        e.stopPropagation();
        setGameToDelete(game);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (gameToDelete) {
            try {
                await deleteUserGame();
                setShowDeleteModal(false);
                setGameToDelete(null);
                if (onGameDeleted) {
                    onGameDeleted();
                }
            } catch (error) {
                console.error('Error al eliminar el juego:', error);
            }
        }
    };

    const handleEditClick = (e: React.MouseEvent, game: UserGameInCollection) => {
        e.preventDefault();
        e.stopPropagation();
        setGameToEdit(game);
        setShowEditModal(true);
    };

    const handleSubmitForm = async (formData: {
        rating?: number;
        status?: number;
        complete: boolean;
        notes?: string;
        platformIds: number[];
    }) => {
        if (gameToEdit) {
            try {
                const result = await updateUserGame({
                    rating: formData.rating || null,
                    status: formData.status || null,
                    complete: formData.complete,
                    notes: formData.notes || null,
                    platformIds: formData.platformIds
                });

                if (result) {
                    setShowEditModal(false);
                    setGameToEdit(null);
                    if (onGameDeleted) {
                        onGameDeleted(); // Recargar los datos
                    }
                }
            } catch (error) {
                console.error('Error al actualizar el juego:', error);
            }
        }
    };

    const handleAddToCollection = async (e: React.MouseEvent<Element, MouseEvent>, game: UserGameInCollection) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedGame(game);
        setShowAddToCollectionModal(true);
    };

    const handleAddToCollectionSubmit = async (formData: {
        rating?: number;
        status?: number;
        complete: boolean;
        notes?: string;
        platformIds: number[];
    }) => {
        if (selectedGame) {
            try {
                const result = await addGameToCollection({
                    gameId: selectedGame.game.id,
                    ...formData,
                    owned: true,
                    wished: false
                });

                if (result) {
                    setShowAddToCollectionModal(false);
                    setSelectedGame(null);
                    if (onGameDeleted) {
                        onGameDeleted();
                    }
                }
            } catch (error) {
                console.error('Error al añadir el juego:', error);
            }
        }
    };

    if (games.length === 0) {
        return <NoGamesMessage>No hay juegos en tu colección</NoGamesMessage>;
    }

    return (
        <>
            <Container $isCompact={isCompactView}>
                {isCompactView ? (
                    <CompactFlexContainer>
                        {games.map(game => (
                            <CardWrapper
                                key={game.id}
                                href={`/games/${game.game.id}`}
                            >
                                <CompactCollectionCard
                                    game={game}
                                    onEdit={(e) => handleEditClick(e, game)}
                                    onDelete={(e) => handleDeleteClick(e, game)}
                                    onAddToCollection={(e) => handleAddToCollection(e, game)}
                                />
                            </CardWrapper>
                        ))}
                    </CompactFlexContainer>
                ) : (
                    <FlexContainer>
                        {games.map(game => (
                            <CardWrapper
                                key={game.id}
                                href={`/games/${game.game.id}`}
                            >
                                <CollectionCard
                                    game={game}
                                    onEdit={(e) => handleEditClick(e, game)}
                                    onDelete={(e) => handleDeleteClick(e, game)}
                                    onAddToCollection={(e) => handleAddToCollection(e, game)}
                                />
                            </CardWrapper>
                        ))}
                    </FlexContainer>
                )}
                <PaginationWrapper>
                    <PaginationGrid
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalItems / itemsPerPage)}
                        onPageChange={onPageChange}
                    />
                </PaginationWrapper>
            </Container>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setGameToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title={gameToDelete?.wished ? "Eliminar juego de favoritos" : "Eliminar juego de la colección"}
                message={`¿Estás seguro de que quieres eliminar ${gameToDelete?.game.title} de ${gameToDelete?.wished ? 'tus favoritos' : 'tu colección'
                    }?`}
                confirmText="Eliminar"
                confirmVariant="danger"
            />

            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setGameToEdit(null);
                }}
                title={`Editar ${gameToEdit?.game.title} en mi colección`}
            >
                <AddToCollectionForm
                    gameId={gameToEdit?.game.id || 0}
                    onSubmit={handleSubmitForm}
                    onCancel={() => {
                        setShowEditModal(false);
                        setGameToEdit(null);
                    }}
                    isEditing={true}
                    initialData={{
                        rating: gameToEdit?.rating || null,
                        status: gameToEdit?.status || null,
                        complete: gameToEdit?.complete || false,
                        notes: gameToEdit?.notes || null,
                        platforms: (gameToEdit?.platforms || []) as Platform[]
                    }}
                />
            </Modal>

            <Modal
                isOpen={showAddToCollectionModal}
                onClose={() => {
                    setShowAddToCollectionModal(false);
                    setSelectedGame(null);
                }}
                title={`Añadir ${selectedGame?.game.title} a mi colección`}
            >
                <AddToCollectionForm
                    gameId={selectedGame?.game.id || 0}
                    onSubmit={handleAddToCollectionSubmit}
                    onCancel={() => {
                        setShowAddToCollectionModal(false);
                        setSelectedGame(null);
                    }}
                    isEditing={false}
                />
            </Modal>
        </>
    );
};

export default MyCollectionGrid;