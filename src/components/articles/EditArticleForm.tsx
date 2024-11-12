'use client';

import React, { useState } from 'react';
import { Article } from '@/types/article';
import { useArticle } from '@/hooks/useArticle';
import {
    StyledForm,
    InputGroup,
    Label,
    ButtonContainer,
    ErrorMessage
} from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import styled from 'styled-components';
import SearchableGameSelect from '@/components/ui/SearchableGameSelect';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useGames } from '@/hooks/useGames';

interface UpdateArticleRequest {
    title: string;
    subtitle: string;
    content: string;
    relatedGameIds: number[];
    relatedPlatformIds: number[];
    relatedGenreIds: number[];
    relatedDeveloperIds: number[];
}

interface EditArticleFormProps {
    item: Article;
    onClose: () => void;
}

interface Option {
    id: number;
    name: string;
    code: string;
}

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  min-height: 300px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
  }
`;

const EditArticleForm: React.FC<EditArticleFormProps> = ({
    item,
    onClose
}) => {
    const { updateArticle } = useArticle(item.id.toString());
    const { genres, platforms, developers } = useGames();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: item.title,
        subtitle: item.subtitle,
        content: item.content,
        relatedGameIds: item.relatedGames?.map(game => game.id) || [],
        relatedPlatformIds: item.relatedPlatforms?.map(platform => platform.id) || [],
        relatedGenreIds: item.relatedGenres?.map(genre => genre.id) || [],
        relatedDeveloperIds: item.relatedDevelopers?.map(developer => developer.id) || []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGameChange = async (value: string) => {
        if (value) {
            setFormData(prev => ({
                ...prev,
                relatedGameIds: [parseInt(value)]
            }));
        }
    };

    const handleOptionsChange = (fieldName: string) => (newOptions: Option[]) => {
        const mappedFieldName = fieldName === 'relatedPlatforms' ? 'relatedPlatformIds' :
            fieldName === 'relatedGenres' ? 'relatedGenreIds' :
                fieldName === 'relatedDevelopers' ? 'relatedDeveloperIds' :
                    fieldName;

        setFormData(prev => ({
            ...prev,
            [mappedFieldName]: newOptions.map(option => option.id)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await updateArticle(formData);
            onClose();
        } catch (error) {
            setError("Error al actualizar el artículo");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener el título del juego relacionado
    const relatedGameTitle = item.relatedGames?.[0]?.title || 'No hay juego relacionado';

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Editar Artículo: ${item.title}`}
            width="95%"
            maxWidth="70rem"
            height="auto"
        >
            <StyledForm onSubmit={handleSubmit}>
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
                    <Label htmlFor="subtitle">Subtítulo:</Label>
                    <Input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Juego relacionado:</Label>
                    <Input
                        type="text"
                        value={relatedGameTitle}
                        readOnly
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Plataformas:</Label>
                    <SearchableSelect
                        selectedOptions={platforms.filter(p =>
                            formData.relatedPlatformIds.includes(p.id)
                        ).map(p => ({ ...p, code: p.id.toString() }))}
                        onOptionsChange={handleOptionsChange('relatedPlatforms')}
                        searchFunction={async (query) => platforms.map(p => ({
                            id: p.id,
                            name: p.name,
                            code: p.id.toString()
                        }))}
                        placeholder="Buscar plataforma..."
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Géneros:</Label>
                    <SearchableSelect
                        selectedOptions={genres.filter(g =>
                            formData.relatedGenreIds.includes(g.id)
                        ).map(g => ({
                            id: g.id,
                            name: g.name,
                            code: g.id.toString()
                        }))}
                        onOptionsChange={handleOptionsChange('relatedGenres')}
                        searchFunction={async (query) => genres.map(g => ({
                            id: g.id,
                            name: g.name,
                            code: g.id.toString()
                        }))}
                        placeholder="Buscar género..."
                    />
                </InputGroup>

                <InputGroup>
                    <Label>Desarrolladores:</Label>
                    <SearchableSelect
                        selectedOptions={developers.filter(d =>
                            formData.relatedDeveloperIds.includes(d.id)
                        ).map(d => ({
                            id: d.id,
                            name: d.name,
                            code: d.id.toString()
                        }))}
                        onOptionsChange={handleOptionsChange('relatedDevelopers')}
                        searchFunction={async (query) => developers.map(d => ({
                            id: d.id,
                            name: d.name,
                            code: d.id.toString()
                        }))}
                        placeholder="Buscar desarrollador..."
                    />
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="content">Contenido:</Label>
                    <TextArea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>

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

export default EditArticleForm; 