import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useUserActions, CreateUserData } from '@/hooks/useUserActions';
import {
  StyledForm,
  InputGroup,
  Label,
  Input,
  Message,
  ErrorMessage
} from '@/components/ui/FormElements';

interface CreateUserFormProps {
  onClose: () => void;
  onLoginSuccess?: (access_token: string) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onClose, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');

  const { createUser, isLoading, error } = useUserActions();

  useEffect(() => {
    if (passwordError && password === confirmPassword) {
      setPasswordError('');
    }
  }, [password, confirmPassword, passwordError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    const userData: CreateUserData = {
      name,
      nik,
      email,
      password
    };

    try {
      const response = await createUser(userData);

      if (response.success) {
        setMessage('Usuario creado con éxito');
        if (response.access_token && onLoginSuccess) {
          onLoginSuccess(response.access_token);
        }
        onClose();
      } else {
        setMessage(error || 'No se pudo crear el usuario');
      }
    } catch (err) {
      setMessage('Error al crear el usuario');
    }
  };

  return (
    <div>
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
          <Label htmlFor="nik">Nik:</Label>
          <Input
            type="text"
            id="nik"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
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
        <InputGroup>
          <Label htmlFor="confirmPassword">Confirmar Contraseña:</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </InputGroup>
        <Button type="submit" $variant="primary" $fullWidth disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </Button>
        <Button type="button" $variant="cancel" $fullWidth onClick={onClose} disabled={isLoading}>Cancelar</Button>
      </StyledForm>
      {message && <Message error={!!error}>{message}</Message>}
    </div>
  );
};

export default CreateUserForm;