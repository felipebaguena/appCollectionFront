import React, { useState, useEffect } from 'react';
import { Game } from '@/types/game';
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { useGame } from '@/hooks/useGame';
import {
    ModalTitle,
    ModalLabel,
    ModalContent,
    FormField,
    Input,
    TextArea,
    ButtonContainer
} from '@/components/management/DataTableElements';
import MultiSelect from '../ui/Multiselect';
import Button from '@/components/ui/Button';

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

    const [formData, setFormData] = useState({
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
            await updateGame(formData);
            onClose();
        } catch (error) {
            console.error("Error al actualizar el juego", error);
            setError("Error al actualizar el juego. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <ModalContent>
            <ModalTitle>Editar Juego</ModalTitle>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <ModalLabel htmlFor="title">Título:</ModalLabel>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="description">Descripción:</ModalLabel>
                    <TextArea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="releaseYear">Año de lanzamiento:</ModalLabel>
                    <Input
                        type="number"
                        id="releaseYear"
                        name="releaseYear"
                        value={formData.releaseYear}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="genres">Géneros:</ModalLabel>
                    <MultiSelect
                        options={genres}
                        selectedOptions={genres.filter(g => formData.genres.includes(g.id))}
                        onChange={handleMultiSelectChange('genres')}
                        placeholder="Selecciona géneros"
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="platforms">Plataformas:</ModalLabel>
                    <MultiSelect
                        options={platforms}
                        selectedOptions={platforms.filter(p => formData.platforms.includes(p.id))}
                        onChange={handleMultiSelectChange('platforms')}
                        placeholder="Selecciona plataformas"
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="developers">Desarrolladores:</ModalLabel>
                    <MultiSelect
                        options={developers}
                        selectedOptions={developers.filter(d => formData.developers.includes(d.id))}
                        onChange={handleMultiSelectChange('developers')}
                        placeholder="Selecciona desarrolladores"
                    />
                </FormField>
                <ButtonContainer>
                    <Button $variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button $variant="cancel" type="button" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                </ButtonContainer>
            </form>
        </ModalContent>
    );
};

export default EditGameForm;