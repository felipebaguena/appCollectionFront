'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiEdit, FiUserPlus, FiUserCheck } from 'react-icons/fi';
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
    FriendsList,
    FriendItem,
    FriendAvatarContainer,
    FriendAvatar,
    FriendNik,
    EmptyFriendsMessage,
    EmptyFriendsIcon,
    FriendOnlineIndicator,
    CommentDate,
    CommentUserInfo,
    UserInfoText,
    CommentNik,
} from './UserProfileElements';
import YearlyStatsChart from '../stats/YearlyStatsChart';
import {
    IoGameController,
    IoLibrary,
    IoHeart,
    IoDesktop,
    IoGrid,
    IoBusinessSharp
} from 'react-icons/io5';
import AddFriendsModal from './AddFriendsModal';
import PendingRequestsModal from './PendingRequestsModal';
import styled from 'styled-components';
import FriendsListModal from './FriendsListModal';
import { MAX_FRIENDS_DISPLAY, USER_PROFILE_AVATAR } from '@/constants/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useArticleComments } from '@/hooks/useArticleComments';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import {
    RequestButtonWrapper,
    ButtonsContainer,
    FriendsCount,
    FriendsTitle,
    CommentsList,
    CommentsHeader,
    HeaderColumn,
    CommentItem,
    CommentContent,
    ArticleTitle,
} from './UserProfileElements';
import PaginationGrid from '../ui/PaginationGrid';


interface Friend {
    id: number;
    name: string;
    nik: string;
    avatarPath?: string;
    isOnline: boolean;
    lastSeen?: string;
}

interface FriendRequestSender {
    id: number;
    name: string;
    nik: string;
    avatarPath?: string;
}

interface FriendRequest {
    id: number;
    sender: FriendRequestSender;
    message: string;
    createdAt: string;
}

const EmptyCommentsMessage = styled(EmptyFriendsMessage)``;

const UserProfile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [userStats, setUserStats] = useState<any>(null);
    const [yearlyStats, setYearlyStats] = useState<any>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [showAddFriendsModal, setShowAddFriendsModal] = useState(false);
    const [showPendingRequestsModal, setShowPendingRequestsModal] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [showFriendsListModal, setShowFriendsListModal] = useState(false);
    const [replies, setReplies] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {
        getUser,
        getUserStats,
        updateAvatar,
        getUserYearGames,
        getUserFriends,
        isLoading,
        error,
        getFriendRequests,
    } = useUserActions();
    const { updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { getCommentsReplies } = useArticleComments();

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
                    updateUser(updatedUser);
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
                if (userFriends) setFriends(userFriends as Friend[]);
            } finally {
                setIsDataLoaded(true);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            const requests = await getFriendRequests();
            if (requests) {
                setPendingRequests(requests);
            }
        };

        fetchPendingRequests();
    }, []);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const data = await getCommentsReplies(currentPage);
                if (data) {
                    setReplies(data);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error('Error al cargar las respuestas:', error);
            }
        };

        fetchReplies();
    }, [currentPage]);

    const updateFriendsList = async () => {
        const userFriends = await getUserFriends();
        if (userFriends) {
            setFriends(userFriends as Friend[]);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                isOnline={userData?.isOnline}
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
                        <SectionHeader
                            title={
                                <FriendsTitle onClick={() => setShowFriendsListModal(true)}>
                                    <span>Amigos</span>
                                    <FriendsCount>({friends.length})</FriendsCount>
                                </FriendsTitle>
                            }
                            rightContent={
                                <ButtonsContainer>
                                    <RequestButtonWrapper
                                        $variant="primary"
                                        $hasPendingRequests={pendingRequests.length > 0}
                                        onClick={() => setShowPendingRequestsModal(true)}
                                    >
                                        <FiUserCheck size={18} />
                                        <EditButtonText>
                                            {pendingRequests.length > 0
                                                ? `Solicitudes (${pendingRequests.length})`
                                                : 'Solicitudes'}
                                        </EditButtonText>
                                    </RequestButtonWrapper>
                                    <EditButtonWrapper
                                        $variant="primary"
                                        onClick={() => setShowAddFriendsModal(true)}
                                    >
                                        <FiUserPlus size={18} />
                                        <EditButtonText>Añadir Amigos</EditButtonText>
                                    </EditButtonWrapper>
                                </ButtonsContainer>
                            }
                        />
                        <FriendsList>
                            {friends.length > 0 ? (
                                <>
                                    {friends.slice(0, MAX_FRIENDS_DISPLAY).map((friend) => (
                                        <StyledLink href={`/friends/${friend.id}`} key={friend.id}>
                                            <FriendItem>
                                                <FriendAvatarContainer>
                                                    <FriendAvatar
                                                        src={friend.avatarPath ? getImageUrl(friend.avatarPath) : USER_PROFILE_AVATAR}
                                                        alt={friend.nik}
                                                    />
                                                    <FriendOnlineIndicator $isOnline={friend.isOnline} />
                                                </FriendAvatarContainer>
                                                <FriendNik>{friend.nik}</FriendNik>
                                            </FriendItem>
                                        </StyledLink>
                                    ))}
                                    {friends.length > MAX_FRIENDS_DISPLAY && (
                                        <FriendItem
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setShowFriendsListModal(true)}
                                        >
                                            <FriendAvatarContainer>
                                                <FriendAvatar
                                                    src={USER_PROFILE_AVATAR}
                                                    alt="Ver más"
                                                />
                                                <FriendOnlineIndicator $isOnline={false} />
                                            </FriendAvatarContainer>
                                            <FriendNik>Ver más</FriendNik>
                                        </FriendItem>
                                    )}
                                </>
                            ) : (
                                <EmptyFriendsMessage>
                                    <EmptyFriendsIcon size={24} />
                                    <p>No hay amigos añadidos</p>
                                </EmptyFriendsMessage>
                            )}
                        </FriendsList>
                    </GamesSection>

                    <GamesSection>
                        <SectionHeader title="Comentarios" />
                        <CommentsList>
                            <CommentsHeader>
                                <HeaderColumn>Te responde</HeaderColumn>
                                <HeaderColumn>Comentario</HeaderColumn>
                                <HeaderColumn>Artículo</HeaderColumn>
                            </CommentsHeader>

                            {replies && replies.replies.length > 0 ? (
                                <>
                                    {replies.replies.map((reply: any) => (
                                        <CommentItem key={reply.id}>
                                            <CommentUserInfo>
                                                <FriendAvatarContainer>
                                                    <FriendAvatar
                                                        src={reply.user.avatarPath ? getImageUrl(reply.user.avatarPath) : USER_PROFILE_AVATAR}
                                                        alt={reply.user.nik}
                                                    />
                                                </FriendAvatarContainer>
                                                <UserInfoText>
                                                    <CommentNik>{reply.user.nik}</CommentNik>
                                                    <CommentDate>
                                                        {new Date(reply.createdAt).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: '2-digit'
                                                        })}
                                                    </CommentDate>
                                                </UserInfoText>
                                            </CommentUserInfo>
                                            <CommentContent>
                                                {reply.content}
                                            </CommentContent>
                                            <ArticleTitle>
                                                {replies.article.title}
                                            </ArticleTitle>
                                        </CommentItem>
                                    ))}
                                    <PaginationGrid
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        noPadding
                                    />
                                </>
                            ) : (
                                <EmptyCommentsMessage>
                                    <IoChatbubbleEllipses size={24} />
                                    <p>No hay respuestas a tus comentarios</p>
                                </EmptyCommentsMessage>
                            )}
                        </CommentsList>
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

            <Modal
                isOpen={showAddFriendsModal}
                onClose={() => setShowAddFriendsModal(false)}
                title="Añadir Amigos"
            >
                <AddFriendsModal onClose={() => setShowAddFriendsModal(false)} />
            </Modal>

            <Modal
                isOpen={showPendingRequestsModal}
                onClose={() => setShowPendingRequestsModal(false)}
                title="Solicitudes de amistad pendientes"
            >
                <PendingRequestsModal
                    requests={pendingRequests}
                    onClose={() => setShowPendingRequestsModal(false)}
                    onRequestsUpdate={setPendingRequests}
                    onFriendAccepted={updateFriendsList}
                />
            </Modal>

            <Modal
                isOpen={showFriendsListModal}
                onClose={() => setShowFriendsListModal(false)}
                title={`Amigos (${friends.length})`}
            >
                <FriendsListModal
                    friends={friends}
                    onClose={() => setShowFriendsListModal(false)}
                />
            </Modal>
        </ProfileContainer>
    );
};

export default UserProfile; 