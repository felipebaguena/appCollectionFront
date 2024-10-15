import React from 'react';
import { Game } from '@/types/game';
import {
    ModalTitle,
    ModalField,
    ModalLabel,
    ModalCloseButton
} from '@/components/management/DataTableElements';

interface ViewGameFormProps {
    item: Game;
    onClose: () => void;
}

const ViewGameForm: React.FC<ViewGameFormProps> = ({ item, onClose }) => {
    return (
        <>
            <ModalTitle>Ver Juego</ModalTitle>
            <ModalField>
                <ModalLabel>Título:</ModalLabel> {item.title}
            </ModalField>
            <ModalField>
                <ModalLabel>Descripción:</ModalLabel> {item.description}
            </ModalField>
            <ModalField>
                <ModalLabel>Año de lanzamiento:</ModalLabel> {item.releaseYear}
            </ModalField>
            <ModalCloseButton onClick={onClose}>Cerrar</ModalCloseButton>
        </>
    );
};

export default ViewGameForm;
