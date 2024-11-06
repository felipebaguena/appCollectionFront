import styled from 'styled-components';
import { UserGameInCollection } from '@/types/collection';
import CollectionCard from './CollectionCard';
import Pagination from '../ui/Pagination';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1.5rem;
  justify-content: flex-start;
`;

const CardWrapper = styled.div`
  flex: 0 0 auto;
  width: calc(33.333% - 1.334rem);
  min-width: 280px;

  @media (max-width: 1200px) {
    width: calc(50% - 1rem);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PaginationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

const NoGamesMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--clear-grey);
`;

interface MyCollectionGridProps {
    games: UserGameInCollection[];
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
}

const MyCollectionGrid: React.FC<MyCollectionGridProps> = ({
    games,
    totalItems,
    currentPage,
    onPageChange,
    itemsPerPage
}) => {
    if (games.length === 0) {
        return <NoGamesMessage>No hay juegos en tu colección</NoGamesMessage>;
    }

    return (
        <Container>
            <FlexContainer>
                {games.map(game => (
                    <CardWrapper key={game.id}>
                        <CollectionCard game={game} />
                    </CardWrapper>
                ))}
            </FlexContainer>
            <PaginationWrapper>
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={onPageChange}
                />
            </PaginationWrapper>
        </Container>
    );
};

export default MyCollectionGrid;