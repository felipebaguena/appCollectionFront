import { Game } from '@/types/game';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGameImages } from '@/hooks/useGameImages';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
    getImageUrl: (path: string) => string;
    onCoverUpdated: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: black;
  z-index: 1001;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: calc(90vh - 100px);
  object-fit: contain;
  margin-bottom: 20px;
`;

const NoImageText = styled.div`
  font-size: 1.5rem;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #e0e0e0;
  }
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
  &.selected {
    border-color: #28a745;
  }
`;

const CoverImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, game, getImageUrl, onCoverUpdated }) => {
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    useEffect(() => {
        console.log('selectedImageId', selectedImageId);

    }, [selectedImageId])

    const {
        gameImages,
        loading,
        error,
        fetchGameImages,
        setCover
    } = useGameImages(game?.id || 0);

    useEffect(() => {
        if (showGallery && game) {
            fetchGameImages();
        }
    }, [showGallery, game, fetchGameImages]);

    const handleUpdateCover = () => {
        setShowGallery(true);
    };

    const handleImageSelect = (imageId: number) => {
        setSelectedImageId(imageId);
    };

    const handleSaveNewCover = async () => {
        if (selectedImageId && game) {
            await setCover(selectedImageId);
            setShowGallery(false);
            onCoverUpdated();
            onClose();
        }
    };

    if (!isOpen || !game) return null;

    const coverImage = game.images.find(img => img.isCover);
    const imageSrc = coverImage ? getImageUrl(coverImage.path) : null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {showGallery ? (
                    <>
                        <h2>Selecciona una nueva portada</h2>
                        {loading && <p>Cargando imágenes...</p>}
                        {error && <p>Error: {error}</p>}
                        <GalleryContainer>
                            {gameImages.map((img) => (
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
                            <Button onClick={handleSaveNewCover} disabled={!selectedImageId || loading}>
                                Guardar nueva portada
                            </Button>
                            <Button onClick={() => setShowGallery(false)}>Cancelar</Button>
                        </ButtonContainer>
                    </>
                ) : (
                    <>
                        {imageSrc ? (
                            <StyledImage src={imageSrc} alt={`Portada de ${game.title}`} />
                        ) : (
                            <NoImageText>Sin portada</NoImageText>
                        )}
                        <ButtonContainer>
                            <Button onClick={handleUpdateCover}>Actualizar portada</Button>
                            <Button onClick={onClose}>Cerrar</Button>
                        </ButtonContainer>
                    </>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

export default CoverImageModal;
