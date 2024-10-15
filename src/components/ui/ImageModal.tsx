import { Game } from '@/types/game';
import React from 'react';
import styled from 'styled-components';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
    getImageUrl: (path: string) => string;
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

const CloseButtonBottom = styled.button`
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

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, game, getImageUrl }) => {
    if (!isOpen || !game) return null;

    const coverImage = game.images.find(img => img.id === game.coverId);
    const imageSrc = coverImage ? getImageUrl(coverImage.path) : null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {imageSrc ? (
                    <StyledImage src={imageSrc} alt={`Portada de ${game.title}`} />
                ) : (
                    <NoImageText>Sin portada</NoImageText>
                )}
                <CloseButtonBottom onClick={onClose}>Cerrar</CloseButtonBottom>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ImageModal;
