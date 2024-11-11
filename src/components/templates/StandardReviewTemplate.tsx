import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useArticleImages } from '@/hooks/useArticleImages';

interface StandardReviewTemplateProps {
    title: string;
    subtitle: string;
    content: string;
    coverImageId: number | null;
    contentImageIds: number[];
    gameId: number;
    getImageUrl: (path: string) => string;
}

const TemplateContainer = styled.article`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
`;

const CoverImage = styled.img`
    width: 100%;
    height: 400px;
    object-fit: cover;
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: var(--dark-grey);
    margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
    font-size: 1.5rem;
    color: var(--medium-grey);
    margin-bottom: 2rem;
`;

const Content = styled.div`
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--dark-grey);
`;

const ContentImagesContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
`;

const ContentImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const StandardReviewTemplate: React.FC<StandardReviewTemplateProps> = ({
    title,
    subtitle,
    content,
    coverImageId,
    contentImageIds,
    gameId,
    getImageUrl
}) => {
    const {
        gameArticleImages,
        loading,
        error,
        fetchGameArticleImages,
    } = useArticleImages(0, gameId);

    useEffect(() => {
        fetchGameArticleImages();
    }, [fetchGameArticleImages]);

    if (loading) return <div>Cargando imágenes...</div>;
    if (error) return <div>Error: {error}</div>;

    const coverImage = gameArticleImages.find(img => img.id === coverImageId);
    const contentImages = contentImageIds
        .map(id => gameArticleImages.find(img => img.id === id))
        .filter(img => img !== undefined);

    return (
        <TemplateContainer>
            <CoverImage
                src={coverImage ? getImageUrl(coverImage.path) : ''}
                alt={title}
            />
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
            <Content>
                {content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </Content>
            <ContentImagesContainer>
                {contentImages.map((image, index) => (
                    <ContentImage
                        key={index}
                        src={getImageUrl(image.path)}
                        alt={`Imagen ${index + 1} del artículo`}
                    />
                ))}
            </ContentImagesContainer>
        </TemplateContainer>
    );
};

export default StandardReviewTemplate; 