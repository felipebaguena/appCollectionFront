import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FilterInput from '@/components/ui/FilterInput';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { IoHeart, IoAdd, IoArrowBack, IoTime } from 'react-icons/io5';
import { USER_PROFILE_AVATAR } from '@/constants/ui';

const SearchContainer = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const UsersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const UserItem = styled.div<{ $isClickable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  text-align: center;
  position: relative;
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  
  &:hover {
    ${props => props.$isClickable && `
      background-color: var(--dark-grey);
      border-radius: 8px;
    `}
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
`;

const UserAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UserNik = styled.span`
  font-size: 0.9rem;
  color: var(--text-color);
  word-break: break-word;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const StatusIcon = styled.div<{ $status: 'friend' | 'pending' | 'none' }>`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${props => {
        switch (props.$status) {
            case 'friend':
                return 'var(--app-yellow)';
            case 'pending':
                return 'var(--clear-grey)';
            default:
                return 'var(--dark-grey)';
        }
    }};
  border-radius: 50%;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  svg {
    color: ${props => {
        switch (props.$status) {
            case 'friend':
                return 'var(--dark-grey)';
            case 'pending':
                return 'var(--dark-grey)';
            default:
                return 'white';
        }
    }};
    width: 16px;
    height: 16px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  
  &:hover {
    color: var(--app-yellow);
  }
`;

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  margin: 1rem 0;
  background: var(--dark-grey);
  border: 1px solid var(--clear-grey);
  color: var(--text-color);
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
  }
`;

const Title = styled.h3`
  margin: 0;
  color: var(--text-color);
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

interface AddFriendsModalProps {
    onClose: () => void;
    initialUser?: any;
}

const AddFriendsModal: React.FC<AddFriendsModalProps> = ({ onClose, initialUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(initialUser || null);
    const [message, setMessage] = useState('¡Hola! Me gustaría que fuésemos amigos.');
    const { getBasicUsers, sendFriendRequest, isLoading } = useUserActions();

    useEffect(() => {
        if (initialUser) {
            setSelectedUser(initialUser);
        }
    }, [initialUser]);

    useEffect(() => {
        const searchUsers = async () => {
            const result = await getBasicUsers(searchTerm);
            if (result) {
                setUsers(result);
            }
        };

        searchUsers();
    }, [searchTerm]);

    const handleAddFriend = (user: any) => {
        setSelectedUser(user);
    };

    const handleBack = () => {
        setSelectedUser(null);
    };

    const handleSendRequest = async () => {
        if (selectedUser) {
            const success = await sendFriendRequest({
                nik: selectedUser.nik,
                message
            });
            if (success) {
                onClose();
            }
        }
    };

    if (selectedUser) {
        return (
            <div>
                <HeaderContainer>
                    <BackButton onClick={handleBack}>
                        <IoArrowBack size={24} />
                    </BackButton>
                    <Title>Añadir a {selectedUser.nik} a amigos</Title>
                </HeaderContainer>

                <MessageInput
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje para la solicitud..."
                />

                <ButtonsContainer>
                    <Button
                        type="button"
                        $variant="cancel"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        $variant="primary"
                        onClick={handleSendRequest}
                        disabled={isLoading}
                    >
                        Enviar solicitud
                    </Button>
                </ButtonsContainer>
            </div>
        );
    }

    return (
        <div>
            <SearchContainer>
                <FilterInput
                    label="Buscar por nik..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    fullWidth
                />
            </SearchContainer>

            <UsersList>
                {users.map(user => (
                    <UserItem
                        key={user.id}
                        $isClickable={!user.isFriend && !user.hasPendingFriendRequest}
                        onClick={() => !user.isFriend && !user.hasPendingFriendRequest && handleAddFriend(user)}
                    >
                        <AvatarContainer>
                            <UserAvatar
                                src={user.avatarPath ? getImageUrl(user.avatarPath) : USER_PROFILE_AVATAR}
                                alt={user.nik}
                            />
                            <StatusIcon
                                $status={
                                    user.isFriend
                                        ? 'friend'
                                        : user.hasPendingFriendRequest
                                            ? 'pending'
                                            : 'none'
                                }
                            >
                                {user.isFriend ? (
                                    <IoHeart />
                                ) : user.hasPendingFriendRequest ? (
                                    <IoTime />
                                ) : (
                                    <IoAdd />
                                )}
                            </StatusIcon>
                        </AvatarContainer>
                        <UserNik>{user.nik}</UserNik>
                    </UserItem>
                ))}
            </UsersList>

            <ButtonContainer>
                <Button
                    type="button"
                    $variant="cancel"
                    onClick={onClose}
                >
                    Cerrar
                </Button>
            </ButtonContainer>
        </div>
    );
};

export default AddFriendsModal; 