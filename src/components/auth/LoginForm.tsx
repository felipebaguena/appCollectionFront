'use client';

import React, { useState } from 'react';
import { useUserActions } from '@/hooks/useUserActions';
import Button from '@/components/ui/Button';
import {
  StyledForm,
  InputGroup,
  Label,
  Input,
  Message
} from '@/components/ui/FormElements';
import styled from 'styled-components';

const RegisterOption = styled.p`
  text-align: center;
  margin-top: 1rem;
`;

const RegisterLink = styled.span`
  color: var(--app-yellow);
  cursor: pointer;
  text-decoration: underline;
`;

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess: (access_token: string) => void;
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { login, isLoading, error } = useUserActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const result = await login({ email, password });
      if (result.success) {
        setMessage('Login exitoso');
        onLoginSuccess(result.access_token);
        setTimeout(onClose, 2000);
      } else {
        setMessage(error || 'No se pudo iniciar sesión');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setMessage('Ocurrió un error al intentar iniciar sesión');
    }
  };

  return (
    <div>
      <StyledForm onSubmit={handleSubmit}>
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
        <Button type="submit" $variant="primary" $fullWidth disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
        <Button type="button" $variant="cancel" $fullWidth onClick={onClose} disabled={isLoading}>Cancelar</Button>
      </StyledForm>
      {message && <Message error={!!error}>{message}</Message>}
      <RegisterOption>
        ¿No tienes una cuenta? <RegisterLink onClick={onRegisterClick}>Regístrate aquí</RegisterLink>
      </RegisterOption>
    </div>
  );
};

export default LoginForm;