import styled from 'styled-components';
import { UserGameInCollection } from '@/types/collection';
import { API_BASE_URL } from '@/services/api';
import StarRating from '../ui/StarRating';
import { formatDate } from '@/helpers/dateFormatter';

const Card = styled.div`
  background: var(--dark-grey);
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  width: 100%;
  height: 30rem;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 23rem;
  overflow: hidden;
`;

const GameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const GameInfo = styled.div`
  height: 100%;
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
}

const CollectionCard: React.FC<CollectionCardProps> = ({ game }) => {
    const getGameImageUrl = (game: UserGameInCollection) => {
        return game.game.coverImage
            ? `${API_BASE_URL}/${game.game.coverImage.path}`
            : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
    };

    return (
        <Card>
            <ImageContainer>
                <GameImage
                    src={getGameImageUrl(game)}
                    alt={game.game.title}
                />
            </ImageContainer>
            <GameInfo>
                <InfoContent>
                    <TopContent>
                        <Title>{game.game.title}</Title>
                        <StarRating value={game.rating} readOnly size={16} />
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