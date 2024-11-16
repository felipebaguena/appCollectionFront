import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const Banner = styled.div`
    width: 100%;
    background-color: var(--app-yellow);
    padding: 1rem 2rem;
    margin: 2rem 0;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #e6c200;
    }
`;

const BannerText = styled.h3`
    color: var(--dark-grey);
    font-size: 1.1rem;
    margin: 0;
`;

interface RelatedArticlesBannerProps {
    gameId: string;
    gameTitle: string;
}

const RelatedArticlesBanner: React.FC<RelatedArticlesBannerProps> = ({ gameId, gameTitle }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/articles/articles-home?gameId=${gameId}&gameTitle=${encodeURIComponent(gameTitle)}`);
    };

    return (
        <Banner onClick={handleClick}>
            <BannerText>
                Ver todos los artículos sobre {gameTitle}
            </BannerText>
        </Banner>
    );
};

export default RelatedArticlesBanner; 