'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUserActions } from '@/hooks/useUserActions';
import { FiEdit } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import UserProfileModal from '@/components/user/UserProfileModal';
import Button from '@/components/ui/Button';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  color: #333333;
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: #666666;
`;

const Value = styled.span`
  color: #333333;
`;

interface UserData {
    name: string;
    email: string;
}

const UserProfile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { getUser, isLoading, error } = useUserActions();

    const handleCloseModal = async () => {
        const updatedUser = await getUser();
        if (updatedUser) {
            setUserData(updatedUser);
        }
        setShowEditModal(false);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUser();
            if (user) {
                setUserData(user);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <ProfileContainer>
            <ProfileHeader>
                <ProfileTitle>Mi Perfil</ProfileTitle>
                <Button
                    $variant="primary"
                    onClick={() => setShowEditModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FiEdit size={18} />
                    Editar Perfil
                </Button>
            </ProfileHeader>

            <ProfileInfo>
                <InfoItem>
                    <Label>Nombre:</Label>
                    <Value>{userData?.name || 'No disponible'}</Value>
                </InfoItem>
                <InfoItem>
                    <Label>Email:</Label>
                    <Value>{userData?.email || 'No disponible'}</Value>
                </InfoItem>
            </ProfileInfo>

            <Modal
                isOpen={showEditModal}
                onClose={handleCloseModal}
                title="Editar Perfil"
            >
                <UserProfileModal
                    isOpen={showEditModal}
                    onClose={handleCloseModal}
                />
            </Modal>
        </ProfileContainer>
    );
};

export default UserProfile; 