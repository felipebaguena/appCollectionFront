import styled from 'styled-components';
import { UserGameInCollection } from '@/types/collection';
import { API_BASE_URL } from '@/services/api';
import { MdDelete, MdEdit, MdAdd, MdFavorite } from 'react-icons/md';

const Card = styled.div`
  background: var(--dark-grey);
  width: 12rem;
  height: 12rem;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:hover {
    .icons-container:not(.wishlist) {
      opacity: 1;
    }
  }

  @media (max-width: 464px) {
    width: 9rem;
    height: 9rem;
  }
`;

const IconsContainer = styled.div<{ $isWishlist?: boolean }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 2;
  opacity: ${props => props.$isWishlist ? 1 : 0};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'add' }>`
  background-color: ${props => {
    switch (props.$variant) {
      case 'edit':
        return 'var(--app-yellow)';
      case 'delete':
        return 'var(--app-red)';
      case 'add':
        return 'var(--dark-grey)';
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
  width: 100%;
  height: 9.6rem;
  overflow: hidden;

  @media (max-width: 464px) {
    height: 7.2rem;
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const Title = styled.h3`
  color: var(--app-yellow);
  margin: 0;
  padding: 0.5rem;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.4rem;
  width: 11rem;
  box-sizing: border-box;

  @media (max-width: 464px) {
    width: 8rem;
    height: 1.8rem;
    font-size: 0.7rem;
    padding: 0.3rem;
  }
`;

interface CompactCollectionCardProps {
  game: UserGameInCollection;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onAddToCollection?: (e: React.MouseEvent) => void;
}

const CompactCollectionCard: React.FC<CompactCollectionCardProps> = ({
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

  const isWishlist = game.wished && !game.owned;

  return (
    <Card>
      <IconsContainer className={`icons-container${isWishlist ? ' wishlist' : ''}`} $isWishlist={isWishlist}>
        {isWishlist ? (
          <>
            <ActionButton
              $variant="add"
              onClick={e => {
                e.stopPropagation();
                onAddToCollection?.(e);
              }}
            >
              <MdAdd />
            </ActionButton>
            {onDelete && (
              <ActionButton
                $variant="delete"
                onClick={e => {
                  e.stopPropagation();
                  onDelete(e);
                }}
              >
                <MdFavorite />
              </ActionButton>
            )}
          </>
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
      <Title>{game.game.title}</Title>
    </Card>
  );
};

export default CompactCollectionCard; 