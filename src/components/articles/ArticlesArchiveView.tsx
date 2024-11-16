'use client'

import { useEffect, useState } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/services/api';
import { Article } from '@/types/article';
import ArticlesGameSearch from './ArticlesGameSearch';
import {
    PageWrapper,
    ArticlesContainer,
    HomeArticlesList,
    HomeArticleCard,
    SectionDivider,
    ArticleDivider,
    PaginationContainer,
    PaginationButton,
    CoverImage,
    ArticleContent,
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

const ArchivedSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--background);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SearchBanner = styled.div`
    width: 100%;
    background-color: var(--app-yellow);
    padding: 1.5rem 2rem;
    margin: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 480px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

const SearchText = styled.h3`
    color: var(--dark-grey);
    font-size: 1.2rem;
    font-weight: 500;
    flex: 1;
    margin: 0;
    max-width: 50%;

    @media (max-width: 1100px) {
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        font-size: 1rem;
    }

    @media (max-width: 480px) {
        text-align: center;
        width: 100%;
        max-width: 100%;
    }
`;

const SearchContainer = styled.div`
    width: 50%;
    position: relative;

    @media (max-width: 480px) {
        width: 100%;
    }
`;

interface ArticlesArchiveViewProps {
    selectedGameId: string | null;
    selectedGameTitle: string;
    onGameChange: (gameId: string | null, gameTitle: string) => void;
}

export default function ArticlesArchiveView({
    selectedGameId,
    selectedGameTitle,
    onGameChange
}: ArticlesArchiveViewProps) {
    const { allArticles, loading, error, fetchAllArticles } = useArticles();
    const router = useRouter();

    useEffect(() => {
        fetchAllArticles(1, selectedGameId ? Number(selectedGameId) : undefined);
    }, [fetchAllArticles, selectedGameId]);

    const handleArticleClick = (id: number) => {
        router.push(`/articles/${id}`);
    };

    const handlePageChange = (page: number) => {
        fetchAllArticles(page, selectedGameId ? Number(selectedGameId) : undefined);
    };

    const getArticleImageUrl = (article: Article) => {
        return article?.coverImage?.path
            ? getImageUrl(article.coverImage.path)
            : '/uploads/resources/no-image.jpg';
    };

    if (loading) return <div>Cargando artículos...</div>;
    if (error) return <div>Error al cargar los artículos</div>;
    if (!allArticles) return null;

    const { topArticles, archivedArticles } = allArticles;
    const currentPage = archivedArticles.currentPage || 1;
    const totalPages = archivedArticles.totalPages || 1;

    return (
        <PageWrapper>
            <ArticlesContainer>
                <TopArticlesGrid>
                    {topArticles.map((article: Article, index: number) => (
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
                                    <TopArticleSubtitle>{article.subtitle}</TopArticleSubtitle>
                                </ArticleContent>
                            </CoverImage>
                        </TopArticleCard>
                    ))}
                </TopArticlesGrid>

                <SearchBanner>
                    <SearchWrapper>
                        <SearchText>
                            Descubre todas las curiosidades de tu juego favorito
                        </SearchText>
                        <SearchContainer>
                            <ArticlesGameSearch
                                onGameChange={onGameChange}
                                selectedGameId={selectedGameId}
                                selectedGameTitle={selectedGameTitle}
                            />
                        </SearchContainer>
                    </SearchWrapper>
                </SearchBanner>

                <ArchivedSection>
                    <SectionDivider>
                        <h2>{currentPage === 1 ? 'Lo último' : 'Archivo'}</h2>
                    </SectionDivider>

                    <HomeArticlesList>
                        {archivedArticles.data.map((article: Article, index: number) => (
                            <>
                                <HomeArticleCard key={article.id} onClick={() => handleArticleClick(article.id)}>
                                    <ArticleImage $imageUrl={getArticleImageUrl(article)} />
                                    <ArticleCardContent>
                                        <ArticleTitleWrapper>
                                            <ArticleCardTitle $xl>{article.title}</ArticleCardTitle>
                                            <ArticleCardSubtitle $xl>{article.subtitle}</ArticleCardSubtitle>
                                        </ArticleTitleWrapper>
                                        <ArticleMetadata $xl>{article.metadata}</ArticleMetadata>
                                    </ArticleCardContent>
                                </HomeArticleCard>
                                {index < archivedArticles.data.length - 1 && <ArticleDivider />}
                            </>
                        ))}
                    </HomeArticlesList>

                    <PaginationContainer>
                        <PaginationButton
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Más nuevos
                        </PaginationButton>
                        <PaginationButton
                            $variant="home"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            Portada
                        </PaginationButton>
                        <PaginationButton
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Más antiguos
                        </PaginationButton>
                    </PaginationContainer>
                </ArchivedSection>
            </ArticlesContainer>
        </PageWrapper>
    );
}