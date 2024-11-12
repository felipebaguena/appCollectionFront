import React from "react";
import { Paragraph, ContentImage } from "./TemplateElements";

interface ArticleImage {
  path: string;
}

interface ContentProps {
  paragraphs: string[];
  contentImages: ArticleImage[];
  getImageUrl: (path: string) => string;
  imagePositions?: number[];
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
}: ContentProps): JSX.Element[] => {
  const allElements: JSX.Element[] = [];

  // Primero añadimos todos los párrafos
  paragraphs.forEach((paragraph, index) => {
    if (paragraph) {
      allElements.push(<Paragraph key={`p-${index}`}>{paragraph}</Paragraph>);

      // Después de añadir el párrafo, verificamos si debemos insertar una imagen
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
