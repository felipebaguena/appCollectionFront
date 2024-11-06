import styled from 'styled-components';
import { UserGameInCollection } from '@/types/collection';
import { API_BASE_URL } from '@/services/api';
import StarRating from '../ui/StarRating';
import { formatDate } from '@/helpers/dateFormatter';
import { MdDelete, MdEdit } from 'react-icons/md';

const Card = styled.div`
  background: var(--dark-grey);
  overflow: visible;
  transition: transform 0.2s;
  cursor: pointer;
  width: 100%;
  height: 30rem;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-5px);

    .icons-container {
      opacity: 1;
    }
  }
`;

const IconsContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translateY(5px);
`;

const ActionIcon = styled.div<{ $variant?: 'edit' | 'delete' }>`
  background-color: ${props => props.$variant === 'edit' ? 'var(--app-yellow)' : 'var(--app-red)'};
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50%;
  overflow: hidden;
`;

const GameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const GameInfo = styled.div`
  height: 50%;
  padding: 1rem;
`;

const InfoContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h3`
  color: var(--app-yellow);
  margin: 0;
  font-size: 1.1rem;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--clear-grey);
  font-size: 0.9rem;
`;

const PlatformList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PlatformTag = styled.span`
  background: var(--app-yellow);
  color: var(--dark-grey);
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
`;

interface CollectionCardProps {
    game: UserGameInCollection;
    onEdit?: (e: React.MouseEvent) => void;
    onDelete?: (e: React.MouseEvent) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
    game,
    onEdit,
    onDelete
}) => {
    const getGameImageUrl = (game: UserGameInCollection) => {
        return game.game.coverImage
            ? `${API_BASE_URL}/${game.game.coverImage.path}`
            : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
    };

    const rating = typeof game.rating === 'string'
        ? parseFloat(game.rating)
        : game.rating || 0;

    return (
        <Card>
            <ImageContainer>
                <IconsContainer className="icons-container">
                    <ActionIcon
                        $variant="edit"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit?.(e);
                        }}
                    >
                        <MdEdit />
                    </ActionIcon>
                    <ActionIcon
                        $variant="delete"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete?.(e);
                        }}
                    >
                        <MdDelete />
                    </ActionIcon>
                </IconsContainer>
                <GameImage
                    src={getGameImageUrl(game)}
                    alt={game.game.title}
                />
            </ImageContainer>
            <GameInfo>
                <InfoContent>
                    <TopContent>
                        <Title>{game.game.title}</Title>
                        <StarRating
                            value={rating}
                            readOnly
                            size={16}
                        />
                    </TopContent>
                    <BottomContent>
                        <Details>
                            <div>Estado: {game.status}/10</div>
                            <div>{game.complete ? 'Completo' : 'Incompleto'}</div>
                            <PlatformList>
                                {game.platforms.map(platform => (
                                    <PlatformTag key={platform.id}>{platform.name}</PlatformTag>
                                ))}
                            </PlatformList>
                            <div>Añadido: {formatDate(game.addedAt)}</div>
                        </Details>
                    </BottomContent>
                </InfoContent>
            </GameInfo>
        </Card>
    );
};

export default CollectionCard; 