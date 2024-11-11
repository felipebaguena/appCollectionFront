import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useArticleImages } from '@/hooks/useArticleImages';
import Button from './Button';
import Modal from './Modal';
import { ButtonContainer } from './FormElements';
import { Article } from '@/types/article';

interface CoverArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: Article | null;
    getImageUrl: (path: string) => string;
    onCoverUpdated: () => void;
}

const StyledImage = styled.img`
  max-width: 100%;
  max-height: calc(90vh - 16.5rem);
  object-fit: contain;
  margin-bottom: 20px;
  display: block;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
`;

const NoImageText = styled.div`
  font-size: 1.5rem;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  max-height: calc(90vh - 200px);
  overflow-y: auto;
  width: 100%;
  padding: 10px;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
  border: 4px solid transparent;
  &:hover {
    border-color: var(--app-yellow);
  }
  &.selected {
    border-color: var(--app-yellow);
  }
`;

const CoverArticleModal: React.FC<CoverArticleModalProps> = ({
    isOpen,
    onClose,
    article,
    getImageUrl,
    onCoverUpdated
}) => {
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    const gameId = article?.relatedGames?.[0]?.id || 0;
    const {
        gameArticleImages,
        loading,
        error,
        fetchGameArticleImages,
        setCoverImage
    } = useArticleImages(article?.id || 0, gameId);

    useEffect(() => {
        if (article?.coverImage) {
            setSelectedImageId(article.coverImage.id);
        } else {
            setSelectedImageId(null);
        }
    }, [article]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedImageId(article?.coverImage?.id || null);
            setShowGallery(false);
        }
    }, [isOpen, article]);

    useEffect(() => {
        if (showGallery && article) {
            fetchGameArticleImages();
        }
    }, [showGallery, article, fetchGameArticleImages]);

    const handleUpdateCover = () => {
        setShowGallery(true);
    };

    const handleImageSelect = (imageId: number) => {
        setSelectedImageId(imageId);
    };

    const handleSaveNewCover = async () => {
        if (selectedImageId && article) {
            try {
                await setCoverImage(article.id, selectedImageId);
                setShowGallery(false);
                onCoverUpdated();
                onClose();
            } catch (error) {
                console.error('Error setting cover image:', error);
            }
        }
    };

    if (!article) return null;

    const imageSrc = article.coverImage ? getImageUrl(article.coverImage.path) : null;

    const modalContent = showGallery ? (
        <>
            <h2>Selecciona una nueva portada</h2>
            {loading && <p>Cargando imágenes...</p>}
            {error && <p>Error: {error}</p>}
            <GalleryContainer>
                {gameArticleImages.map((img) => (
                    <GalleryImage
                        key={img.id}
                        src={getImageUrl(img.path)}
                        alt={img.filename}
                        onClick={() => handleImageSelect(img.id)}
                        className={selectedImageId === img.id ? 'selected' : ''}
                    />
                ))}
            </GalleryContainer>
            <ButtonContainer>
                <Button
                    $variant="primary"
                    onClick={handleSaveNewCover}
                    disabled={!selectedImageId || loading}
                >
                    Guardar nueva portada
                </Button>
                <Button $variant="cancel" onClick={() => setShowGallery(false)}>
                    Cancelar
                </Button>
            </ButtonContainer>
        </>
    ) : (
        <>
            {imageSrc ? (
                <ImageContainer>
                    <StyledImage
                        src={imageSrc}
                        alt={`Portada de ${article.title}`}
                        onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            const modalElement = img.closest('.modal-content') as HTMLElement;
                            if (modalElement) {
                                const maxWidth = Math.min(img.naturalWidth + 40, window.innerWidth * 0.9);
                                modalElement.style.width = `${maxWidth}px`;
                            }
                        }}
                    />
                </ImageContainer>
            ) : (
                <NoImageText>Sin portada</NoImageText>
            )}
            <ButtonContainer>
                <Button $variant="primary" onClick={handleUpdateCover}>
                    Actualizar portada
                </Button>
                <Button $variant="cancel" onClick={onClose}>
                    Cerrar
                </Button>
            </ButtonContainer>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={showGallery ? "Seleccionar nueva portada" : `Portada de ${article.title}`}
            width="auto"
            maxWidth="90vw"
        >
            {modalContent}
        </Modal>
    );
};

export default CoverArticleModal; 