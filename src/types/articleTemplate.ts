export interface ArticleTemplate {
  id: number;
  name: string;
  code: TemplateCode;
  description: string;
  imageCount: number;
  isActive: boolean;
}

export enum TemplateCode {
  STANDARD_REVIEW = "STANDARD_REVIEW",
  // Add future templates here
  // COMPACT_REVIEW = 'COMPACT_REVIEW',
  // NEWS = 'NEWS',
}
