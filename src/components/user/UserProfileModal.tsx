'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import { 
  StyledForm, 
  InputGroup, 
  Label, 
  Input, 
  Message 
} from '@/components/ui/FormElements';

interface UserProfileModalProps {
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { getUser, updateUser, isLoading, error } = useUserActions();

  const fetchUserProfile = useCallback(async () => {
    const user = await getUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const success = await updateUser(name, { name, email });

    if (success) {
      setMessage('Perfil actualizado con éxito');
      setTimeout(onClose, 2000);
    } else {
      setMessage(error || 'No se pudo actualizar el perfil');
    }
  };

  return (
    <div>
      <h2>Mi Perfil</h2>
      <StyledForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="name">Nombre:</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit" primary disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
        </Button>
        <Button onClick={onClose} disabled={isLoading}>Cancelar</Button>
      </StyledForm>
      {message && <Message error={!!error}>{message}</Message>}
    </div>
  );
};

export default UserProfileModal;