import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FilterInput from '@/components/ui/FilterInput';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { Friend } from '@/types/friends';

const USER_PROFILE_AVATAR = "http://localhost:3000/uploads/front/user-image-placeholder.jpg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
`;

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  flex: 1;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
  background: var(--dark-grey);
  border-radius: 8px;

  &:hover {
    background: var(--mid-grey);
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const FriendName = styled.div`
  font-weight: 600;
  color: var(--text-color);
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
            <FilterInput
                label="Buscar amigo..."
                value={searchTerm}
                onChange={setSearchTerm}
                fullWidth
            />

            <FriendsList>
                {filteredFriends.map(friend => (
                    <FriendItem
                        key={friend.id}
                        onClick={() => onSelectFriend(friend)}
                    >
                        <Avatar
                            src={friend.avatarPath ? getImageUrl(friend.avatarPath) : USER_PROFILE_AVATAR}
                            alt={friend.nik}
                        />
                        <FriendName>{friend.nik}</FriendName>
                    </FriendItem>
                ))}
            </FriendsList>

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