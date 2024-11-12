import React from "react";
import { Paragraph, ContentImage, PublishInfo } from "./TemplateElements";

interface ArticleImage {
  path: string;
}

interface ContentProps {
  paragraphs: string[];
  contentImages: ArticleImage[];
  getImageUrl: (path: string) => string;
  imagePositions?: number[];
  published?: boolean;
  publishedAt?: string | null;
  scheduledPublishAt?: string | null;
}

export const splitContentIntoParagraphs = (content: string): string[] => {
  return content
    .replace(/\\n\\n/g, "\n\n")
    .split("\n\n")
    .map((p) => p.trim());
};

export const renderContentWithImages = ({
  paragraphs,
  contentImages,
  getImageUrl,
  imagePositions = [0, 2],
  published = false,
  publishedAt = null,
  scheduledPublishAt = null
}: ContentProps): JSX.Element[] => {
  const allElements: JSX.Element[] = [];

  // Añadir primero la información de publicación
  allElements.push(
    <PublishInfo key="publish-info">
      {getPublishStatus(published, publishedAt, scheduledPublishAt)}
    </PublishInfo>
  );

  // Luego añadimos los párrafos y las imágenes
  paragraphs.forEach((paragraph, index) => {
    if (paragraph) {
      allElements.push(<Paragraph key={`p-${index}`}>{paragraph}</Paragraph>);

      if (imagePositions.includes(index) && contentImages[imagePositions.indexOf(index)]) {
        const imageIndex = imagePositions.indexOf(index);
        allElements.push(
          <ContentImage
            key={`img-${imageIndex + 1}`}
            src={getImageUrl(contentImages[imageIndex].path)}
            alt={`Imagen ${imageIndex + 1} del artículo`}
          />
        );
      }
    }
  });

  return allElements;
};

export const formatPublishDate = (date: string): string => {
  const publishDate = new Date(date);
  return publishDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getPublishStatus = (published: boolean, publishedAt: string | null, scheduledPublishAt: string | null): string => {
  if (published && publishedAt) {
    return `${formatPublishDate(publishedAt)}`;
  }
  if (scheduledPublishAt) {
    return `Programado para el ${formatPublishDate(scheduledPublishAt)}`;
  }
  return 'Sin publicar';
};
