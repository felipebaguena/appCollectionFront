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
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'cancel';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p>{message}</p>
      <ButtonContainer>
        <Button $variant="cancel" onClick={onClose}>{cancelText}</Button>
        <Button $variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>
      </ButtonContainer>
    </Modal>
  );
};

export default ConfirmationModal;
