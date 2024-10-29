'use client'

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGame } from '@/hooks/useGame';
import { useGameImages } from '@/hooks/useGameImages';
import { getImageUrl } from '@/services/api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const Column = styled.div`
  flex: 1;
`;

const Cover = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--dark-grey);
`;

const Developer = styled.div`
  font-size: 1.2rem;
  color: var(--grey);
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: var(--dark-grey);
`;

const Value = styled.span`
  color: var(--grey);
`;

const GallerySection = styled.div`
  width: 100%;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const NavigationButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.position}: 20px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const GameDetails: React.FC<{ id: string }> = ({ id }) => {
  const { game, loading, error, fetchGame } = useGame(id);
  const { gameImages, loading: imagesLoading, fetchGameImages } = useGameImages(Number(id));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchGame();
    fetchGameImages();
  }, [fetchGame, fetchGameImages]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!game) return <div>No se encontró el juego</div>;

  const coverImage = game.images.find(img => img.isCover);
  const coverUrl = coverImage ? getImageUrl(coverImage.path) : '/uploads/resources/no-image.jpg';

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev =>
      prev !== null ? (prev > 0 ? prev - 1 : gameImages.length - 1) : null
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev =>
      prev !== null ? (prev < gameImages.length - 1 ? prev + 1 : 0) : null
    );
  };

  return (
    <PageContainer>
      <InfoContainer>
        <Column>
          <Cover src={coverUrl} alt={`Portada de ${game.title}`} />
          <Title>{game.title}</Title>
          <Developer>{game.developers?.map(d => d.name).join(', ')}</Developer>
        </Column>
        <Column>
          <InfoGroup>
            <Label>Año de lanzamiento</Label>
            <Value>{game.releaseYear}</Value>
          </InfoGroup>
          <InfoGroup>
            <Label>Géneros</Label>
            <Value>{game.genres?.map(g => g.name).join(', ') || 'N/A'}</Value>
          </InfoGroup>
          <InfoGroup>
            <Label>Plataformas</Label>
            <Value>{game.platforms?.map(p => p.name).join(', ') || 'N/A'}</Value>
          </InfoGroup>
          <InfoGroup>
            <Label>Descripción</Label>
            <Value>{game.description}</Value>
          </InfoGroup>
        </Column>
      </InfoContainer>

      <GallerySection>
        <GalleryGrid>
          {gameImages.filter(img => !img.isCover).map((image, index) => (
            <GalleryImage
              key={image.id}
              src={getImageUrl(image.path)}
              alt={image.filename}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </GalleryGrid>
      </GallerySection>

      {selectedImageIndex !== null && (
        <LightboxOverlay onClick={handleClose}>
          <LightboxContent onClick={e => e.stopPropagation()}>
            <LightboxImage
              src={getImageUrl(gameImages[selectedImageIndex].path)}
              alt={gameImages[selectedImageIndex].filename}
            />
            <NavigationButton position="left" onClick={handlePrevImage}>
              <FaChevronLeft size={24} />
            </NavigationButton>
            <NavigationButton position="right" onClick={handleNextImage}>
              <FaChevronRight size={24} />
            </NavigationButton>
          </LightboxContent>
        </LightboxOverlay>
      )}
    </PageContainer>
  );
};

export default GameDetails;