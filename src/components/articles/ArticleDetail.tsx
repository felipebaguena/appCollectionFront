'use client';
import React, { useEffect } from 'react';
import { useArticle } from '@/hooks/useArticle';
import { getImageUrl } from '@/services/api';
import { TemplateCode, templateComponents } from '@/types/articleTemplate';

interface ArticleDetailProps {
    id: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ id }) => {
    const { article, loading, error, fetchArticle } = useArticle(id);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    if (loading) return <div>Cargando artículo...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!article) return <div>No se encontró el artículo</div>;

    const TemplateComponent = templateComponents[article.template.code as TemplateCode] || templateComponents[TemplateCode.STANDARD_TEMPLATE];

    const commonProps = {
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        coverImagePath: article.coverImage?.path,
        contentImagePaths: article.contentImages.map(img => img.path),
        getImageUrl: getImageUrl,
        isPreview: !article.published,
        published: article.published,
        publishedAt: article.publishedAt,
        scheduledPublishAt: article.scheduledPublishAt
    };

    return <TemplateComponent {...commonProps} />;
};

export default ArticleDetail; 