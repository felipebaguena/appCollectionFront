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
    StatHeader,
    StatIcon,
    FriendsSection,
    FriendsList,
    FriendItem,
    FriendAvatar,
    FriendNik,
    EmptyFriendsMessage,
    EmptyFriendsIcon,
} from './UserProfileElements';
import YearlyStatsChart from '../stats/YearlyStatsChart';
import {
    IoGameController,
    IoLibrary,
    IoHeart,
    IoDesktop,
    IoGrid,
    IoBusinessSharp,
    IoPeople
} from 'react-icons/io5';

interface Friend {
    id: number;
    name: string;
    nik: string;
    avatarPath?: string;
}

const USER_PROFILE_AVATAR = "http://localhost:3000/uploads/front/user-image-placeholder.jpg";

const UserProfile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userStats, setUserStats] = useState<any>(null);
    const [yearlyStats, setYearlyStats] = useState<any>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const {
        getUser,
        getUserStats,
        updateAvatar,
        getUserYearGames,
        getUserFriends,
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
                const [user, stats, yearStats, userFriends] = await Promise.all([
                    getUser(),
                    getUserStats(),
                    getUserYearGames(),
                    getUserFriends()
                ]);
                if (user) setUserData(user);
                if (stats) setUserStats(stats);
                if (yearStats) setYearlyStats(yearStats);
                if (userFriends) setFriends(userFriends);
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
                avatarUrl={userData?.avatarPath ? getImageUrl(userData.avatarPath) : USER_PROFILE_AVATAR}
                nik={userData?.nik}
                rightContent={editButton}
                onAvatarClick={handleAvatarClick}
                isEditable={true}
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
                    <GamesSection>
                        <SectionHeader title="Amigos" />
                        <FriendsList>
                            {friends.length > 0 ? (
                                friends.map((friend) => (
                                    <StyledLink href={`/friends/${friend.id}`} key={friend.id}>
                                        <FriendItem>
                                            <FriendAvatar
                                                src={friend.avatarPath ? getImageUrl(friend.avatarPath) : USER_PROFILE_AVATAR}
                                                alt={friend.nik}
                                            />
                                            <FriendNik>{friend.nik}</FriendNik>
                                        </FriendItem>
                                    </StyledLink>
                                ))
                            ) : (
                                <EmptyFriendsMessage>
                                    <EmptyFriendsIcon size={24} />
                                    <p>No hay amigos añadidos</p>
                                </EmptyFriendsMessage>
                            )}
                        </FriendsList>
                    </GamesSection>

                    <SectionHeader title="Estadísticas de la colección" />
                    <StatsContainer>
                        <StatsGrid>
                            <StatItem>
                                <StatHeader>
                                    <StatValue>{userStats.totalStats.totalGames}</StatValue>
                                    <StatIcon>
                                        <IoGameController size={24} />
                                    </StatIcon>
                                </StatHeader>
                                <StatLabel>Total Registrados</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatHeader>
                                    <StatValue>{userStats.totalStats.ownedGames}</StatValue>
                                    <StatIcon>
                                        <IoLibrary size={24} />
                                    </StatIcon>
                                </StatHeader>
                                <StatLabel>En Propiedad</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatHeader>
                                    <StatValue>{userStats.totalStats.wishedGames}</StatValue>
                                    <StatIcon>
                                        <IoHeart size={24} />
                                    </StatIcon>
                                </StatHeader>
                                <StatLabel>Deseados</StatLabel>
                            </StatItem>
                            {userStats.favoritePlatform && (
                                <StatItem>
                                    <StatHeader>
                                        <StatValue>{userStats.favoritePlatform.gamesCount}</StatValue>
                                        <StatIcon>
                                            <IoDesktop size={24} />
                                        </StatIcon>
                                    </StatHeader>
                                    <StatLabel>
                                        Plataforma Favorita
                                        <span>{userStats.favoritePlatform.name}</span>
                                    </StatLabel>
                                </StatItem>
                            )}
                            {userStats.favoriteGenre && (
                                <StatItem>
                                    <StatHeader>
                                        <StatValue>{userStats.favoriteGenre.gamesCount}</StatValue>
                                        <StatIcon>
                                            <IoGrid size={24} />
                                        </StatIcon>
                                    </StatHeader>
                                    <StatLabel>
                                        Género Favorito
                                        <span>{userStats.favoriteGenre.name}</span>
                                    </StatLabel>
                                </StatItem>
                            )}
                            {userStats.favoriteDeveloper && (
                                <StatItem>
                                    <StatHeader>
                                        <StatValue>{userStats.favoriteDeveloper.gamesCount}</StatValue>
                                        <StatIcon>
                                            <IoBusinessSharp size={24} />
                                        </StatIcon>
                                    </StatHeader>
                                    <StatLabel>
                                        Desarrollador Favorito
                                        <span>{userStats.favoriteDeveloper.name}</span>
                                    </StatLabel>
                                </StatItem>
                            )}
                        </StatsGrid>
                    </StatsContainer>

                    {yearlyStats && (
                        <GamesSection>
                            <SectionHeader title="Estadísticas anuales" />
                            <YearlyStatsChart data={yearlyStats.months} />
                        </GamesSection>
                    )}

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