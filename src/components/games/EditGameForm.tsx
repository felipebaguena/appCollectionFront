import React, { useState, useEffect, useRef } from 'react';
import { Game } from '@/types/game';
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { useGame } from '@/hooks/useGame';
import {
    StyledForm,
    InputGroup,
    Label,
    Input,
    ButtonContainer,
    ErrorMessage,
    FormContainer,
    FormColumn,
    TextArea
} from '@/components/ui/FormElements';
import MultiSelect from '../ui/Multiselect';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { handleDescriptionKeyDown } from '@/helpers/textFormatting';

interface UpdateGameData {
    title: string;
    description: string;
    releaseYear: number;
    genres: number[];
    platforms: number[];
    developers: number[];
}

interface EditGameFormProps {
    item: Game;
    onClose: () => void;
}

interface Option {
    id: number;
    name: string;
    code: string;
}

const EditGameForm: React.FC<EditGameFormProps> = ({ item, onClose }) => {
    const { updateGame } = useGame(item.id.toString());

    const [formData, setFormData] = useState<UpdateGameData>({
        title: item.title,
        description: item.description,
        releaseYear: item.releaseYear,
        genres: item.genres?.map(g => g.id) || [],
        platforms: item.platforms?.map(p => p.id) || [],
        developers: item.developers?.map(d => d.id) || []
    });
    const [genres, setGenres] = useState<Option[]>([]);
    const [platforms, setPlatforms] = useState<Option[]>([]);
    const [developers, setDevelopers] = useState<Option[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genresData, platformsData, developersData] = await Promise.all([
                    api.get<Option[]>(ENDPOINTS.GET_GENRES),
                    api.get<Option[]>(ENDPOINTS.GET_PLATFORMS),
                    api.get<Option[]>(ENDPOINTS.GET_DEVELOPERS)
                ]);

                setGenres(genresData);
                setPlatforms(platformsData);
                setDevelopers(developersData);
            } catch (error) {
                console.error("Error al cargar los datos", error);
                setError("Error al cargar los datos. Por favor, intenta de nuevo.");
            }
        };

        fetchData();
    }, []);

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
            await updateGame(formData as unknown as Partial<Game>);
            onClose();
        } catch (error) {
            console.error("Error al actualizar el juego", error);
            setError("Error al actualizar el juego. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        handleDescriptionKeyDown(e, formData.description, textareaRef, setFormData);
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Editar Juego: ${item.title}`}
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
                                ref={textareaRef}
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
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
                        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
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

export default EditGameForm;
