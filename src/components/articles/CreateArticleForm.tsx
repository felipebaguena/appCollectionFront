'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useGames } from '@/hooks/useGames';
import { api } from '@/services/api';
import { ENDPOINTS } from '@/constants/endpoints';
import MultiSelect from '@/components/ui/Multiselect';
import {
    StyledForm,
    InputGroup,
    Label,
    ButtonContainer,
    ErrorMessage
} from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import { PageWrapper } from '@/components/layout/LayoutElements';
import SearchableGameSelect from '@/components/ui/SearchableGameSelect';

interface Option {
    id: number;
    name: string;
    code: string;
}

interface CreateArticleFormProps {
    onClose: () => void;
    onArticleCreated: () => void;
    genres: Option[];
    platforms: Option[];
    developers: Option[];
}

const ArticleFormContainer = styled(PageWrapper)`
  padding: 2rem;
  margin-top: 4rem; // Para el Navbar
  margin-bottom: 4rem; // Para el Footer
  min-height: calc(100vh - 8rem); // 100vh menos los márgenes
  background: white;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: var(--text-color);
  margin: 0;
`;

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

const SelectionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const GameSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CreateArticleForm: React.FC<CreateArticleFormProps> = ({
    onClose,
    onArticleCreated,
    genres,
    platforms,
    developers
}) => {
    const { searchGames } = useGames();
    const [searchResults, setSearchResults] = useState<Array<{ id: number, title: string }>>([]);
    const [searchValue, setSearchValue] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        templateId: 1,
        relatedGames: [] as number[],
        relatedPlatforms: [] as number[],
        relatedDevelopers: [] as number[],
        relatedGenres: [] as number[]
    });
    const [selectedGameId, setSelectedGameId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGameChange = (value: string) => {
        setSelectedGameId(value);
        setFormData(prev => ({
            ...prev,
            relatedGames: [parseInt(value)]
        }));
    };

    const handleMultiSelectChange = (name: string) => (selected: Option[]) => {
        setFormData(prev => ({
            ...prev,
            [name]: selected.map(item => item.id)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post(ENDPOINTS.CREATE_ARTICLE, formData);
            onArticleCreated();
            onClose();
        } catch (error) {
            console.error("Error al crear el artículo", error);
            setError("Error al crear el artículo. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGameSearch = async (value: string) => {
        setSearchValue(value);
        if (value.length >= 2) {
            const results = await searchGames(value);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <ArticleFormContainer>
            <ContentContainer>
                <FormHeader>
                    <Title>Crear Nuevo Artículo</Title>
                    <Button
                        $variant="cancel"
                        onClick={onClose}
                        type="button"
                    >
                        ✕
                    </Button>
                </FormHeader>
                <StyledForm onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="title">Título</Label>
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
                        <Label htmlFor="content">Contenido</Label>
                        <TextArea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Juego relacionado</Label>
                        <SearchableGameSelect
                            selectedGameId={selectedGameId}
                            onGameChange={handleGameChange}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Plataformas</Label>
                        <MultiSelect
                            options={platforms}
                            selectedOptions={platforms.filter(p =>
                                formData.relatedPlatforms.includes(p.id)
                            )}
                            onChange={handleMultiSelectChange('relatedPlatforms')}
                            placeholder="Selecciona plataformas"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Géneros</Label>
                        <MultiSelect
                            options={genres}
                            selectedOptions={genres.filter(g =>
                                formData.relatedGenres.includes(g.id)
                            )}
                            onChange={handleMultiSelectChange('relatedGenres')}
                            placeholder="Selecciona géneros"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Desarrolladores</Label>
                        <MultiSelect
                            options={developers}
                            selectedOptions={developers.filter(d =>
                                formData.relatedDevelopers.includes(d.id)
                            )}
                            onChange={handleMultiSelectChange('relatedDevelopers')}
                            placeholder="Selecciona desarrolladores"
                        />
                    </InputGroup>

                    <ButtonContainer>
                        <Button $variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando...' : 'Crear artículo'}
                        </Button>
                        <Button $variant="cancel" type="button" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                    </ButtonContainer>
                </StyledForm>
            </ContentContainer>
        </ArticleFormContainer>
    );
};

export default CreateArticleForm; 