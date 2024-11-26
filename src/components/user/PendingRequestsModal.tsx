import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import { useUserActions } from '@/hooks/useUserActions';
import { getImageUrl } from '@/services/api';
import { FriendRequest } from '@/types/friends';

const USER_PROFILE_AVATAR = "http://localhost:3000/uploads/front/user-image-placeholder.jpg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: var(--text-secondary);
  margin: 2rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const RequestItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--dark-grey);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const Message = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

interface PendingRequestsModalProps {
    requests: FriendRequest[];
    onClose: () => void;
    onRequestsUpdate: (requests: FriendRequest[]) => void;
    onFriendAccepted: () => void;
}

const PendingRequestsModal: React.FC<PendingRequestsModalProps> = ({
    requests,
    onClose,
    onRequestsUpdate,
    onFriendAccepted
}) => {
    const { answerFriendRequest } = useUserActions();

    const handleAnswer = async (requestId: number, accept: boolean) => {
        const success = await answerFriendRequest(requestId, accept);
        if (success) {
            onRequestsUpdate(requests.filter(req => req.id !== requestId));
            if (accept) {
                onFriendAccepted();
            }
        }
    };

    return (
        <Container>
            <RequestsList>
                {requests.length === 0 ? (
                    <EmptyMessage>No hay solicitudes pendientes</EmptyMessage>
                ) : (
                    requests.map(request => (
                        <RequestItem key={request.id}>
                            <UserAvatar
                                src={request.sender.avatarPath
                                    ? getImageUrl(request.sender.avatarPath)
                                    : USER_PROFILE_AVATAR}
                                alt={request.sender.nik}
                            />
                            <UserInfo>
                                <UserName>{request.sender.nik}</UserName>
                                <Message>{request.message}</Message>
                            </UserInfo>
                            <ButtonsContainer>
                                <Button
                                    type="button"
                                    $variant="cancel"
                                    onClick={() => handleAnswer(request.id, false)}
                                >
                                    Rechazar
                                </Button>
                                <Button
                                    type="button"
                                    $variant="primary"
                                    onClick={() => handleAnswer(request.id, true)}
                                >
                                    Aceptar
                                </Button>
                            </ButtonsContainer>
                        </RequestItem>
                    ))
                )}
            </RequestsList>

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

export default PendingRequestsModal; 