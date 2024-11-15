'use client'

import { useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { getImageUrl } from '@/services/api';
import { Article } from '@/types/article';

const ArticlesContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

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
  padding: 1rem;
  color: white;
  z-index: 2;
`;

const ArticleTitle = styled.h2<{ $isFirst?: boolean }>`
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

const ArticleSubtitle = styled.h3`
  font-size: 0.9rem;
  opacity: 0.9;
  color: var(--clear-grey);

  @media (max-width: 900px) {
    display: none;
  }
`;

const HomeArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
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

const HomeArticleContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
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

const HomeArticleTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--dark-grey);

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

const HomeArticleMetadata = styled.p`
  font-size: 0.8rem;
  color: var(--grey);
  margin-top: auto;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
`;

const PaginationButton = styled.button<{ $variant?: 'home' }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$variant === 'home' ? 'var(--dark-grey)' : 'var(--app-yellow)'};
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: ${props => props.$variant === 'home' ? 'white' : 'var(--dark-grey)'};
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SectionDivider = styled.div`
  width: 100%;
  margin: 0 0 2rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--dark-grey);
    white-space: nowrap;
    line-height: 1;
    margin-bottom: -2px;
  }

  &::after {
    content: '';
    height: 1px;
    background-color: var(--grey);
    flex-grow: 1;
  }
`;

const ArticleDivider = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    height: 1px;
    background-color: var(--grey);
    flex-grow: 1;
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  background-color: var(--mid-grey);
  min-height: 100vh;
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
                                    <ArticleTitle $isFirst={index === 0}>
                                        {article.title}
                                    </ArticleTitle>
                                    <ArticleSubtitle>{article.subtitle}</ArticleSubtitle>
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
                                    <HomeArticleImage $imageUrl={getArticleImageUrl(article)} />
                                    <HomeArticleContent>
                                        <HomeArticleTitleWrapper>
                                            <HomeArticleTitle>{article.title}</HomeArticleTitle>
                                            <HomeArticleSubtitle>{article.subtitle}</HomeArticleSubtitle>
                                        </HomeArticleTitleWrapper>
                                        <HomeArticleMetadata>{article.metadata}</HomeArticleMetadata>
                                    </HomeArticleContent>
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