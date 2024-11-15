'use client'

import { useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/services/api';
import { Article } from '@/types/article';
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

export default function ArticlesArchiveView() {
    const { allArticles, loading, error, fetchAllArticles } = useArticles();
    const router = useRouter();

    useEffect(() => {
        fetchAllArticles(1);
    }, [fetchAllArticles]);

    const handleArticleClick = (id: number) => {
        router.push(`/articles/${id}`);
    };

    const handlePageChange = (page: number) => {
        fetchAllArticles(page);
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