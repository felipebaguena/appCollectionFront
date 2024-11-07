'use client'

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { UserGameInCollection } from '@/types/collection';
import CollectionCard from './CollectionCard';
import Pagination from '../ui/Pagination';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useUserGame } from '@/hooks/useUserGame';
import { MdDelete, MdEdit } from 'react-icons/md';
import Modal from '@/components/ui/Modal';
import AddToCollectionForm from './AddToCollectionForm';
import { Platform } from '@/types/game';
import CompactCollectionCard from './CompactCollectionCard';

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

const IconsContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ActionIcon = styled.div<{ $variant?: 'edit' | 'delete' }>`
  background-color: ${props => props.$variant === 'edit' ? 'var(--app-yellow)' : 'var(--app-red)'};
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  svg {
    color: ${props => props.$variant === 'edit' ? 'var(--dark-grey)' : 'white'};
    font-size: 1.5rem;
  }
`;

const CardWrapper = styled(Link)`
  position: relative;
  flex: 0 0 auto;
  width: calc(20% - 1.6rem);
  min-width: 250px;
  text-decoration: none;

  &:hover ${IconsContainer} {
    opacity: 1;
  }

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
    const [gameToDelete, setGameToDelete] = useState<UserGameInCollection | null>(null);
    const [gameToEdit, setGameToEdit] = useState<UserGameInCollection | null>(null);

    const { deleteUserGame, updateUserGame } = useUserGame(gameToEdit?.game.id || 0);

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
                                <IconsContainer>
                                    <ActionIcon
                                        $variant="edit"
                                        onClick={(e) => handleEditClick(e, game)}
                                    >
                                        <MdEdit />
                                    </ActionIcon>
                                    <ActionIcon
                                        $variant="delete"
                                        onClick={(e) => handleDeleteClick(e, game)}
                                    >
                                        <MdDelete />
                                    </ActionIcon>
                                </IconsContainer>
                                <CollectionCard game={game} />
                            </CardWrapper>
                        ))}
                    </FlexContainer>
                )}
                <PaginationWrapper>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
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
                title="Eliminar juego de la colección"
                message={`¿Estás seguro de que quieres eliminar ${gameToDelete?.game.title} de tu colección?`}
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
        </>
    );
};

export default MyCollectionGrid;