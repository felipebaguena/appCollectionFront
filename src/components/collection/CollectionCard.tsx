import styled from 'styled-components';
import { UserGameInCollection } from '@/types/collection';
import { API_BASE_URL } from '@/services/api';
import StarRating from '../ui/StarRating';
import { formatDate } from '@/helpers/dateFormatter';
import { MdDelete, MdEdit, MdFavorite } from 'react-icons/md';


const Card = styled.div`
  background: var(--dark-grey);
  width: 100%;
  height: 30rem;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    .icons-container {
      opacity: 1;
    }
  }
`;

const IconsContainer = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'wishlist' }>`
  background-color: ${props => {
    switch (props.$variant) {
      case 'edit':
        return 'var(--app-yellow)';
      case 'delete':
        return 'var(--app-red)';
      case 'wishlist':
        return 'var(--app-red)';
      default:
        return 'var(--app-red)';
    }
  }};
  width: 2rem;
  height: 2rem;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$variant === 'edit' ? 'var(--dark-grey)' : 'white'};

  @media (max-width: 464px) {
    width: 1.5rem;
    height: 1.5rem;
  }

  svg {
    font-size: 1.2rem;

    @media (max-width: 464px) {
      font-size: 1rem;
    }
  }
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

const AddToCollectionLabel = styled.div`
  background: var(--app-yellow);
  color: var(--dark-grey);
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 0.9rem;
  margin: 1rem 0;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

interface CollectionCardProps {
  game: UserGameInCollection;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onAddToCollection?: (e: React.MouseEvent) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  game,
  onEdit,
  onDelete,
  onAddToCollection
}) => {
  const getGameImageUrl = (game: UserGameInCollection) => {
    return game.game.coverImage
      ? `${API_BASE_URL}/${game.game.coverImage.path}`
      : `${API_BASE_URL}/uploads/resources/no-image.jpg`;
  };

  const rating = typeof game.rating === 'string'
    ? parseFloat(game.rating)
    : game.rating || 0;

  const isWishlist = game.wished && !game.owned;

  return (
    <Card>
      <IconsContainer className="icons-container">
        {isWishlist ? (
          <ActionButton
            $variant="wishlist"
            onClick={e => {
              e.stopPropagation();
              onDelete?.(e);
            }}
          >
            <MdFavorite />
          </ActionButton>
        ) : (
          <>
            {onEdit && (
              <ActionButton
                $variant="edit"
                onClick={e => {
                  e.stopPropagation();
                  onEdit(e);
                }}
              >
                <MdEdit />
              </ActionButton>
            )}
            {onDelete && (
              <ActionButton
                $variant="delete"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(e);
                }}
              >
                <MdDelete />
              </ActionButton>
            )}
          </>
        )}
      </IconsContainer>
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
            {!isWishlist && (
              <StarRating
                value={rating}
                readOnly
                size={16}
              />
            )}
          </TopContent>
          <BottomContent>
            <Details>
              {!isWishlist ? (
                <>
                  <div>Estado: {game.status}/10</div>
                  <div>{game.complete ? 'Completo' : 'Incompleto'}</div>
                  <PlatformList>
                    {game.platforms.map(platform => (
                      <PlatformTag key={platform.id}>{platform.name}</PlatformTag>
                    ))}
                  </PlatformList>
                </>
              ) : (
                <AddToCollectionLabel onClick={(e) => onAddToCollection?.(e)}>
                  Añadir a la colección
                </AddToCollectionLabel>
              )}
              <div>Añadido: {formatDate(game.addedAt)}</div>
            </Details>
          </BottomContent>
        </InfoContent>
      </GameInfo>
    </Card>
  );
};

export default CollectionCard; 