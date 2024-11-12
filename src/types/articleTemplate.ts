import StandardReviewTemplate from "@/components/templates/StandardReviewTemplate";
// Importar futuros templates aquí

export enum TemplateCode {
  STANDARD_REVIEW = "STANDARD_REVIEW",
  // Añadir futuros templates aquí
}

export const templateComponents = {
  [TemplateCode.STANDARD_REVIEW]: StandardReviewTemplate,
  // Añadir futuros templates aquí
} as const;

export interface ArticleTemplate {
  id: number;
  name: string;
  code: TemplateCode;
  description: string;
  isActive: boolean;
  imageCount: number;
}
