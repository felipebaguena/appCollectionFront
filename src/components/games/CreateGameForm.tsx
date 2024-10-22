import React, { useState } from 'react';
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import {
    ModalTitle,
    ModalLabel,
    ModalCloseButton,
    ModalContent,
    FormField,
    Input,
    TextArea,
    SubmitButton
} from '@/components/management/DataTableElements';
import MultiSelect from '../ui/Multiselect';

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
        <ModalContent>
            <ModalTitle>Crear Nuevo Juego</ModalTitle>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <ModalLabel htmlFor="title">Título:</ModalLabel>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="description">Descripción:</ModalLabel>
                    <TextArea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
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
                        required
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
                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear juego'}
                </SubmitButton>
                <ModalCloseButton type="button" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                </ModalCloseButton>
            </form>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </ModalContent>
    );
};

export default CreateGameForm;
