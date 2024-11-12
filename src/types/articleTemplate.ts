import StandardTemplate from "@/components/templates/StandardTemplate";
import ShortTemplate from "@/components/templates/ShortTemplate";

export enum TemplateCode {
  STANDARD_TEMPLATE = "STANDARD_TEMPLATE",
  SHORT_ARTICLE = "SHORT_ARTICLE",
}

export const templateComponents = {
  [TemplateCode.STANDARD_TEMPLATE]: StandardTemplate,
  [TemplateCode.SHORT_ARTICLE]: ShortTemplate,
} as const;

export interface ArticleTemplate {
  id: number;
  name: string;
  code: TemplateCode;
  description: string;
  isActive: boolean;
  imageCount: number;
}
