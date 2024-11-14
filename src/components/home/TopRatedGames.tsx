import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import { useEffect } from 'react';
import { getImageUrl } from '@/services/api';
import StarRating from '@/components/ui/StarRating';

const TopRatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 2rem;
`;

const TopRatedTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--clear-grey);
  white-space: nowrap;
  line-height: 1;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  &::after {
    content: '';
    height: 1px;
    background-color: var(--clear-grey);
    flex-grow: 1;
  }
`;

const GameCard = styled.div`
  position: relative;
  height: 120px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    
    &::after {
      background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5));
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
    transition: background 0.2s ease;
  }
`;

const GameImage = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
`;

const GameInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.8rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const GameTitle = styled.h4`
  font-size: 0.9rem;
  color: var(--white);
  margin: 0;
  line-height: 1.2;
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RatingCount = styled.span`
  font-size: 0.8rem;
  color: var(--app-yellow);
`;

const TopRatedGames = () => {
    const router = useRouter();
    const { topRatedGames, loading, error, fetchTopRatedGames } = useGames();

    useEffect(() => {
        fetchTopRatedGames();
    }, [fetchTopRatedGames]);

    const handleGameClick = (gameId: number) => {
        router.push(`/games/${gameId}`);
    };

    if (loading) return <div>Cargando juegos...</div>;
    if (error) return <div>Error al cargar los juegos</div>;

    return (
        <TopRatedContainer>
            <TopRatedTitle>Mejor valorados</TopRatedTitle>
            {topRatedGames.map((game) => (
                <GameCard
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                >
                    <GameImage
                        $imageUrl={game.coverImage ? getImageUrl(game.coverImage.path) : '/uploads/resources/no-image.jpg'}
                    />
                    <GameInfo>
                        <GameTitle>{game.title}</GameTitle>
                        <RatingWrapper>
                            <StarRating
                                value={game.averageRating}
                                readOnly
                                size={14}
                            />
                            <RatingCount>({game.totalRatings})</RatingCount>
                        </RatingWrapper>
                    </GameInfo>
                </GameCard>
            ))}
        </TopRatedContainer>
    );
};

export default TopRatedGames; 