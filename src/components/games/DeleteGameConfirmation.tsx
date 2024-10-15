import React from 'react';
import { Game } from '@/types/game';
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
    const handleDelete = async () => {
        // Aquí iría la lógica para eliminar el juego del servidor
        console.log('Eliminando juego:', item.id);
        onClose();
    };

    return (
        <ModalContent>
            <ModalTitle>Confirmar eliminación</ModalTitle>
            <ConfirmationText>
                ¿Estás seguro de que quieres eliminar el juego "{item.title}"?
            </ConfirmationText>
            <ButtonContainer>
                <DeleteButton onClick={handleDelete}>Sí, eliminar</DeleteButton>
                <ModalCloseButton onClick={onClose}>Cancelar</ModalCloseButton>
            </ButtonContainer>
        </ModalContent>
    );
};

export default DeleteGameConfirmation;
