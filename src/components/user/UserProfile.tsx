'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiEdit } from 'react-icons/fi';
import Modal from '@/components/ui/Modal';
import UserProfileModal from '@/components/user/UserProfileModal';
import { getImageUrl } from '@/services/api';
import { useUserActions } from '@/hooks/useUserActions';
import FullPageSpinner from '@/components/ui/FullPageSpinner';
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
    StyledLink,
    GameCard,
    GameImage,
    GameTitle,
    EditButtonText,
    EditButtonWrapper,
    UserData,
} from './UserProfileElements';
import YearlyStatsChart from '../stats/YearlyStatsChart';


const UserProfile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userStats, setUserStats] = useState<any>(null);
    const [yearlyStats, setYearlyStats] = useState<any>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const {
        getUser,
        getUserStats,
        updateAvatar,
        getUserYearGames,
        isLoading,
        error
    } = useUserActions();
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
                const [user, stats, yearStats] = await Promise.all([
                    getUser(),
                    getUserStats(),
                    getUserYearGames()
                ]);
                if (user) setUserData(user);
                if (stats) setUserStats(stats);
                if (yearStats) setYearlyStats(yearStats);
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
        <EditButtonWrapper
            $variant="primary"
            onClick={() => setShowEditModal(true)}
        >
            <FiEdit size={18} />
            <EditButtonText>Editar Perfil</EditButtonText>
        </EditButtonWrapper>
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
                            {userStats.favoritePlatform && (
                                <StatItem>
                                    <StatValue>{userStats.favoritePlatform.gamesCount}</StatValue>
                                    <StatLabel>
                                        Plataforma Favorita
                                        <br />
                                        {userStats.favoritePlatform.name}
                                    </StatLabel>
                                </StatItem>
                            )}
                            {userStats.favoriteGenre && (
                                <StatItem>
                                    <StatValue>{userStats.favoriteGenre.gamesCount}</StatValue>
                                    <StatLabel>
                                        Género Favorito
                                        <br />
                                        {userStats.favoriteGenre.name}
                                    </StatLabel>
                                </StatItem>
                            )}
                            {userStats.favoriteDeveloper && (
                                <StatItem>
                                    <StatValue>{userStats.favoriteDeveloper.gamesCount}</StatValue>
                                    <StatLabel>
                                        Desarrollador Favorito
                                        <br />
                                        {userStats.favoriteDeveloper.name}
                                    </StatLabel>
                                </StatItem>
                            )}
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

            {yearlyStats && (
                <GamesSection>
                    <SectionHeader title="Estadísticas anuales" />
                    <YearlyStatsChart data={yearlyStats.months} />
                </GamesSection>
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