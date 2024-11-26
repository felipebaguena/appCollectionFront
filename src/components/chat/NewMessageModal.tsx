import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FilterInput from '@/components/ui/FilterInput';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { Friend } from '@/types/friends';
import { USER_PROFILE_AVATAR } from '@/constants/ui';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
`;

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

const UserItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  text-align: center;
  position: relative;
  cursor: pointer;
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

interface NewMessageModalProps {
    onClose: () => void;
    onSelectFriend: (friend: Friend) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ onClose, onSelectFriend }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [friends, setFriends] = useState<Friend[]>([]);
    const { getUserFriends } = useUserActions();

    useEffect(() => {
        const fetchFriends = async () => {
            const result = await getUserFriends();
            if (result) {
                setFriends(result);
            }
        };
        fetchFriends();
    }, []);

    const filteredFriends = friends.filter(friend =>
        friend.nik.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <SearchContainer>
                <FilterInput
                    label="Buscar amigo..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    fullWidth
                />
            </SearchContainer>

            <UsersList>
                {filteredFriends.map(friend => (
                    <UserItem
                        key={friend.id}
                        onClick={() => onSelectFriend(friend)}
                    >
                        <AvatarContainer>
                            <UserAvatar
                                src={friend.avatarPath ? getImageUrl(friend.avatarPath) : USER_PROFILE_AVATAR}
                                alt={friend.nik}
                            />
                        </AvatarContainer>
                        <UserNik>{friend.nik}</UserNik>
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
        </Container>
    );
};

export default NewMessageModal; 