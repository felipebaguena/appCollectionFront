'use client'

import { useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/services/api';
import CRTScanlines from '@/components/ui/CRTScanlines';
import { BannerBackground } from '@/components/home/HomeElements';

const ArticlesContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
`;

// Cover Article Styles
const CoverArticleContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 500px;
  position: relative;
  overflow: hidden;
  background-color: var(--grey);
  cursor: pointer;
  margin: 0 auto;
  
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
`;

const ArticleSubtitle = styled.h3`
  font-size: 1.2rem;
  opacity: 0.9;
`;

// Top Articles Styles
const TopArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
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
`;

const HomeArticleCard = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  background: var(--dark-grey);
  
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
`;

const HomeArticleContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HomeArticleTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const HomeArticleSubtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
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

            {/* Home Articles */}
            <HomeArticlesList>
                {homeArticles.homeArticles.map((article) => (
                    <HomeArticleCard key={article.id} onClick={() => handleArticleClick(article.id)}>
                        <HomeArticleImage $imageUrl={getArticleImageUrl(article)} />
                        <HomeArticleContent>
                            <HomeArticleTitle>{article.title}</HomeArticleTitle>
                            <HomeArticleSubtitle>{article.subtitle}</HomeArticleSubtitle>
                        </HomeArticleContent>
                    </HomeArticleCard>
                ))}
            </HomeArticlesList>
        </ArticlesContainer>
    );
} 