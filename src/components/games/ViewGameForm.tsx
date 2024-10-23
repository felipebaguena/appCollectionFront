import React from 'react';
import { Game } from '@/types/game';
import {
    ViewForm,
    InputGroup,
    Label,
    ButtonContainer,
    FormContainer,
    FormColumn,
    FieldValue,
    CoverImage
} from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { getImageUrl } from '@/services/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const NO_IMAGE_URL = `${API_BASE_URL}/uploads/resources/no-image.jpg`;

interface ViewGameFormProps {
    item: Game;
    onClose: () => void;
}

const ViewGameForm: React.FC<ViewGameFormProps> = ({ item, onClose }) => {
    const coverImage = item.images.find(img => img.isCover);
    const coverUrl = coverImage ? getImageUrl(coverImage.path) : NO_IMAGE_URL;

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Información Juego: ${item.title}`}
            width="95%"
            maxWidth="50rem"
            height="auto"
            maxHeight="90vh"
        >
            <ViewForm as="div">
                <FormContainer>
                    <FormColumn>
                        <CoverImage src={coverUrl} alt={`Portada de ${item.title}`} />
                        <InputGroup>
                            <FieldValue>{item.title}</FieldValue>
                        </InputGroup>
                        <InputGroup>
                            <Label>Desarrolladores:</Label>
                            <FieldValue>{item.developers?.map(d => d.name).join(', ') || 'N/A'}</FieldValue>
                        </InputGroup>
                    </FormColumn>
                    <FormColumn>
                        <InputGroup>
                            <Label>Año de lanzamiento:</Label>
                            <FieldValue>{item.releaseYear}</FieldValue>
                        </InputGroup>
                        <InputGroup>
                            <Label>Géneros:</Label>
                            <FieldValue>{item.genres?.map(g => g.name).join(', ') || 'N/A'}</FieldValue>
                        </InputGroup>
                        <InputGroup>
                            <Label>Plataformas:</Label>
                            <FieldValue>{item.platforms?.map(p => p.name).join(', ') || 'N/A'}</FieldValue>
                        </InputGroup>
                        <InputGroup>
                            <Label>Descripción:</Label>
                            <FieldValue>{item.description}</FieldValue>
                        </InputGroup>
                    </FormColumn>
                </FormContainer>
                <ButtonContainer>
                    <Button $variant="cancel" onClick={onClose}>Cerrar</Button>
                </ButtonContainer>
            </ViewForm>
        </Modal>
    );
};

export default ViewGameForm;
