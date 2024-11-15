'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api, getImageUrl } from '@/services/api';
import { ENDPOINTS } from '@/constants/endpoints';
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
import CustomSelect from '@/components/ui/CustomSelect';
import { useTemplates } from '@/hooks/useTemplates';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useGenres } from '@/hooks/useGenres';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useDevelopers } from '@/hooks/useDevelopers';
import { Game } from '@/types/game';
import { useArticleImages } from '@/hooks/useArticleImages';

import { ArticleTemplate, TemplateCode, templateComponents } from '@/types/articleTemplate';
import ImageSelectionStep from './ImageSelectionStep';
import CustomEditor from '@/components/ui/CustomEditor';

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

const ArticleLabel = styled(Label)`
    color: var(--dark-grey);
`;

const RequiredArticleLabel = styled(ArticleLabel)`
    &::after {
        content: ' *';
        color: var(--danger-color, red);
    }
`;

interface CreatedArticle {
    id: number;
}

interface ImageSelectionData {
    coverImageId: number | null;
    articleImages: number[];
}

interface CreateArticleData {
    id?: number;
    title: string;
    subtitle: string;
    content: string;
    templateId: number;
    coverImageId: number | null;
    contentImageIds: number[];
    relatedGames: number[];
    relatedPlatforms: number[];
    relatedGenres: number[];
    relatedDevelopers: number[];
    published: boolean;
}

const ButtonAndMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
`;

const ValidationMessage = styled(ErrorMessage)`
    margin-top: 0.5rem;
`;

const CreateArticleForm: React.FC<CreateArticleFormProps> = ({
    onClose,
    onArticleCreated,
    genres,
    platforms,
    developers
}) => {
    const [formData, setFormData] = useState<Omit<CreateArticleData, 'coverImageId' | 'contentImageIds' | 'published'>>({
        title: '',
        subtitle: '',
        content: '',
        templateId: 1,
        relatedGames: [],
        relatedPlatforms: [],
        relatedDevelopers: [],
        relatedGenres: []
    });
    const [selectedGameId, setSelectedGameId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { templates, fetchTemplates } = useTemplates();
    const { searchGenres } = useGenres();
    const { searchPlatforms } = usePlatforms();
    const { searchDevelopers } = useDevelopers();
    const [currentStep, setCurrentStep] = useState<'data' | 'images' | 'preview'>('data');
    const [pendingArticleData, setPendingArticleData] = useState<CreateArticleData | null>(null);
    const [showValidationMessage, setShowValidationMessage] = useState(false);

    const { gameArticleImages } = useArticleImages(
        pendingArticleData?.id || 0,
        formData.relatedGames[0] || 0
    );

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleChange = (
        input: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
        isEditor = false
    ) => {
        if (isEditor) {
            setFormData(prev => ({
                ...prev,
                content: input as string
            }));
        } else {
            const event = input as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
            const { name, value } = event.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleGameChange = async (value: string) => {
        setSelectedGameId(value);

        if (value) {
            try {
                const gameDetails = await api.get<Game>(ENDPOINTS.GET_GAME(value));

                if (gameDetails) {
                    setFormData(prev => ({
                        ...prev,
                        relatedGames: [gameDetails.id],
                        relatedPlatforms: gameDetails.platforms.map(p => p.id),
                        relatedGenres: gameDetails.genres.map(g => g.id),
                        relatedDevelopers: gameDetails.developers.map(d => d.id)
                    }));
                } else {
                    console.error("No se encontró el juego seleccionado");
                    setFormData(prev => ({
                        ...prev,
                        relatedGames: [parseInt(value)]
                    }));
                }
            } catch (error) {
                console.error("Error al obtener los detalles del juego:", error);
                setFormData(prev => ({
                    ...prev,
                    relatedGames: [parseInt(value)]
                }));
            }
        } else {
            // Limpiar las selecciones si no hay juego seleccionado
            setFormData(prev => ({
                ...prev,
                relatedGames: [],
                relatedPlatforms: [],
                relatedGenres: [],
                relatedDevelopers: []
            }));
        }
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.relatedGames.length) {
            setError("Debes seleccionar un juego relacionado");
            return;
        }
        setError(null);
        setPendingArticleData({
            ...formData,
            coverImageId: null,
            contentImageIds: [],
            published: false
        });
        setCurrentStep('images');
    };

    const handleCreateArticle = async (imageData: ImageSelectionData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const articleData: CreateArticleData = {
                ...pendingArticleData!,
                coverImageId: imageData.coverImageId,
                contentImageIds: imageData.articleImages,
                published: false // Por defecto, el artículo se crea como no publicado
            };

            await api.post<CreatedArticle>(ENDPOINTS.CREATE_ARTICLE, articleData);
            onArticleCreated();
            onClose();
        } catch (error) {
            console.error("Error al crear el artículo", error);
            setError("Error al crear el artículo. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        return formData.title.trim() !== '' &&
            formData.subtitle.trim() !== '' &&
            formData.content.trim() !== '' &&
            formData.relatedGames.length > 0;
    };

    const handleTemplateChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            templateId: parseInt(value)
        }));
    };

    const handleOptionsChange = (fieldName: string) => (newOptions: Option[]) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: newOptions.map(option => option.id)
        }));
    };

    const getTemplateImageCount = (templateId: number): number => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return 0;
        return (template as ArticleTemplate).imageCount || 0;
    };

    const handlePreview = (imageData: ImageSelectionData) => {
        if (pendingArticleData && gameArticleImages) {
            setPendingArticleData({
                ...pendingArticleData,
                coverImageId: imageData.coverImageId,
                contentImageIds: imageData.articleImages
            });
            setCurrentStep('preview');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pendingArticleData) {
            handleCreateArticle({
                coverImageId: pendingArticleData.coverImageId,
                articleImages: pendingArticleData.contentImageIds
            });
        }
    };

    const renderPreview = () => {
        if (!pendingArticleData) return null;

        const selectedTemplate = templates.find(t => t.id === pendingArticleData.templateId);
        const TemplateComponent = selectedTemplate
            ? templateComponents[selectedTemplate.code as TemplateCode]
            : templateComponents[TemplateCode.STANDARD_TEMPLATE];

        return (
            <>
                <TemplateComponent
                    title={pendingArticleData.title}
                    subtitle={pendingArticleData.subtitle}
                    content={pendingArticleData.content}
                    coverImageId={pendingArticleData.coverImageId}
                    contentImageIds={pendingArticleData.contentImageIds}
                    gameId={pendingArticleData.relatedGames[0]}
                    getImageUrl={getImageUrl}
                    isPreview={true}
                />
                <ButtonContainer>
                    <Button
                        $variant="primary"
                        onClick={() => {
                            if (pendingArticleData) {
                                handleCreateArticle({
                                    coverImageId: pendingArticleData.coverImageId,
                                    articleImages: pendingArticleData.contentImageIds
                                });
                            }
                        }}
                        disabled={isSubmitting || !pendingArticleData}
                    >
                        {isSubmitting ? 'Creando...' : 'Crear artículo'}
                    </Button>
                    <Button
                        $variant="dark"
                        onClick={() => setCurrentStep('images')}
                        disabled={isSubmitting}
                    >
                        Volver
                    </Button>
                </ButtonContainer>
            </>
        );
    };

    return (
        <ArticleFormContainer>
            {currentStep !== 'preview' && (
                <TitleBar>
                    <TitleText>
                        {currentStep === 'data'
                            ? 'Crear Nuevo Artículo'
                            : 'Seleccionar Imágenes'}
                    </TitleText>
                </TitleBar>
            )}
            <FormContent>
                <ContentContainer>
                    {currentStep === 'data' ? (
                        <StyledForm onSubmit={handleNextStep}>
                            <InputGroup>
                                <RequiredArticleLabel htmlFor="title">Título</RequiredArticleLabel>
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
                                <RequiredArticleLabel htmlFor="subtitle">Subtítulo</RequiredArticleLabel>
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
                                <RequiredArticleLabel htmlFor="content">Contenido</RequiredArticleLabel>
                                <CustomEditor
                                    value={formData.content}
                                    onChange={(newContent) => handleChange(newContent, true)}
                                />
                            </InputGroup>

                            <InputGroup>
                                <ArticleLabel>Plantilla</ArticleLabel>
                                <CustomSelect
                                    options={templates.map(template => ({
                                        value: template.id.toString(),
                                        label: template.name
                                    }))}
                                    value={formData.templateId.toString()}
                                    onChange={handleTemplateChange}
                                    placeholder="Seleccionar plantilla..."
                                />
                            </InputGroup>

                            <InputGroup>
                                <RequiredArticleLabel>Juego relacionado</RequiredArticleLabel>
                                <SearchableGameSelect
                                    selectedGameId={selectedGameId}
                                    onGameChange={handleGameChange}
                                />
                            </InputGroup>

                            <InputGroup>
                                <ArticleLabel>Plataformas</ArticleLabel>
                                <SearchableSelect
                                    selectedOptions={platforms.filter(p =>
                                        formData.relatedPlatforms.includes(p.id)
                                    )}
                                    onOptionsChange={handleOptionsChange('relatedPlatforms')}
                                    searchFunction={searchPlatforms}
                                    placeholder="Buscar plataforma..."
                                />
                            </InputGroup>

                            <InputGroup>
                                <ArticleLabel>Géneros</ArticleLabel>
                                <SearchableSelect
                                    selectedOptions={genres.filter(g =>
                                        formData.relatedGenres.includes(g.id)
                                    )}
                                    onOptionsChange={handleOptionsChange('relatedGenres')}
                                    searchFunction={searchGenres}
                                    placeholder="Buscar género..."
                                />
                            </InputGroup>

                            <InputGroup>
                                <ArticleLabel>Desarrolladores</ArticleLabel>
                                <SearchableSelect
                                    selectedOptions={developers.filter(d =>
                                        formData.relatedDevelopers.includes(d.id)
                                    )}
                                    onOptionsChange={handleOptionsChange('relatedDevelopers')}
                                    searchFunction={searchDevelopers}
                                    placeholder="Buscar desarrollador..."
                                />
                            </InputGroup>

                            <ButtonAndMessageContainer>
                                <ButtonContainer>
                                    <div
                                        onMouseEnter={() => !isFormValid() && setShowValidationMessage(true)}
                                        onMouseLeave={() => setShowValidationMessage(false)}
                                    >
                                        <Button
                                            $variant="primary"
                                            type="submit"
                                            disabled={!isFormValid()}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                    <Button
                                        $variant="cancel"
                                        type="button"
                                        onClick={onClose}
                                    >
                                        Cancelar
                                    </Button>
                                </ButtonContainer>
                                {showValidationMessage && (
                                    <ValidationMessage>
                                        Por favor, completa todos los campos obligatorios (*)
                                    </ValidationMessage>
                                )}
                            </ButtonAndMessageContainer>
                        </StyledForm>
                    ) : currentStep === 'images' ? (
                        <ImageSelectionStep
                            gameId={pendingArticleData?.relatedGames[0] ?? 0}
                            templateImageCount={getTemplateImageCount(pendingArticleData?.templateId ?? 0)}
                            onSubmit={handleSubmit}
                            onPreview={handlePreview}
                            onBack={() => setCurrentStep('data')}
                            isSubmitting={isSubmitting}
                            getImageUrl={getImageUrl}
                        />
                    ) : (
                        currentStep === 'preview' && pendingArticleData && renderPreview()
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </ContentContainer>
            </FormContent>
        </ArticleFormContainer>
    );
};

export default CreateArticleForm; 