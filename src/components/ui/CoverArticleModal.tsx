import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useArticleImages } from '@/hooks/useArticleImages';
import Button from './Button';
import Modal from './Modal';
import { ButtonContainer } from './FormElements';
import { Article } from '@/types/article';
import { FaClock } from 'react-icons/fa';

interface CoverArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: Article | null;
    getImageUrl: (path: string) => string;
    onCoverUpdated: () => void;
}

interface PendingImage {
    id: string;
    file: File;
    previewUrl: string;
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

const PendingImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
`;

const PendingImage = styled(GalleryImage)`
  opacity: 0.6;
`;

const PendingIcon = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const NonInteractiveGalleryImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  cursor: default;
  border: 4px solid transparent;
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
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [selectedPendingImages, setSelectedPendingImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const gameId = article?.relatedGames?.[0]?.id || 0;
    const {
        gameArticleImages,
        loading,
        error,
        fetchGameArticleImages,
        setCoverImage,
        uploadToGameGallery
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

    const handleUploadToGalleryClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newPendingImages = Array.from(files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        setPendingImages(prev => [...prev, ...newPendingImages]);
    };

    const handlePendingImageSelect = (imageId: string) => {
        setSelectedPendingImages(prev => {
            if (prev.includes(imageId)) {
                return prev.filter(id => id !== imageId);
            }
            return [...prev, imageId];
        });
    };

    const handleConfirmGalleryUpload = async () => {
        const selectedImages = pendingImages.filter(img => selectedPendingImages.includes(img.id));

        for (const pendingImage of selectedImages) {
            try {
                await uploadToGameGallery(pendingImage.file);
            } catch (error) {
                console.error("Error uploading image to gallery:", error);
            }
        }

        setPendingImages([]);
        setSelectedPendingImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        await fetchGameArticleImages();
    };

    if (!article) return null;

    const imageSrc = article.coverImage ? getImageUrl(article.coverImage.path) : null;

    const modalContent = showGallery ? (
        <>
            <h2>Selecciona una nueva portada</h2>
            {loading && <p>Cargando imágenes...</p>}
            {error && <p>Error: {error}</p>}
            <GalleryContainer>
                {pendingImages.map((img) => (
                    <PendingImageWrapper key={img.id}>
                        <PendingImage
                            src={img.previewUrl}
                            alt="Pending upload"
                            onClick={() => handlePendingImageSelect(img.id)}
                            style={{
                                border: selectedPendingImages.includes(img.id) ? '4px solid var(--app-yellow)' : '2px solid transparent',
                                opacity: selectedPendingImages.includes(img.id) ? 1 : 0.6
                            }}
                        />
                        <PendingIcon>
                            <FaClock />
                        </PendingIcon>
                    </PendingImageWrapper>
                ))}
                {gameArticleImages.map((img) => (
                    pendingImages.length > 0 ? (
                        <NonInteractiveGalleryImage
                            key={img.id}
                            src={getImageUrl(img.path)}
                            alt={img.filename}
                        />
                    ) : (
                        <GalleryImage
                            key={img.id}
                            src={getImageUrl(img.path)}
                            alt={img.filename}
                            onClick={() => handleImageSelect(img.id)}
                            className={selectedImageId === img.id ? 'selected' : ''}
                        />
                    )
                ))}
            </GalleryContainer>
            <ButtonContainer>
                {pendingImages.length === 0 ? (
                    <>
                        <Button $variant="primary" onClick={handleUploadToGalleryClick}>
                            Subir imagen a galería
                        </Button>
                        <Button
                            $variant="primary"
                            onClick={handleSaveNewCover}
                            disabled={!selectedImageId}
                        >
                            Guardar como portada
                        </Button>
                    </>
                ) : (
                    <>
                        <Button $variant="primary" onClick={handleUploadToGalleryClick}>
                            Subir más imágenes
                        </Button>
                        <Button
                            $variant="primary"
                            onClick={handleConfirmGalleryUpload}
                            disabled={selectedPendingImages.length === 0}
                        >
                            Confirmar subida ({selectedPendingImages.length} imágenes)
                        </Button>
                        <Button $variant="dark" onClick={() => {
                            setPendingImages([]);
                            setSelectedPendingImages([]);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}>
                            Cancelar subida
                        </Button>
                    </>
                )}
                <Button $variant="cancel" onClick={() => setShowGallery(false)}>
                    Cancelar
                </Button>
            </ButtonContainer>
            <HiddenFileInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
            />
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