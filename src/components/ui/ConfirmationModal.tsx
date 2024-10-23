import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ButtonContainer } from '@/components/ui/FormElements';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <ButtonContainer>
        <Button $variant="cancel" onClick={onClose}>Cancelar</Button>
        <Button $variant="primary" onClick={onConfirm}>Confirmar</Button>
      </ButtonContainer>
    </Modal>
  );
};

export default ConfirmationModal;
