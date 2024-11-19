'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useUserActions } from '@/hooks/useUserActions';
import { FiEdit } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import UserProfileModal from '@/components/user/UserProfileModal';
import Button from '@/components/ui/Button';
import { getImageUrl } from '@/services/api';
import Link from 'next/link';
import {
    SectionHeader,
    ProfileContainer,
    GamesList,
    GamesSection,
    ProfileInfo,
    InfoItem,
    Label,
    Value,
    StatsContainer,
    StatsGrid,
    StatItem,
    StatValue,
    StatLabel,
    HiddenFileInput,
} from './UserProfileElements';
import FullPageSpinner from '@/components/ui/FullPageSpinner';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const GameCard = styled.div`
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GameImage = styled.img`
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
`;

const GameTitle = styled.div`
  padding: 0.75rem;
  font-size: 0.9rem;
  text-align: center;
  color: var(--dark-grey);
  font-weight: 600;
  background-color: var(--app-yellow);
  line-height: 1.2;
`;

interface UserData {
    nik: string;
    name: string;
    email: string;
    avatarPath?: string;
}

const UserProfile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userStats, setUserStats] = useState<any>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const { getUser, getUserStats, updateAvatar, isLoading, error } = useUserActions();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCloseModal = async () => {
        const updatedUser = await getUser();
        if (updatedUser) {
            setUserData(updatedUser);
        }
        setShowEditModal(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const response = await updateAvatar(file);
            if (response) {
                const updatedUser = await getUser();
                if (updatedUser) {
                    setUserData(updatedUser);
                }
            }
        } catch (error) {
            console.error('Error al actualizar el avatar:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [user, stats] = await Promise.all([
                    getUser(),
                    getUserStats()
                ]);
                if (user) setUserData(user);
                if (stats) setUserStats(stats);
            } finally {
                setIsDataLoaded(true);
            }
        };

        fetchData();
    }, []);

    if (!isDataLoaded || isLoading) {
        return <FullPageSpinner />;
    }

    if (error) return <div>Error: {error}</div>;

    const editButton = (
        <Button
            $variant="primary"
            onClick={() => setShowEditModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
            <FiEdit size={18} />
            Editar Perfil
        </Button>
    );

    return (
        <ProfileContainer>
            <SectionHeader
                avatarUrl={userData?.avatarPath ? getImageUrl(userData.avatarPath) : '/default-avatar.png'}
                nik={userData?.nik}
                rightContent={editButton}
                onAvatarClick={handleAvatarClick}
            />
            <HiddenFileInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
            />

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

            {userStats && (
                <>
                    <SectionHeader title="Estadísticas de la colección" />
                    <StatsContainer>
                        <StatsGrid>
                            <StatItem>
                                <StatValue>{userStats.totalStats.totalGames}</StatValue>
                                <StatLabel>Total de Juegos</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatValue>{userStats.totalStats.ownedGames}</StatValue>
                                <StatLabel>Juegos en Propiedad</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatValue>{userStats.totalStats.wishedGames}</StatValue>
                                <StatLabel>Lista de Deseos</StatLabel>
                            </StatItem>
                        </StatsGrid>
                    </StatsContainer>

                    <GamesSection>
                        <SectionHeader title="Últimos juegos adquiridos" />
                        <GamesList>
                            {userStats.recentOwnedGames.map((game: any) => (
                                <StyledLink href={`/games/${game.id}`} key={game.id}>
                                    <GameCard>
                                        <GameImage
                                            src={getImageUrl(game.coverImage.path)}
                                            alt={game.title}
                                        />
                                        <GameTitle>{game.title}</GameTitle>
                                    </GameCard>
                                </StyledLink>
                            ))}
                        </GamesList>
                    </GamesSection>

                    <GamesSection>
                        <SectionHeader title="Deseados más recientes" />
                        <GamesList>
                            {userStats.recentWishedGames.map((game: any) => (
                                <StyledLink href={`/games/${game.id}`} key={game.id}>
                                    <GameCard>
                                        <GameImage
                                            src={getImageUrl(game.coverImage.path)}
                                            alt={game.title}
                                        />
                                        <GameTitle>{game.title}</GameTitle>
                                    </GameCard>
                                </StyledLink>
                            ))}
                        </GamesList>
                    </GamesSection>
                </>
            )}

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