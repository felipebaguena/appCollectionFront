import { Game } from '@/types/game';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGameImages } from '@/hooks/useGameImages';
import Button from '../ui/Button';
import Modal from './Modal';
import { ButtonContainer } from './FormElements';

interface CoverImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
    getImageUrl: (path: string) => string;
    onCoverUpdated: () => void;
}

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

const CoverImageModal: React.FC<CoverImageModalProps> = ({ isOpen, onClose, game, getImageUrl, onCoverUpdated }) => {
    const [showGallery, setShowGallery] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

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

    if (!game) return null;

    const coverImage = game.images.find(img => img.isCover);
    const imageSrc = coverImage ? getImageUrl(coverImage.path) : null;

    const modalContent = showGallery ? (
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
                <Button $variant="primary" onClick={handleSaveNewCover} disabled={!selectedImageId || loading}>
                    Guardar nueva portada
                </Button>
                <Button $variant="cancel" onClick={() => setShowGallery(false)}>Cancelar</Button>
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
                <Button $variant="primary" onClick={handleUpdateCover}>Actualizar portada</Button>
                <Button $variant="cancel" onClick={onClose}>Cerrar</Button>
            </ButtonContainer>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={showGallery ? "Seleccionar nueva portada" : `Portada de ${game.title}`}
            width="90%"
            maxWidth="800px"
        >
            {modalContent}
        </Modal>
    );
};

export default CoverImageModal;
