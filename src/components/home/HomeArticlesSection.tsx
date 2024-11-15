'use client'

import { useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/services/api';
import CRTScanlines from '@/components/ui/CRTScanlines';
import { BannerBackground } from '@/components/home/HomeElements';
import GenresList from '@/components/home/GenresList';
import TopRatedGames from '@/components/home/TopRatedGames';
import {
    ArticlesContainer,
    CoverArticleContainer,
    HomeCoverArticleContent,
    HomeCoverArticleTitle,
    HomeCoverArticleSubtitle,
    CoverImage,
    ArticleContent,
    HomeArticlesList,
    HomeArticleCard,
    HomeSectionDivider,
    ArticleImage,
    ArticleCardContent,
    ArticleTitleWrapper,
    ArticleCardTitle,
    ArticleCardSubtitle,
    ArticleMetadata,
    TopArticlesGrid,
    TopArticleCard,
    TopArticleTitle,
    TopArticleSubtitle
} from '@/components/articles/ArticlesElements';
import styled from 'styled-components';

const SectionWrapper = styled.div`
  width: 100%;
  background-color: var(--mid-grey);
  padding-bottom: 4rem;
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
    margin-left: 1rem;
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
                {homeArticles.coverArticle && (
                    <CoverArticleContainer onClick={() => handleArticleClick(homeArticles.coverArticle.id)}>
                        <CRTScanlines />
                        <BannerBackground
                            imageUrl={getArticleImageUrl(homeArticles.coverArticle)}
                            oldTvEffect="vibrant"
                        />
                        <HomeCoverArticleContent>
                            <HomeCoverArticleTitle>{homeArticles.coverArticle.title}</HomeCoverArticleTitle>
                            <HomeCoverArticleSubtitle>{homeArticles.coverArticle.subtitle}</HomeCoverArticleSubtitle>
                        </HomeCoverArticleContent>
                    </CoverArticleContainer>
                )}

                <TopArticlesGrid>
                    {homeArticles.topArticles.map((article, index) => (
                        <TopArticleCard
                            key={article.id}
                            onClick={() => handleArticleClick(article.id)}
                            $isFirst={index === 0}
                        >
                            <CoverImage $imageUrl={getArticleImageUrl(article)}>
                                <ArticleContent>
                                    <TopArticleTitle $isFirst={index === 0}>
                                        {article.title}
                                    </TopArticleTitle>
                                    <TopArticleSubtitle>
                                        {article.subtitle}
                                    </TopArticleSubtitle>
                                </ArticleContent>
                            </CoverImage>
                        </TopArticleCard>
                    ))}
                </TopArticlesGrid>

                <ContentWrapper>
                    <MainContent>
                        <HomeSectionDivider>
                            <h2>Lo último</h2>
                        </HomeSectionDivider>

                        <HomeArticlesList>
                            {homeArticles.homeArticles.map((article) => (
                                <HomeArticleCard key={article.id} onClick={() => handleArticleClick(article.id)}>
                                    <ArticleImage $imageUrl={getArticleImageUrl(article)} />
                                    <ArticleCardContent>
                                        <ArticleTitleWrapper>
                                            <ArticleCardTitle>{article.title}</ArticleCardTitle>
                                            <ArticleCardSubtitle>{article.subtitle}</ArticleCardSubtitle>
                                        </ArticleTitleWrapper>
                                        <ArticleMetadata>
                                            {[
                                                article.relatedGames?.[0]?.title,
                                                article.relatedPlatforms?.map(p => p.name).join(', '),
                                                article.relatedDevelopers?.map(d => d.name).join(', '),
                                                article.relatedGenres?.map(g => g.name).join(', ')
                                            ].filter(Boolean).join(' - ')}
                                        </ArticleMetadata>
                                    </ArticleCardContent>
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