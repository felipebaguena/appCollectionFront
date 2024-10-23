import React from 'react';
import styled from 'styled-components';

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

const DeleteImageButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const DeleteImageButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

const DeleteImageConfirmButton = styled(DeleteImageButton)`
  background-color: #dc3545;
  color: white;
`;

const DeleteImageCancelButton = styled(DeleteImageButton)`
  background-color: #6c757d;
  color: white;
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
                <DeleteImageButtonContainer>
                    <DeleteImageCancelButton onClick={onClose}>Cancelar</DeleteImageCancelButton>
                    <DeleteImageConfirmButton onClick={onConfirm}>Confirmar</DeleteImageConfirmButton>
                </DeleteImageButtonContainer>
            </DeleteImageModalContent>
        </DeleteImageModalOverlay>
    );
};

export default DeleteImageConfirmationModal;