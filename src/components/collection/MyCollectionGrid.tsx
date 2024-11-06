'use client'

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { UserGameInCollection } from '@/types/collection';
import CollectionCard from './CollectionCard';
import Pagination from '../ui/Pagination';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useUserGame } from '@/hooks/useUserGame';
import { MdDelete } from 'react-icons/md';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1.5rem;
  justify-content: flex-start;
  max-width: 2000px;
  margin: 0 auto;
`;

const DeleteIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--app-red);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;

  svg {
    color: white;
    font-size: 1.5rem;
  }
`;

const CardWrapper = styled(Link)`
  position: relative;
  flex: 0 0 auto;
  width: calc(20% - 1.6rem);
  min-width: 250px;
  text-decoration: none;

  &:hover ${DeleteIcon} {
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

interface MyCollectionGridProps {
    games: UserGameInCollection[];
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onGameDeleted?: () => void; // Callback para recargar los datos
}

const MyCollectionGrid: React.FC<MyCollectionGridProps> = ({
    games,
    totalItems,
    currentPage,
    onPageChange,
    itemsPerPage,
    onGameDeleted
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<UserGameInCollection | null>(null);

    const { deleteUserGame } = useUserGame(gameToDelete?.game.id || 0);

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

    if (games.length === 0) {
        return <NoGamesMessage>No hay juegos en tu colección</NoGamesMessage>;
    }

    return (
        <>
            <Container>
                <FlexContainer>
                    {games.map(game => (
                        <CardWrapper
                            key={game.id}
                            href={`/games/${game.game.id}`}
                        >
                            <DeleteIcon onClick={(e) => handleDeleteClick(e, game)}>
                                <MdDelete />
                            </DeleteIcon>
                            <CollectionCard game={game} />
                        </CardWrapper>
                    ))}
                </FlexContainer>
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
        </>
    );
};

export default MyCollectionGrid;