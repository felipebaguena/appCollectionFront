import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const TagsWrapper = styled.div`
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TagsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  background-color: white;
  margin: 0 auto 0;
  padding-bottom: 4rem;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 45rem;
  gap: 0.5rem;
  border-top: 1px solid var(--light-grey);
  padding: 2rem 1.5rem 0 1.5rem;
`;

const BaseTag = styled.span`
  background-color: var(--dark-grey);
  color: var(--white);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`;

const GameTag = styled(BaseTag)`
  cursor: pointer;
  
  &:hover {
    background-color: var(--app-yellow);
    color: var(--dark-grey);
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }
`;

interface ArticleTagsProps {
    relatedGames?: Array<{ id: number; title: string }>;
    relatedPlatforms?: Array<{ name: string }>;
    relatedDevelopers?: Array<{ name: string }>;
    relatedGenres?: Array<{ name: string }>;
}

const ArticleTags: React.FC<ArticleTagsProps> = ({
    relatedGames,
    relatedPlatforms,
    relatedDevelopers,
    relatedGenres
}) => {
    const router = useRouter();

    const handleGameClick = (gameId: number) => {
        router.push(`/games/${gameId}`);
    };

    return (
        <TagsWrapper>
            <TagsContainer>
                <TagsList>
                    {relatedGames?.map(game => (
                        <GameTag
                            key={`game-${game.id}`}
                            onClick={() => handleGameClick(game.id)}
                        >
                            {game.title}
                        </GameTag>
                    ))}
                    {relatedPlatforms?.map((platform, index) => (
                        <BaseTag key={`platform-${index}`}>
                            {platform.name}
                        </BaseTag>
                    ))}
                    {relatedDevelopers?.map((developer, index) => (
                        <BaseTag key={`developer-${index}`}>
                            {developer.name}
                        </BaseTag>
                    ))}
                    {relatedGenres?.map((genre, index) => (
                        <BaseTag key={`genre-${index}`}>
                            {genre.name}
                        </BaseTag>
                    ))}
                </TagsList>
            </TagsContainer>
        </TagsWrapper>
    );
};

export default ArticleTags;