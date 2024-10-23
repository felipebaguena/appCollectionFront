import React from 'react';
import { Game } from '@/types/game';
import {
    ModalTitle,
    ModalField,
    ModalLabel,
    ButtonContainer
} from '@/components/management/DataTableElements';
import Button from '@/components/ui/Button';

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
            <ButtonContainer>
                <Button $variant="cancel" onClick={onClose}>Cerrar</Button>
            </ButtonContainer>
        </>
    );
};

export default ViewGameForm;
