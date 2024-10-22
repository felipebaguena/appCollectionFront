import React, { useState } from 'react';
import { Game } from '@/types/game';
import { useGame } from '@/hooks/useGame';
import {
    ModalContent,
    ModalTitle,
    ConfirmationText,
    ButtonContainer,
    DeleteButton,
    ModalCloseButton
} from '@/components/management/DataTableElements';

interface DeleteGameConfirmationProps {
    item: Game;
    onClose: () => void;
}

const DeleteGameConfirmation: React.FC<DeleteGameConfirmationProps> = ({ item, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteGame, error } = useGame(item.id.toString());

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteGame();
            onClose();
        } catch (error) {
            console.error('Error al eliminar el juego:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ModalContent>
            <ModalTitle>Confirmar eliminación</ModalTitle>
            <ConfirmationText>
                ¿Estás seguro de que quieres eliminar el juego "{item.title}"?
            </ConfirmationText>
            {error && <ConfirmationText style={{ color: 'red' }}>{error}</ConfirmationText>}
            <ButtonContainer>
                <DeleteButton onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                </DeleteButton>
                <ModalCloseButton onClick={onClose} disabled={isDeleting}>Cancelar</ModalCloseButton>
            </ButtonContainer>
        </ModalContent>
    );
};

export default DeleteGameConfirmation;
