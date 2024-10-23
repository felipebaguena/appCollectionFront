import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Game } from '@/types/game';
import { useGameImages } from '@/hooks/useGameImages';
import { FaChevronLeft, FaChevronRight, FaClock, FaTimes } from 'react-icons/fa';
import { ButtonContainer } from '@/components/ui/FormElements';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game;
    getImageUrl: (path: string) => string;
}

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
  border: 2px solid transparent;
  &:hover {
    border-color: var(--clear-grey);
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
  align-items: stretch;
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

const IconBase = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PendingIcon = styled(IconBase)`
  background-color: rgba(0, 0, 0, 0.7);
`;

const DeleteIcon = styled(IconBase) <{ isVisible: boolean }>`
  background-color: rgba(255, 0, 0, 0.7);
  cursor: pointer;
  display: ${props => props.isVisible ? 'flex' : 'none'};
`;

const SelectedImage = styled(GalleryImage) <{ $isSelected: boolean }>`
  position: relative;
  border-color: ${props => props.$isSelected ? 'red' : 'transparent'};
  opacity: ${props => props.$isSelected ? 0.5 : 1};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: red;
    opacity: ${props => props.$isSelected ? 1 : 0};
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    border-color: red;

    &::after {
      opacity: 1;
    }
  }
`;

const GameGalleryModal: React.FC<GalleryModalProps> = ({
    isOpen,
    onClose,
    game,
    getImageUrl
}) => {

    const {
        gameImages,
        loading,
        error,
        fetchGameImages,
        uploadImage,
        deleteImage,
        deleteMultipleImages
    } = useGameImages(game.id);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [hoveredHalf, setHoveredHalf] = useState<'left' | 'right' | null>(null);
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
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

    const modalContent = (
        <>
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
                                        $isSelected={selectedImages.includes(img.id)}
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
                        <Button $variant="primary" onClick={handleUploadClick}>
                            Subir imagen
                        </Button>
                        <Button $variant="dark" onClick={handleDeleteModeToggle}>
                            {isDeleteMode ? 'Salir del borrado' : 'Borrar imágenes'}
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
                        <Button $variant="cancel" onClick={onClose}>
                            Cerrar galería
                        </Button>
                        <HiddenFileInput
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                        />
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
                        <Button $variant="primary" onClick={handleBackToGallery}>
                            Volver a la galería
                        </Button>
                        <Button $variant="cancel" onClick={onClose}>
                            Cerrar galería
                        </Button>
                    </ButtonContainer>
                </FullSizeImageContainer>
            )}
        </>
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={`Galería del juego: ${game.title}`}
                width="90%"
                maxWidth="1200px"
            >
                {modalContent}
            </Modal>
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
        </>
    );
};

export default GameGalleryModal;
