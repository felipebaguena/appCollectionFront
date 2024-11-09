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
import { TitleBar } from '@/components/collection/CollectionElements';

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
  background: white;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const TitleText = styled.h2`
    color: var(--dark-grey);
    margin: 0;
    font-size: 1.2rem;
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;
`;

const FormContent = styled.div`
    padding: 2rem;
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

const ArticleLabel = styled(Label)`
    color: var(--dark-grey);
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
            <TitleBar>
                <TitleText>Crear Nuevo Artículo</TitleText>
            </TitleBar>
            <FormContent>
                <ContentContainer>
                    <StyledForm onSubmit={handleSubmit}>
                        <InputGroup>
                            <ArticleLabel htmlFor="title">Título</ArticleLabel>
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
                            <ArticleLabel htmlFor="content">Contenido</ArticleLabel>
                            <TextArea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <ArticleLabel>Juego relacionado</ArticleLabel>
                            <SearchableGameSelect
                                selectedGameId={selectedGameId}
                                onGameChange={handleGameChange}
                            />
                        </InputGroup>

                        <InputGroup>
                            <ArticleLabel>Plataformas</ArticleLabel>
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
                            <ArticleLabel>Géneros</ArticleLabel>
                            <MultiSelect
                                options={genres}
                                selectedOptions={genres.filter(g =>
                                    formData.relatedGenres.includes(g.id)
                                )}
                                onChange={handleMultiSelectChange('relatedGenres')}
                                placeholder="Selecciona géneros"
                                dropUp={true}
                            />
                        </InputGroup>

                        <InputGroup>
                            <ArticleLabel>Desarrolladores</ArticleLabel>
                            <MultiSelect
                                options={developers}
                                selectedOptions={developers.filter(d =>
                                    formData.relatedDevelopers.includes(d.id)
                                )}
                                onChange={handleMultiSelectChange('relatedDevelopers')}
                                placeholder="Selecciona desarrolladores"
                                dropUp={true}
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
            </FormContent>
        </ArticleFormContainer>
    );
};

export default CreateArticleForm; 