import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import { ButtonContainer } from '@/components/ui/FormElements';

const DeleteImageModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const DeleteImageModalContent = styled.div`
  background-color: white;
  color: black;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 100%;
`;

interface DeleteImageConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const DeleteImageConfirmationModal: React.FC<DeleteImageConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <DeleteImageModalOverlay onClick={onClose}>
            <DeleteImageModalContent onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <ButtonContainer>
                    <Button $variant="cancel" onClick={onClose}>Cancelar</Button>
                    <Button $variant="danger" onClick={onConfirm}>Confirmar</Button>
                </ButtonContainer>
            </DeleteImageModalContent>
        </DeleteImageModalOverlay>
    );
};

export default DeleteImageConfirmationModal;
