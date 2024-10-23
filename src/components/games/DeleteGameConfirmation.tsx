import React, { useState } from 'react';
import { Game } from '@/types/game';
import { useGame } from '@/hooks/useGame';
import {
    ModalContent,
    ModalTitle,
    ConfirmationText,
    ButtonContainer
} from '@/components/management/DataTableElements';
import Button from '@/components/ui/Button';

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
                <Button
                    $variant="danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                </Button>
                <Button
                    $variant="cancel"
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    Cancelar
                </Button>
            </ButtonContainer>
        </ModalContent>
    );
};

export default DeleteGameConfirmation;
