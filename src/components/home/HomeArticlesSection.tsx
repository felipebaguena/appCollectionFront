'use client'

import { useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/services/api';
import CRTScanlines from '@/components/ui/CRTScanlines';
import { BannerBackground } from '@/components/home/HomeElements';
import GenresList from '@/components/home/GenresList';
import TopRatedGames from '@/components/home/TopRatedGames';

const ArticlesContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
`;

// Cover Article Styles
const CoverArticleContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 35rem;
  position: relative;
  overflow: hidden;
  background-color: var(--grey);
  cursor: pointer;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    height: 30rem;
  }

  @media (max-width: 480px) {
    height: 20rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6) 60%, transparent);
    z-index: 1;
  }
  
  &:hover {
    transform: scale(1.01);
    transition: transform 0.2s ease-in-out;
  }
`;

// Mantenemos CoverImage para los artículos top
const CoverImage = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7) 60%, transparent);
  }
`;

const ArticleContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  color: white;
  z-index: 20;
`;

const ArticleTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const ArticleSubtitle = styled.h3`
  font-size: 1.2rem;
  opacity: 0.9;

    @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

// Top Articles Styles
const TopArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;

  @media (max-width: 1200px) {
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "full full"
      "half1 half2";
    
    & > :nth-child(1) {
      grid-area: full;
    }
    & > :nth-child(2) {
      grid-area: half1;
    }
    & > :nth-child(3) {
      grid-area: half2;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "full"
      "half1"
      "half2";
  }
`;

const TopArticleCard = styled.div`
  height: 300px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  ${ArticleContent} {
    padding: 1rem;
  }

  ${ArticleTitle} {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }

  ${ArticleSubtitle} {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out;
  }
`;

// Home Articles Styles
const HomeArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1200px) {
    padding: 0 1rem;
  }
`;

const HomeArticleCard = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  background: var(--background);
  
  @media (max-width: 768px) {
    height: 160px;
  }

  @media (max-width: 480px) {
    height: 120px;
  }
  
  &:hover {
    transform: scale(1.01);
    transition: transform 0.2s ease-in-out;
  }
`;

const HomeArticleImage = styled.div<{ $imageUrl: string }>`
  width: 300px;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;

  @media (max-width: 1200px) {
    width: 200px;
    height: 200px;
  }

  @media (max-width: 768px) {
    width: 160px;
    height: 160px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

const HomeArticleTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--dark-grey);

  @media (max-width: 1200px) {
    font-size: 1.3rem;
  }

  @media (max-width: 900px) {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
`;

const HomeArticleSubtitle = styled.p`
  font-size: 1rem;
  color: var(--mid-grey);

  @media (max-width: 768px) {
    display: none;
  }
`;

const HomeArticleContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const HomeArticleTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HomeArticleMeta = styled.p`
  font-size: 0.8rem;
  color: var(--grey);
  padding-bottom: 0.5rem;

  @media (max-width: 1024px) {
    display: none;
  }

  @media (max-width: 900px) {
    display: flex;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SectionWrapper = styled.div`
  width: 100%;
  background-color: var(--mid-grey);
  padding-bottom: 4rem;
`;

const SectionDivider = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--clear-grey);
    white-space: nowrap;
    line-height: 1;
    margin-bottom: -2px;
  }

  &::after {
    content: '';
    height: 1px;
    background-color: var(--clear-grey);
    flex-grow: 1;
  }

    @media (max-width: 1200px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SideContentWrapper = styled.div`
  margin-top: 4.4rem;

  @media (max-width: 900px) {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SideContent = styled.div<{ $hasTopMargin?: boolean }>`
  width: 22rem;
  padding: 1rem;
  background-color: var(--foreground);
  margin-left: 1rem;
  ${props => props.$hasTopMargin && `margin-top: 1.5rem;`}

  @media (max-width: 1200px) {
    width: 20rem;
    margin-right: 1rem;
    margin-left: 0;
  }

  @media (max-width: 1024px) {
    width: 18rem;
  }

  @media (max-width: 900px) {
    width: 100%;
    margin: ${props => props.$hasTopMargin ? '0 0 0 0' : '0'};
    padding: 0;
    background-color: transparent;
  }

  @media (max-width: 480px) {
    margin: ${props => props.$hasTopMargin ? '1rem 0 0 0' : '0'};
  }
`;

export default function HomeArticlesSection() {
    const { homeArticles, loading, error, fetchHomeArticles } = useArticles();
    const router = useRouter();

    useEffect(() => {
        fetchHomeArticles();
    }, [fetchHomeArticles]);

    const handleArticleClick = (id: number) => {
        router.push(`/articles/${id}`);
    };

    const getArticleImageUrl = (article: any) => {
        return article?.coverImage?.path
            ? getImageUrl(article.coverImage.path)
            : '/uploads/resources/no-image.jpg';
    };

    if (loading) return <div>Cargando artículos...</div>;
    if (error) return <div>Error al cargar los artículos</div>;
    if (!homeArticles) return null;

    return (
        <SectionWrapper>
            <ArticlesContainer>
                {/* Cover Article */}
                {homeArticles.coverArticle && (
                    <CoverArticleContainer onClick={() => handleArticleClick(homeArticles.coverArticle.id)}>
                        <BannerBackground
                            imageUrl={getArticleImageUrl(homeArticles.coverArticle)}
                            oldTvEffect="vibrant"
                        />
                        <CRTScanlines />
                        <ArticleContent>
                            <ArticleTitle>{homeArticles.coverArticle.title}</ArticleTitle>
                            <ArticleSubtitle>{homeArticles.coverArticle.subtitle}</ArticleSubtitle>
                        </ArticleContent>
                    </CoverArticleContainer>
                )}

                {/* Top Articles */}
                <TopArticlesGrid>
                    {homeArticles.topArticles.map((article) => (
                        <TopArticleCard key={article.id} onClick={() => handleArticleClick(article.id)}>
                            <CoverImage $imageUrl={getArticleImageUrl(article)}>
                                <ArticleContent>
                                    <ArticleTitle>{article.title}</ArticleTitle>
                                    <ArticleSubtitle>{article.subtitle}</ArticleSubtitle>
                                </ArticleContent>
                            </CoverImage>
                        </TopArticleCard>
                    ))}
                </TopArticlesGrid>

                <ContentWrapper>
                    <MainContent>
                        <SectionDivider>
                            <h2>Lo último</h2>
                        </SectionDivider>

                        {/* Home Articles */}
                        <HomeArticlesList>
                            {homeArticles.homeArticles.map((article) => (
                                <HomeArticleCard key={article.id} onClick={() => handleArticleClick(article.id)}>
                                    <HomeArticleImage $imageUrl={getArticleImageUrl(article)} />
                                    <HomeArticleContent>
                                        <HomeArticleTitleWrapper>
                                            <HomeArticleTitle>{article.title}</HomeArticleTitle>
                                            <HomeArticleSubtitle>{article.subtitle}</HomeArticleSubtitle>
                                        </HomeArticleTitleWrapper>
                                        <HomeArticleMeta>
                                            {[
                                                article.relatedGames?.[0]?.title,
                                                article.relatedPlatforms?.map(p => p.name).join(', '),
                                                article.relatedDevelopers?.map(d => d.name).join(', '),
                                                article.relatedGenres?.map(g => g.name).join(', ')
                                            ].filter(Boolean).join(' - ')}
                                        </HomeArticleMeta>
                                    </HomeArticleContent>
                                </HomeArticleCard>
                            ))}
                        </HomeArticlesList>
                    </MainContent>

                    <SideContentWrapper>
                        <SideContent>
                            <GenresList />
                        </SideContent>
                        <SideContent $hasTopMargin>
                            <TopRatedGames />
                        </SideContent>
                    </SideContentWrapper>
                </ContentWrapper>
            </ArticlesContainer>
        </SectionWrapper>
    );
} 