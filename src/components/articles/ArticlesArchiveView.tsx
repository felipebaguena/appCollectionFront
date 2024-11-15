'use client'

import { useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
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
    ArticleMetadata
} from '@/components/articles/ArticlesElements';

const TopArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "main main"
      "secondary1 secondary2";
    gap: 1rem;
    
    & > :nth-child(1) {
      grid-area: main;
      height: 400px;
    }
    
    & > :nth-child(2) {
      grid-area: secondary1;
    }
    
    & > :nth-child(3) {
      grid-area: secondary2;
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "main"
      "secondary1"
      "secondary2";
    
    & > :first-child {
      height: 300px;
    }
  }
`;

const TopArticleCard = styled.div<{ $isFirst?: boolean }>`
  height: 300px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  @media (max-width: 900px) {
    height: ${props => props.$isFirst ? '400px' : '250px'};
  }
  
  @media (max-width: 480px) {
    height: ${props => props.$isFirst ? '300px' : '250px'};
  }
  
  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out;
  }
`;

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

const TopArticleTitle = styled.h2<{ $isFirst?: boolean }>`
  font-size: ${props => props.$isFirst ? '1.5rem' : '1.2rem'};
  margin-bottom: 0.3rem;
  font-weight: bold;
  line-height: 1.3;

  @media (max-width: 900px) {
    font-size: ${props => props.$isFirst ? '1.4rem' : '1.1rem'};
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    font-size: ${props => props.$isFirst ? '1.3rem' : '1rem'};
  }
`;

const TopArticleSubtitle = styled.h3`
  font-size: 0.9rem;
  opacity: 0.9;
  color: var(--clear-grey);

  @media (max-width: 900px) {
    display: none;
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