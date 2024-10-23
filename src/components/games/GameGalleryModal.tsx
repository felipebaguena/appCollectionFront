import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Game } from '@/types/game';
import { useGameImages } from '@/hooks/useGameImages';
import { FaChevronLeft, FaChevronRight, FaClock, FaUpload, FaTrash, FaTimes } from 'react-icons/fa';
import { ButtonContainer } from '@/components/management/DataTableElements';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Button from '../ui/Button';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game;
    getImageUrl: (path: string) => string;
}

const GalleryModalContent = styled.div`
  background-color: white;
  padding: 20px;
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1002; // Aumenta este z-index para asegurarte de que esté por encima de otros modales
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
  border: 2px solid transparent;
  &:hover {
    border-color: #007bff;
  }
`;

const FullSizeImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const FullSizeImageContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(90vh - 250px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const NavigationOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
`;

const NavigationHalf = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;

  &:last-child {
    justify-content: flex-end;
  }
`;

const NavigationIcon = styled.div<{ isVisible: boolean; direction: 'left' | 'right' }>`
  color: white;
  font-size: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.direction === 'left' ? 'padding-right: 20px;' : 'padding-left: 20px;'}
`;

const UploadButton = styled(Button).attrs({ $variant: 'upload' })``;

const HiddenFileInput = styled.input`
  display: none;
`;

interface PendingImage {
    id: string;
    file: File;
    previewUrl: string;
}

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
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteIcon = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`;

const SelectedImage = styled(GalleryImage)`
  border: 3px solid #007bff;
`;

const GameGalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, game, getImageUrl }) => {
    const { gameImages, loading, error, fetchGameImages, uploadImage, deleteImage, deleteMultipleImages } = useGameImages(game.id);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [hoveredHalf, setHoveredHalf] = useState<'left' | 'right' | null>(null);
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    useEffect(() => {
        if (isOpen) {
            fetchGameImages();
        }
    }, [isOpen, fetchGameImages]);

    if (!isOpen) return null;

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    const handleBackToGallery = () => {
        setSelectedImageIndex(null);
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) => {
            if (prevIndex === null) return gameImages.length - 1;
            return prevIndex > 0 ? prevIndex - 1 : gameImages.length - 1;
        });
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) => {
            if (prevIndex === null) return 0;
            return prevIndex < gameImages.length - 1 ? prevIndex + 1 : 0;
        });
    };

    const handleImageNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e;
        const { left, width } = currentTarget.getBoundingClientRect();
        const clickPosition = clientX - left;

        if (clickPosition < width / 2) {
            handlePrevImage();
        } else {
            handleNextImage();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = e;
        const { left, width } = currentTarget.getBoundingClientRect();
        const mousePosition = clientX - left;

        if (mousePosition < width / 2) {
            setHoveredHalf('left');
        } else {
            setHoveredHalf('right');
        }
    };

    const handleMouseLeave = () => {
        setHoveredHalf(null);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newPendingImages = Array.from(files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            setPendingImages(prev => [...prev, ...newPendingImages]);
        }
    };

    const handleConfirmUpload = async () => {
        for (const pendingImage of pendingImages) {
            try {
                await uploadImage(pendingImage.file);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
        setPendingImages([]);
        fetchGameImages();
    };

    const handleDeleteModeToggle = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedImages([]);
    };

    const handleImageSelect = (imageId: number) => {
        if (isDeleteMode) {
            setSelectedImages(prev =>
                prev.includes(imageId) ? prev.filter(id => id !== imageId) : [...prev, imageId]
            );
        } else {
            handleImageClick(gameImages.findIndex(img => img.id === imageId));
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        setConfirmationModal({
            isOpen: true,
            title: 'Confirmar eliminación',
            message: "¿Seguro que deseas borrar la imagen?",
            onConfirm: async () => {
                try {
                    await deleteImage(imageId);
                } catch (error) {
                    console.error("Error al borrar la imagen:", error);
                }
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleDeleteSelectedImages = async () => {
        setConfirmationModal({
            isOpen: true,
            title: 'Confirmar eliminación múltiple',
            message: `¿Seguro que deseas borrar ${selectedImages.length} imágenes seleccionadas?`,
            onConfirm: async () => {
                try {
                    await deleteMultipleImages(selectedImages);
                    setSelectedImages([]);
                } catch (error) {
                    console.error("Error al borrar las imágenes seleccionadas:", error);
                }
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <GalleryModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Galería del juego: {game.title}</h2>
            {loading && <p>Cargando imágenes...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && selectedImageIndex === null && (
                <>
                    <GalleryContainer>
                        {pendingImages.map((img) => (
                            <PendingImageWrapper key={img.id}>
                                <PendingImage
                                    src={img.previewUrl}
                                    alt="Pending upload"
                                />
                                <PendingIcon>
                                    <FaClock />
                                </PendingIcon>
                            </PendingImageWrapper>
                        ))}
                        {gameImages.map((img) => (
                            <div key={img.id} style={{ position: 'relative' }}>
                                {isDeleteMode ? (
                                    <SelectedImage
                                        src={getImageUrl(img.path)}
                                        alt={img.filename}
                                        onClick={() => handleImageSelect(img.id)}
                                        style={{ opacity: selectedImages.includes(img.id) ? 0.6 : 1 }}
                                    />
                                ) : (
                                    <GalleryImage
                                        src={getImageUrl(img.path)}
                                        alt={img.filename}
                                        onClick={() => handleImageClick(gameImages.indexOf(img))}
                                    />
                                )}
                                <DeleteIcon
                                    isVisible={isDeleteMode}
                                    onClick={() => handleDeleteImage(img.id)}
                                >
                                    <FaTimes />
                                </DeleteIcon>
                            </div>
                        ))}
                    </GalleryContainer>
                    <ButtonContainer>
                        <UploadButton onClick={handleUploadClick}>
                            <FaUpload /> Subir imagen
                        </UploadButton>
                        <Button $variant="primary" onClick={handleDeleteModeToggle}>
                            {isDeleteMode ? 'Salir del borrado' : <><FaTrash /> Borrar imágenes</>}
                        </Button>
                        {isDeleteMode && selectedImages.length > 0 && (
                            <Button $variant="danger" onClick={handleDeleteSelectedImages}>
                                Borrar imágenes seleccionadas ({selectedImages.length})
                            </Button>
                        )}
                        {pendingImages.length > 0 && (
                            <Button $variant="primary" onClick={handleConfirmUpload}>
                                Confirmar subida ({pendingImages.length})
                            </Button>
                        )}
                        <HiddenFileInput
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                        />
                        <Button $variant="danger" onClick={onClose}>Cerrar</Button>
                    </ButtonContainer>
                </>
            )}
            {selectedImageIndex !== null && gameImages.length > 0 && (
                <FullSizeImageContainer>
                    <ImageWrapper
                        onClick={handleImageNavigation}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <FullSizeImage
                            src={getImageUrl(gameImages[selectedImageIndex].path)}
                            alt={gameImages[selectedImageIndex].filename}
                        />
                        <NavigationOverlay>
                            <NavigationHalf>
                                <NavigationIcon isVisible={hoveredHalf === 'left'} direction="left">
                                    <FaChevronLeft />
                                </NavigationIcon>
                            </NavigationHalf>
                            <NavigationHalf>
                                <NavigationIcon isVisible={hoveredHalf === 'right'} direction="right">
                                    <FaChevronRight />
                                </NavigationIcon>
                            </NavigationHalf>
                        </NavigationOverlay>
                    </ImageWrapper>
                    <ButtonContainer>
                        <Button $variant="primary" onClick={handleBackToGallery}>Volver a la galería</Button>
                        <Button $variant="danger" onClick={onClose}>Cerrar</Button>
                    </ButtonContainer>
                </FullSizeImageContainer>
            )}
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
                confirmText="Confirmar"
                cancelText="Cancelar"
                confirmVariant="danger"
            />
        </GalleryModalContent>
    );
};

export default GameGalleryModal;
