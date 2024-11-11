import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useArticleImages } from '@/hooks/useArticleImages';
import Button from '../ui/Button';
import { ButtonContainer } from '../ui/FormElements';
import { FaClock } from 'react-icons/fa';

export interface ImageSelectionData {
    coverImageId: number | null;
    articleImages: number[];
}

interface ImageSelectionStepProps {
    gameId: number;
    templateImageCount: number;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    isSubmitting: boolean;
    getImageUrl: (path: string) => string;
    onPreview?: (imageData: ImageSelectionData) => void;
}

interface PendingImage {
    id: string;
    file: File;
    previewUrl: string;
}

const StepContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const SectionTitle = styled.h3`
    color: var(--dark-grey);
    margin: 0;
    padding: 1rem 0;
`;

const GalleryContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    max-height: calc(90vh - 300px);
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
    opacity: 0.6;
`;

const ImageSelectionStep: React.FC<ImageSelectionStepProps> = ({
    gameId,
    templateImageCount,
    onSubmit,
    onBack,
    isSubmitting,
    getImageUrl,
    onPreview
}) => {
    const [selectedCoverImage, setSelectedCoverImage] = useState<number | null>(null);
    const [selectedArticleImages, setSelectedArticleImages] = useState<number[]>([]);
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [selectedPendingImages, setSelectedPendingImages] = useState<string[]>([]);
    const [isSelectingArticleImages, setIsSelectingArticleImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        gameArticleImages,
        loading,
        error,
        fetchGameArticleImages,
        uploadToGameGallery
    } = useArticleImages(0, gameId); // articleId es 0 porque aún no existe

    useEffect(() => {
        fetchGameArticleImages();
    }, [fetchGameArticleImages]);

    const handleCoverImageSelect = (imageId: number) => {
        if (!isSelectingArticleImages) {
            setSelectedCoverImage(imageId);
        }
    };

    const handleArticleImageSelect = (imageId: number) => {
        if (isSelectingArticleImages) {
            setSelectedArticleImages(prev => {
                const newSelection = prev.includes(imageId)
                    ? prev.filter(id => id !== imageId)
                    : [...prev, imageId];

                // Asegurarse de no exceder el límite de imágenes
                if (newSelection.length > templateImageCount) {
                    return prev;
                }

                return newSelection;
            });
        }
    };

    const handleUploadClick = () => {
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

    const handleConfirmUpload = async () => {
        const selectedImages = pendingImages.filter(img => selectedPendingImages.includes(img.id));

        for (const pendingImage of selectedImages) {
            try {
                const uploadedImage = await uploadToGameGallery(pendingImage.file);
                if (uploadedImage && uploadedImage.id) {
                    if (!isSelectingArticleImages) {
                        setSelectedCoverImage(uploadedImage.id);
                    } else {
                        setSelectedArticleImages(prev => {
                            const newSelection = [...prev, uploadedImage.id];
                            return newSelection;
                        });
                    }
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        setPendingImages([]);
        setSelectedPendingImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        await fetchGameArticleImages();
    };

    const isValid = () => {
        return selectedCoverImage !== null &&
            selectedArticleImages.length === templateImageCount;
    };

    const handleSubmitOrPreview = (e: React.FormEvent) => {
        e.preventDefault();

        const imageData: ImageSelectionData = {
            coverImageId: selectedCoverImage,
            articleImages: selectedArticleImages
        };

        if (onPreview) {
            onPreview(imageData);
        } else {
            onSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmitOrPreview}>
            <StepContainer>
                <SectionTitle>
                    {isSelectingArticleImages
                        ? `Selecciona ${templateImageCount} imágenes para el artículo`
                        : 'Selecciona la imagen de portada'}
                </SectionTitle>

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
                                    border: selectedPendingImages.includes(img.id)
                                        ? '4px solid var(--app-yellow)'
                                        : '2px solid transparent',
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
                                onClick={() => isSelectingArticleImages
                                    ? handleArticleImageSelect(img.id)
                                    : handleCoverImageSelect(img.id)
                                }
                                className={
                                    (isSelectingArticleImages && selectedArticleImages.includes(img.id)) ||
                                        (!isSelectingArticleImages && selectedCoverImage === img.id)
                                        ? 'selected'
                                        : ''
                                }
                            />
                        )
                    ))}
                </GalleryContainer>

                <ButtonContainer>
                    {pendingImages.length === 0 ? (
                        <>
                            <Button $variant="primary" onClick={handleUploadClick}>
                                Subir nueva imagen
                            </Button>
                            {!isSelectingArticleImages && selectedCoverImage && (
                                <Button
                                    $variant="primary"
                                    onClick={() => setIsSelectingArticleImages(true)}
                                >
                                    Siguiente
                                </Button>
                            )}
                            {isSelectingArticleImages && (
                                <Button
                                    $variant="dark"
                                    onClick={() => setIsSelectingArticleImages(false)}
                                >
                                    Volver a portada
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <Button $variant="primary" onClick={handleUploadClick}>
                                Subir más imágenes
                            </Button>
                            <Button
                                $variant="primary"
                                onClick={handleConfirmUpload}
                                disabled={selectedPendingImages.length === 0}
                            >
                                Confirmar subida ({selectedPendingImages.length} imágenes)
                            </Button>
                            <Button
                                $variant="dark"
                                onClick={() => {
                                    setPendingImages([]);
                                    setSelectedPendingImages([]);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                            >
                                Cancelar subida
                            </Button>
                        </>
                    )}

                    {isSelectingArticleImages && selectedArticleImages.length === templateImageCount && (
                        <Button
                            type="submit"
                            $variant="primary"
                            disabled={isSubmitting}
                        >
                            {onPreview ? 'Vista previa' : isSubmitting ? 'Creando...' : 'Crear artículo'}
                        </Button>
                    )}

                    <Button
                        type="button"
                        $variant="dark"
                        onClick={onBack}
                        disabled={isSubmitting}
                    >
                        Volver
                    </Button>
                </ButtonContainer>

                <HiddenFileInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                />
            </StepContainer>
            <input type="hidden" name="coverImageId" value={selectedCoverImage || ''} />
            {selectedArticleImages.map(imageId => (
                <input
                    key={imageId}
                    type="hidden"
                    name="articleImages"
                    value={imageId}
                />
            ))}
        </form>
    );
};

export default ImageSelectionStep;