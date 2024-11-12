import React, { useEffect } from 'react';
import { useArticleImages } from '@/hooks/useArticleImages';
import {
    TemplateContainer,
    MainContent,
    PageBackground,
    HeaderSection,
    Title,
    Subtitle,
    ContentContainer,
    Content,
    CoverImage,
    PreviewBanner
} from './TemplateElements';
import { splitContentIntoParagraphs, renderContentWithImages } from './templateUtils';
import { TemplateProps } from '@/types/articleTemplate';

const StandardTemplate: React.FC<TemplateProps> = ({
    title,
    subtitle,
    content,
    coverImageId,
    coverImagePath,
    contentImageIds,
    contentImagePaths,
    gameId,
    getImageUrl,
    isPreview = false,
    published = false,
    publishedAt = null,
    scheduledPublishAt = null,
    updatedAt = null
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

    const paragraphs = splitContentIntoParagraphs(content);
    const renderedContent = renderContentWithImages({
        paragraphs,
        contentImages,
        getImageUrl,
        imagePositions: [0, 2],
        published,
        publishedAt,
        scheduledPublishAt,
        updatedAt
    });

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
                            {renderedContent}
                        </Content>
                    </ContentContainer>
                </MainContent>
            </TemplateContainer>
        </>
    );
};

export default StandardTemplate; 