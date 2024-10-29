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

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--dark-grey);
`;

const Developer = styled.div`
  font-size: 1.2rem;
  color: var(--grey);
  margin-bottom: 2rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  display: block;
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
  cursor: pointer;
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const NavigationButton = styled.div<{ position: 'left' | 'right', isVisible: boolean }>`
  position: absolute;
  top: 50%;
  ${props => props.position}: 20px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const Description = styled.div`
  margin: 2rem 0 2rem 0;
  overflow: hidden;
`;

const DescriptionContent = styled.div`
  position: relative;
`;

const DescriptionText = styled(Value)`
  line-height: 1.6;
`;

const DescriptionParagraph = styled.p`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureImage = styled.img`
  float: right;
  width: 400px;
  height: auto;
  margin: 0 0 1rem 2rem;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    float: none;
    width: 100%;
    margin: 1rem 0;
  }
`;

const FeatureImageLeft = styled(FeatureImage)`
  float: left;
  margin: 0 2rem 1rem 0;
`;

const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
`;

const HeaderTitle = styled(Title)`
  color: white;
  font-size: 2.5rem;
`;

const HeaderDeveloper = styled(Developer)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const HeaderInfoGroup = styled(InfoGroup)`
  color: white;
`;

const HeaderLabel = styled(Label)`
  color: rgba(255, 255, 255, 0.8);
`;

const HeaderValue = styled(Value)`
  color: white;
`;

const GameDetails: React.FC<{ id: string }> = ({ id }) => {
  const { game, loading, error, fetchGame } = useGame(id);
  const { gameImages, loading: imagesLoading, fetchGameImages } = useGameImages(Number(id));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [hoveredHalf, setHoveredHalf] = useState<'left' | 'right' | null>(null);

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

  const nonCoverImages = gameImages.filter(img => !img.isCover);
  const firstGalleryImage = nonCoverImages[0];

  const formatDescription = (text: string) => {
    const paragraphs = text.split('\\n\\n');
    const secondGalleryImage = nonCoverImages[1];

    // Si hay 5 o más párrafos y existe una segunda imagen, la insertaremos
    const shouldInsertSecondImage = paragraphs.length >= 5 && secondGalleryImage;

    return paragraphs.map((paragraph, i) => {
      // Si estamos en el primer párrafo y hay una primera imagen
      if (i === 1 && firstGalleryImage) {
        return (
          <React.Fragment key={i}>
            <FeatureImage
              src={getImageUrl(firstGalleryImage.path)}
              alt={firstGalleryImage.filename}
              onClick={() => handleImageClick(0)}
            />
            <DescriptionParagraph>
              {paragraph.split('\\n').map((line, j) => (
                <React.Fragment key={j}>
                  {line}
                  {j < paragraph.split('\\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </DescriptionParagraph>
          </React.Fragment>
        );
      }

      // Si estamos después del tercer párrafo y debemos insertar la segunda imagen
      if (i === 3 && shouldInsertSecondImage) {
        return (
          <React.Fragment key={i}>
            <FeatureImageLeft
              src={getImageUrl(secondGalleryImage.path)}
              alt={secondGalleryImage.filename}
              onClick={() => handleImageClick(1)}
            />
            <DescriptionParagraph>
              {paragraph.split('\\n').map((line, j) => (
                <React.Fragment key={j}>
                  {line}
                  {j < paragraph.split('\\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </DescriptionParagraph>
          </React.Fragment>
        );
      }

      return (
        <DescriptionParagraph key={i}>
          {paragraph.split('\\n').map((line, j) => (
            <React.Fragment key={j}>
              {line}
              {j < paragraph.split('\\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </DescriptionParagraph>
      );
    });
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <HeaderImage src={coverUrl} alt={`Portada de ${game.title}`} />
        <HeaderOverlay>
          <HeaderTitle>{game.title}</HeaderTitle>
          <HeaderDeveloper>{game.developers?.map(d => d.name).join(', ')}</HeaderDeveloper>

          <HeaderInfoGroup>
            <HeaderLabel>Año de lanzamiento</HeaderLabel>
            <HeaderValue>{game.releaseYear}</HeaderValue>
          </HeaderInfoGroup>
          <HeaderInfoGroup>
            <HeaderLabel>Géneros</HeaderLabel>
            <HeaderValue>{game.genres?.map(g => g.name).join(', ') || 'N/A'}</HeaderValue>
          </HeaderInfoGroup>
          <HeaderInfoGroup>
            <HeaderLabel>Plataformas</HeaderLabel>
            <HeaderValue>{game.platforms?.map(p => p.name).join(', ') || 'N/A'}</HeaderValue>
          </HeaderInfoGroup>
        </HeaderOverlay>
      </HeaderContainer>

      <Description>
        <DescriptionContent>
          <DescriptionText>
            {formatDescription(game.description)}
          </DescriptionText>
        </DescriptionContent>
      </Description>

      <GallerySection>
        <GalleryGrid>
          {nonCoverImages.slice(2).map((image, index) => (
            <GalleryImage
              key={image.id}
              src={getImageUrl(image.path)}
              alt={image.filename}
              onClick={() => handleImageClick(index + 2)}
            />
          ))}
        </GalleryGrid>
      </GallerySection>

      {selectedImageIndex !== null && (
        <LightboxOverlay onClick={handleClose}>
          <LightboxContent
            onClick={(e) => {
              e.stopPropagation();
              handleImageNavigation(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <LightboxImage
              src={getImageUrl(gameImages[selectedImageIndex].path)}
              alt={gameImages[selectedImageIndex].filename}
            />
            <NavigationButton
              position="left"
              isVisible={hoveredHalf === 'left'}
            >
              <FaChevronLeft size={24} />
            </NavigationButton>
            <NavigationButton
              position="right"
              isVisible={hoveredHalf === 'right'}
            >
              <FaChevronRight size={24} />
            </NavigationButton>
          </LightboxContent>
        </LightboxOverlay>
      )}
    </PageContainer>
  );
};

export default GameDetails;