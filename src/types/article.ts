export enum PublishedStatus {
  ALL = "ALL",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
}

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  createdAt: string;
  publishedAt: string | null;
  published: boolean;
  coverImageId: number | null;
  templateId: number;
  relatedPlatforms: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  relatedGenres: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  relatedDevelopers: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  relatedGames: Array<{
    id: number;
    title: string;
    releaseYear: number;
    description: string;
    coverId: number;
  }>;
  template: {
    id: number;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
    imageCount: number;
  };
}

export interface ArticleDateRange {
  start: string | null;
  end: string | null;
}

export interface ArticleFilters {
  search?: string;
  platformIds?: number[];
  genreIds?: number[];
  developerIds?: number[];
  creationDateRange?: ArticleDateRange;
  publishedDateRange?: ArticleDateRange;
  publishedStatus?: PublishedStatus;
}
