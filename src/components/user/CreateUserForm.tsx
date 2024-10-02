'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import { 
  StyledForm, 
  InputGroup, 
  Label, 
  Input, 
  Message 
} from '@/components/ui/FormElements';

interface CreateUserFormProps {
  onClose: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { createUser, isLoading, error } = useUserActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const success = await createUser({ name, email, password });

    if (success) {
      setMessage('Usuario creado con éxito');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(onClose, 2000);
    } else {
      setMessage(error || 'No se pudo crear el usuario');
    }
  };

  return (
    <div>
      <h2>Crear Usuario</h2>
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
        <InputGroup>
          <Label htmlFor="password">Contraseña:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit" primary disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </Button>
        <Button onClick={onClose} disabled={isLoading}>Cancelar</Button>
      </StyledForm>
      {message && <Message error={!!error}>{message}</Message>}
    </div>
  );
};

export default CreateUserForm;