import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FilterInput from '@/components/ui/FilterInput';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { IoHeart, IoAdd } from 'react-icons/io5';

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

const StatusIcon = styled.div<{ $isFriend: boolean }>`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: ${props => props.$isFriend ? 'var(--app-yellow)' : 'var(--dark-grey)'};
  border-radius: 50%;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  svg {
    color: ${props => props.$isFriend ? 'var(--dark-grey)' : 'white'};
    width: 16px;
    height: 16px;
  }
`;

const USER_PROFILE_AVATAR = "http://localhost:3000/uploads/front/user-image-placeholder.jpg";

interface AddFriendsModalProps {
    onClose: () => void;
}

const AddFriendsModal: React.FC<AddFriendsModalProps> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const { getBasicUsers, isLoading } = useUserActions();

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
        console.log('añadir amigo:', user.nik);
    };

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
                        $isClickable={!user.isFriend}
                        onClick={() => !user.isFriend && handleAddFriend(user)}
                    >
                        <AvatarContainer>
                            <UserAvatar
                                src={user.avatarPath ? getImageUrl(user.avatarPath) : USER_PROFILE_AVATAR}
                                alt={user.nik}
                            />
                            <StatusIcon $isFriend={user.isFriend}>
                                {user.isFriend ? <IoHeart /> : <IoAdd />}
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