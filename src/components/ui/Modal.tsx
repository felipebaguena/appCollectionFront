'use client';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { NAVBAR_HEIGHT } from '../layout/NavbarElements';

interface ModalContentProps {
  $width?: string;
  $maxWidth?: string;
  $height?: string;
  $maxHeight?: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px) saturate(180%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: calc(${NAVBAR_HEIGHT} + 1rem);
  z-index: 1000;
`;

const ModalHeader = styled.div`
  background-color: var(--dark-grey);
  padding: 0.9rem 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const ModalContent = styled.div<ModalContentProps>`
  background-color: var(--mid-grey);
  border-radius: 1px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: ${props => props.$width || '90%'};
  max-width: ${props => props.$maxWidth || '30rem'};
  height: ${props => props.$height || 'auto'};
  max-height: ${props => props.$maxHeight || `calc(100vh - ${NAVBAR_HEIGHT} - 2rem)`};
  display: flex;
  flex-direction: column;
  color: white;

  @media (min-width: 768px) {
    width: 80%;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem 1.5rem;
  overflow-y: auto;
`;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  maxWidth?: string;
  height?: string;
  maxHeight?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width,
  maxWidth,
  height,
  maxHeight
}) => {
  if (!isOpen) return null;

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={handleContentClick} $width={width} $maxWidth={maxWidth} $height={height} $maxHeight={maxHeight}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
