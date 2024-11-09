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
  updatedAt: string;
  publishedAt?: string;
  publishedStatus: PublishedStatus;
  platformIds: number[];
  genreIds: number[];
  developerIds: number[];
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
