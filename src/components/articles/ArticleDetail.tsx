'use client';
import React, { useEffect } from 'react';
import StandardReviewTemplate from '../templates/StandardReviewTemplate';
// Importar futuros templates aquí
// import CompactReviewTemplate from '../templates/CompactReviewTemplate';
// import NewsTemplate from '../templates/NewsTemplate';
import { useArticle } from '@/hooks/useArticle';
import { getImageUrl } from '@/services/api';
import { TemplateCode } from '@/types/articleTemplate';

interface ArticleDetailProps {
    id: string;
}

// Mapa de templates
const templateComponents = {
    [TemplateCode.STANDARD_REVIEW]: StandardReviewTemplate,
    // Añadir futuros templates aquí
    // [TemplateCode.COMPACT_REVIEW]: CompactReviewTemplate,
    // [TemplateCode.NEWS]: NewsTemplate,
};

const ArticleDetail: React.FC<ArticleDetailProps> = ({ id }) => {
    const { article, loading, error, fetchArticle } = useArticle(id);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    if (loading) return <div>Cargando artículo...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!article) return <div>No se encontró el artículo</div>;

    // Obtener el componente del template basado en el código
    const TemplateComponent = templateComponents[article.template.code] || StandardReviewTemplate;

    // Props comunes para todos los templates
    const commonProps = {
        title: article.title,
        subtitle: article.subtitle,
        content: article.content,
        coverImagePath: article.coverImage?.path,
        contentImagePaths: article.contentImages.map(img => img.path),
        getImageUrl: getImageUrl,
        isPreview: !article.published
    };

    return <TemplateComponent {...commonProps} />;
};

export default ArticleDetail; 