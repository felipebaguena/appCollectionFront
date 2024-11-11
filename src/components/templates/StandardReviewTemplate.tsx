import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useArticleImages } from '@/hooks/useArticleImages';
import { NAVBAR_HEIGHT } from '../layout/NavbarElements';

interface StandardReviewTemplateProps {
    title: string;
    subtitle: string;
    content: string;
    coverImageId?: number | null;
    coverImagePath?: string;
    contentImageIds?: number[];
    contentImagePaths?: string[];
    gameId?: number;
    getImageUrl: (path: string) => string;
    isPreview?: boolean;
}

const TemplateContainer = styled.article<{ backgroundImage: string }>`
    position: relative;
    max-width: 1200px;
    margin: 2rem auto;
    z-index: 1;
    padding-bottom: 4rem;
    margin-top: 4rem;
`;

const MainContent = styled.div`
    background: white;
    position: relative;
    z-index: 2;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PageBackground = styled.div<{ backgroundImage: string }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    pointer-events: none;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url(${props => props.backgroundImage});
        background-size: cover;
        background-position: center;
        filter: blur(8px);
        transform: scale(1.1);
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
    }
`;

const HeaderSection = styled.header`
display: flex;
flex-direction: column;
justify-content: flex-end;
align-items: center;
    position: relative;
    padding: 2rem 2rem 1rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
    z-index: 1;
`;

const Title = styled.h1`
    font-size: 3.5rem;
    color: white;
    margin-bottom: 1rem;
    font-weight: bold;
    position: relative;
    z-index: 3; // Por encima del overlay
`;

const Subtitle = styled.h2`
    font-size: 1.8rem;
    color: white;
    font-weight: 300;
    opacity: 0.9;
    position: relative;
    z-index: 3; // Por encima del overlay
`;

const ContentContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 0 2rem 4rem;
`;

const Paragraph = styled.p`
    max-width: 45rem;
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
`;

const Content = styled.div`
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--dark-grey);
`;

const ContentImage = styled.img`
    width: 100%;
    height: 400px;
    object-fit: cover;
    margin: 2rem 0;
`;

const CoverImage = styled.img`
    width: 100%;
    height: 400px;
    object-fit: cover;
    margin-bottom: 1.5rem;
`;

const PreviewBanner = styled.div`
    position: fixed;
    top: ${NAVBAR_HEIGHT};
    left: 0;
    right: 0;
    background: var(--app-yellow);
    color: var(--dark-grey);
    text-align: center;
    padding: 1rem;
    z-index: 1000;
    font-size: 1.2rem;
    font-weight: bold;
`;

const StandardReviewTemplate: React.FC<StandardReviewTemplateProps> = ({
    title,
    subtitle,
    content,
    coverImageId,
    coverImagePath,
    contentImageIds,
    contentImagePaths,
    gameId,
    getImageUrl,
    isPreview = false
}) => {
    const {
        gameArticleImages,
        loading,
        error,
        fetchGameArticleImages,
    } = useArticleImages(0, gameId || 0);

    useEffect(() => {
        if (gameId && contentImageIds) {
            fetchGameArticleImages();
        }
    }, [fetchGameArticleImages, gameId, contentImageIds]);

    if (loading) return <div>Cargando imágenes...</div>;
    if (error) return <div>Error: {error}</div>;

    let coverImageUrl = '';
    let contentImages: { path: string }[] = [];

    if (coverImagePath) {
        coverImageUrl = getImageUrl(coverImagePath);
    } else if (gameArticleImages.length > 0 && coverImageId) {
        const coverImage = gameArticleImages.find(img => img.id === coverImageId);
        coverImageUrl = coverImage ? getImageUrl(coverImage.path) : '';
    }

    if (contentImagePaths) {
        contentImages = contentImagePaths.map(path => ({ path }));
    } else if (gameArticleImages.length > 0 && contentImageIds) {
        contentImages = contentImageIds
            .map(id => gameArticleImages.find(img => img.id === id))
            .filter(img => img !== undefined) as { path: string }[];
    }

    // Dividir el contenido en párrafos y limpiar los saltos de línea
    const paragraphs = content
        .replace(/\\n\\n/g, '\n\n')
        .split('\n\n')
        .map(p => p.trim());

    // Función para renderizar el contenido con imágenes intercaladas
    const renderContent = () => {
        let allElements: JSX.Element[] = [];

        paragraphs.forEach((paragraph, index) => {
            if (paragraph) {
                allElements.push(
                    <Paragraph key={`p-${index}`}>
                        {paragraph}
                    </Paragraph>
                );
            }

            if (index === 0 && contentImages[0]) {
                allElements.push(
                    <ContentImage
                        key={`img-1`}
                        src={getImageUrl(contentImages[0].path)}
                        alt={`Imagen 1 del artículo`}
                    />
                );
            }

            if (index === 2 && contentImages[1]) {
                allElements.push(
                    <ContentImage
                        key={`img-2`}
                        src={getImageUrl(contentImages[1].path)}
                        alt={`Imagen 2 del artículo`}
                    />
                );
            }
        });

        return allElements;
    };

    return (
        <>
            {isPreview && <PreviewBanner>Vista Previa</PreviewBanner>}
            <PageBackground backgroundImage={coverImageUrl} />
            <TemplateContainer backgroundImage={coverImageUrl}>
                <HeaderSection>
                    <Title>{title}</Title>
                    <Subtitle>{subtitle}</Subtitle>
                </HeaderSection>
                <MainContent>
                    <CoverImage
                        src={coverImageUrl}
                        alt={title}
                    />
                    <ContentContainer>
                        <Content>
                            {renderContent()}
                        </Content>
                    </ContentContainer>
                </MainContent>
            </TemplateContainer>
        </>
    );
};

export default StandardReviewTemplate; 