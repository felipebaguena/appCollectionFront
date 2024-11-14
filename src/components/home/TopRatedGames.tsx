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

  @media (max-width: 900px) {
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    margin-top: 0;
  }
`;

const TopRatedTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--dark-grey);
  white-space: nowrap;
  line-height: 1;
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  @media (max-width: 900px) {
    color: var(--clear-grey);
  }

  @media (max-width: 480px) {
    &::after {
        content: '';
        height: 1px;
        background-color: var(--clear-grey);
        flex-grow: 1;
    }
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
  font-size: 1rem;
  color: white;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;

  @media (max-width: 900px) {
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
  }
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  transition: all 0.2s ease;

  @media (max-width: 900px) {
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.7));
  }
`;

const RatingCount = styled.span`
  font-size: 0.8rem;
  color: var(--app-yellow);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;

  @media (max-width: 900px) {
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
  }
`;

const GameCard = styled.div`
  position: relative;
  height: 6.45rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    
    &::after {
      background: linear-gradient(to top, 
        rgba(255, 215, 0, 0.8), 
        rgba(255, 215, 0, 0.4)
      );
    }

    ${GameTitle} {
      color: var(--dark-grey);
      text-shadow: 0 2px 4px var(--app-yellow);
    }

    ${RatingCount} {
      color: var(--dark-grey);
      text-shadow: 0 2px 4px var(--app-yellow);
    }

    ${RatingWrapper} {
      filter: drop-shadow(0 2px 4px var(--app-yellow));
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
    transition: all 0.2s ease;

    @media (max-width: 900px) {
      background: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2));
    }
  }
`;

const StarContainer = styled.div`
  --star-color: var(--app-yellow);
  
  ${GameCard}:hover & {
    --star-color: var(--dark-grey);
  }
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
                            <StarContainer>
                                <StarRating
                                    value={game.averageRating}
                                    readOnly
                                    size={14}
                                />
                            </StarContainer>
                            <RatingCount>({game.totalRatings})</RatingCount>
                        </RatingWrapper>
                    </GameInfo>
                </GameCard>
            ))}
        </TopRatedContainer>
    );
};

export default TopRatedGames; 