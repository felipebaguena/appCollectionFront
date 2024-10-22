import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Game } from '@/types/game';
import { useGameImages } from '@/hooks/useGameImages';
import { FaChevronLeft, FaChevronRight, FaUpload } from 'react-icons/fa';
import { Button, ButtonContainer, DeleteButton } from '@/components/management/DataTableElements';

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

const UploadButton = styled(Button)`
  background-color: #28a745;
  &:hover {
    background-color: #218838;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const GameGalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, game, getImageUrl }) => {
    const { gameImages, loading, error, fetchGameImages, uploadImage } = useGameImages(game.id);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [hoveredHalf, setHoveredHalf] = useState<'left' | 'right' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await uploadImage(file);
                fetchGameImages();
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    return (
        <GalleryModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Galería del juego: {game.title}</h2>
            {loading && <p>Cargando imágenes...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && selectedImageIndex === null && (
                <>
                    <GalleryContainer>
                        {gameImages.map((img, index) => (
                            <GalleryImage
                                key={img.id}
                                src={getImageUrl(img.path)}
                                alt={img.filename}
                                onClick={() => handleImageClick(index)}
                            />
                        ))}
                    </GalleryContainer>
                    <ButtonContainer>
                        <UploadButton onClick={handleUploadClick}>
                            <FaUpload /> Subir imagen
                        </UploadButton>
                        <HiddenFileInput
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <DeleteButton onClick={onClose}>Cerrar</DeleteButton>
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
                        <Button onClick={handleBackToGallery}>Volver a la galería</Button>
                        <DeleteButton onClick={onClose}>Cerrar</DeleteButton>
                    </ButtonContainer>
                </FullSizeImageContainer>
            )}
        </GalleryModalContent>
    );
};

export default GameGalleryModal;
