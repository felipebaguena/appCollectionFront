'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import {
    StyledForm,
    InputGroup,
    Label,
    Input,
    Message,
    ButtonContainer
} from '@/components/ui/FormElements';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const hasOpenedRef = useRef(false);
    const { getUser, updateUser, isLoading, error } = useUserActions();
    const [isEditing, setIsEditing] = useState(false);

    const fetchUserProfile = useCallback(async () => {
        const user = await getUser();
        if (user) {
            setName(user.name);
            setEmail(user.email);
        } else {
            setMessage(error || 'No se pudo obtener el perfil del usuario');
        }
    }, [getUser, error]);

    useEffect(() => {
        if (isOpen && !hasOpenedRef.current) {
            hasOpenedRef.current = true;
            fetchUserProfile();
        } else if (!isOpen) {
            hasOpenedRef.current = false;
        }
    }, [isOpen, fetchUserProfile]);

    if (!isOpen) return null;

    const handleEditClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
    }, []);

    const handleCloseClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(false);
        onClose()
    }, []);

    const handleCancelEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(false);
        fetchUserProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            const success = await updateUser({ name });

            if (success) {
                setMessage('Perfil actualizado con éxito');
                setIsEditing(false);
                setTimeout(() => setMessage(''), 2000);
            } else {
                setMessage(error || 'No se pudo actualizar el perfil');
            }
        } catch (err) {
            console.error('Error al actualizar el perfil:', err);
            setMessage('Ocurrió un error al actualizar el perfil');
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
                        disabled={!isEditing}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="email">Email:</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        readOnly
                    />
                </InputGroup>
                {isEditing ? (
                    <ButtonContainer>
                        <Button type="button" onClick={handleCancelEdit} disabled={isLoading}>Cancelar</Button>
                        <Button type="submit" $primary disabled={isLoading}>
                            {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
                        </Button>
                    </ButtonContainer>
                ) : (
                    <ButtonContainer>
                        <Button onClick={handleCloseClick}>Cerrar</Button>
                        <Button type="button" $primary onClick={handleEditClick}>Editar</Button>
                    </ButtonContainer>
                )}
            </StyledForm>
            {message && <Message error={!!error}>{message}</Message>}
        </div>
    );
};

export default UserProfileModal;