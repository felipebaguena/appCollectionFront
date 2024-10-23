import React, { useState } from 'react';
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import styled from 'styled-components';
import {
    StyledForm,
    InputGroup,
    Label,
    Input,
    ButtonContainer,
    ErrorMessage
} from '@/components/ui/FormElements';
import MultiSelect from '../ui/Multiselect';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface CreateGameFormProps {
    onClose: () => void;
    onGameCreated: () => void;
    genres: Option[];
    platforms: Option[];
    developers: Option[];
}

interface Option {
    id: number;
    name: string;
    code: string;
}

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FormColumn = styled.div`
  flex: 1;
  min-width: 250px;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  min-height: 100px;
`;

const CreateGameForm: React.FC<CreateGameFormProps> = ({ onClose, onGameCreated, genres, platforms, developers }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        releaseYear: new Date().getFullYear(),
        genres: [] as number[],
        platforms: [] as number[],
        developers: [] as number[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (name: string) => (selected: Option[]) => {
        setFormData(prev => ({ ...prev, [name]: selected.map(item => item.id) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post(ENDPOINTS.CREATE_GAME, formData);
            onGameCreated();
            onClose();
        } catch (error) {
            console.error("Error al crear el juego", error);
            setError("Error al crear el juego. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Crear Nuevo Juego"
            width="95%"
            maxWidth="50rem"
            height="auto"
            maxHeight="90vh"
        >
            <StyledForm onSubmit={handleSubmit}>
                <FormContainer>
                    <FormColumn>
                        <InputGroup>
                            <Label htmlFor="title">Título:</Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="description">Descripción:</Label>
                            <TextArea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="releaseYear">Año de lanzamiento:</Label>
                            <Input
                                type="number"
                                id="releaseYear"
                                name="releaseYear"
                                value={formData.releaseYear}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                    </FormColumn>
                    <FormColumn>
                        <InputGroup>
                            <Label htmlFor="genres">Géneros:</Label>
                            <MultiSelect
                                options={genres}
                                selectedOptions={genres.filter(g => formData.genres.includes(g.id))}
                                onChange={handleMultiSelectChange('genres')}
                                placeholder="Selecciona géneros"
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="platforms">Plataformas:</Label>
                            <MultiSelect
                                options={platforms}
                                selectedOptions={platforms.filter(p => formData.platforms.includes(p.id))}
                                onChange={handleMultiSelectChange('platforms')}
                                placeholder="Selecciona plataformas"
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="developers">Desarrolladores:</Label>
                            <MultiSelect
                                options={developers}
                                selectedOptions={developers.filter(d => formData.developers.includes(d.id))}
                                onChange={handleMultiSelectChange('developers')}
                                placeholder="Selecciona desarrolladores"
                            />
                        </InputGroup>
                    </FormColumn>
                </FormContainer>
                <ButtonContainer>
                    <Button $variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creando...' : 'Crear juego'}
                    </Button>
                    <Button $variant="cancel" type="button" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                </ButtonContainer>
            </StyledForm>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Modal>
    );
};

export default CreateGameForm;
