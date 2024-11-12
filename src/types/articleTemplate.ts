import StandardTemplate from "@/components/templates/StandardTemplate";
// Importar futuros templates aquí

export enum TemplateCode {
  STANDARD_TEMPLATE = "STANDARD_TEMPLATE",
  // Añadir futuros templates aquí
}

export const templateComponents = {
  [TemplateCode.STANDARD_TEMPLATE]: StandardTemplate,
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
