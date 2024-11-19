'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import {
    StyledForm,
    InputGroup,
    Label,
    Input,
    ButtonContainer
} from '@/components/ui/FormElements';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const hasOpenedRef = useRef(false);
    const { getUser, updateUser, isLoading } = useUserActions();

    const fetchUserProfile = useCallback(async () => {
        const user = await getUser();
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [getUser]);

    useEffect(() => {
        if (isOpen && !hasOpenedRef.current) {
            hasOpenedRef.current = true;
            fetchUserProfile();
        } else if (!isOpen) {
            hasOpenedRef.current = false;
        }
    }, [isOpen, fetchUserProfile]);

    if (!isOpen) return null;

    const handleCancelEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await updateUser({ name });
        if (success) {
            onClose();
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
                    <Label htmlFor="email">Email:</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        readOnly
                        disabled
                    />
                </InputGroup>
                <ButtonContainer>
                    <Button
                        type="button"
                        $variant="cancel"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        $variant="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
                    </Button>
                </ButtonContainer>
            </StyledForm>
        </div>
    );
};

export default UserProfileModal;