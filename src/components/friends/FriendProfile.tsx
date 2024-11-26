'use client';

import React, { useState, useEffect } from 'react';
import { getImageUrl } from '@/services/api';
import { useUserActions } from '@/hooks/useUserActions';
import FullPageSpinner from '@/components/ui/FullPageSpinner';
import {
    SectionHeader,
    ProfileContainer,
    GamesList,
    GamesSection,
    StatsContainer,
    StatsGrid,
    StatItem,
    StatValue,
    StatLabel,
    StyledLink,
    GameCard,
    GameImage,
    GameTitle,
    StatHeader,
    StatIcon,
    FriendInfo,
    FriendInfoItem,
    FriendLabel,
    FriendValue,
} from '../user/UserProfileElements';
import YearlyStatsChart from '../stats/YearlyStatsChart';
import {
    IoGameController,
    IoLibrary,
    IoHeart,
    IoDesktop,
    IoGrid,
    IoBusinessSharp,
} from 'react-icons/io5';
import { USER_PROFILE_AVATAR } from '@/constants/ui';

interface FriendProfileProps {
    id: string;
}

const FriendProfile = ({ id }: FriendProfileProps) => {
    const [profileData, setProfileData] = useState<any>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const { getFriendProfile, isLoading, error } = useUserActions();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await getFriendProfile(id);
                if (profile) setProfileData(profile);
            } finally {
                setIsDataLoaded(true);
            }
        };

        fetchData();
    }, [id]);

    const formatDate = (dateString: string, includeTime: boolean = false) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            ...(includeTime && {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        return new Intl.DateTimeFormat('es-ES', options).format(date);
    };

    if (!isDataLoaded || isLoading) {
        return <FullPageSpinner />;
    }

    if (error) return <div>Error: {error}</div>;

    return (
        <ProfileContainer>
            <SectionHeader
                avatarUrl={profileData?.avatarPath ? getImageUrl(profileData.avatarPath) : USER_PROFILE_AVATAR}
                nik={profileData?.nik}
                isOnline={profileData?.isOnline}
            />

            <FriendInfo>
                <FriendInfoItem>
                    <FriendLabel>Amigos desde:</FriendLabel>
                    <FriendValue>
                        {profileData?.friendsSince ? formatDate(profileData.friendsSince) : 'No disponible'}
                    </FriendValue>
                </FriendInfoItem>
                {!profileData?.isOnline && profileData?.lastSeen && (
                    <FriendInfoItem>
                        <FriendLabel>Última conexión:</FriendLabel>
                        <FriendValue>
                            {formatDate(profileData.lastSeen, true)}
                        </FriendValue>
                    </FriendInfoItem>
                )}
            </FriendInfo>

            <SectionHeader title="Estadísticas de la colección" />
            <StatsContainer>
                <StatsGrid>
                    <StatItem>
                        <StatHeader>
                            <StatValue>{profileData?.profileStats.totalStats.totalGames}</StatValue>
                            <StatIcon>
                                <IoGameController size={24} />
                            </StatIcon>
                        </StatHeader>
                        <StatLabel>Total Registrados</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatHeader>
                            <StatValue>{profileData?.profileStats.totalStats.ownedGames}</StatValue>
                            <StatIcon>
                                <IoLibrary size={24} />
                            </StatIcon>
                        </StatHeader>
                        <StatLabel>En Propiedad</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatHeader>
                            <StatValue>{profileData?.profileStats.totalStats.wishedGames}</StatValue>
                            <StatIcon>
                                <IoHeart size={24} />
                            </StatIcon>
                        </StatHeader>
                        <StatLabel>Deseados</StatLabel>
                    </StatItem>
                    {profileData?.profileStats.favoritePlatform && (
                        <StatItem>
                            <StatHeader>
                                <StatValue>{profileData.profileStats.favoritePlatform.gamesCount}</StatValue>
                                <StatIcon>
                                    <IoDesktop size={24} />
                                </StatIcon>
                            </StatHeader>
                            <StatLabel>
                                Plataforma Favorita
                                <span>{profileData.profileStats.favoritePlatform.name}</span>
                            </StatLabel>
                        </StatItem>
                    )}
                    {profileData?.profileStats.favoriteGenre && (
                        <StatItem>
                            <StatHeader>
                                <StatValue>{profileData.profileStats.favoriteGenre.gamesCount}</StatValue>
                                <StatIcon>
                                    <IoGrid size={24} />
                                </StatIcon>
                            </StatHeader>
                            <StatLabel>
                                Género Favorito
                                <span>{profileData.profileStats.favoriteGenre.name}</span>
                            </StatLabel>
                        </StatItem>
                    )}
                    {profileData?.profileStats.favoriteDeveloper && (
                        <StatItem>
                            <StatHeader>
                                <StatValue>{profileData.profileStats.favoriteDeveloper.gamesCount}</StatValue>
                                <StatIcon>
                                    <IoBusinessSharp size={24} />
                                </StatIcon>
                            </StatHeader>
                            <StatLabel>
                                Desarrollador Favorito
                                <span>{profileData.profileStats.favoriteDeveloper.name}</span>
                            </StatLabel>
                        </StatItem>
                    )}
                </StatsGrid>
            </StatsContainer>

            {profileData?.yearlyStats && (
                <GamesSection>
                    <SectionHeader title="Estadísticas anuales" />
                    <YearlyStatsChart data={profileData.yearlyStats.months} />
                </GamesSection>
            )}

            <GamesSection>
                <SectionHeader title="Últimos juegos adquiridos" />
                <GamesList>
                    {profileData?.profileStats.recentOwnedGames.map((game: any) => (
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
                    {profileData?.profileStats.recentWishedGames.map((game: any) => (
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
        </ProfileContainer>
    );
};

export default FriendProfile; 