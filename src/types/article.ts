import { Game } from "./game";
import { Platform } from "./platform";
import { Genre } from "./genre";
import { Developer } from "./developer";
import { ArticleTemplate } from "./articleTemplate";

export enum PublishedStatus {
  ALL = "ALL",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
}

export interface ArticleImage {
  id: number;
  filename: string;
  path: string;
  articleId: number;
  gameId: number;
  isCover: boolean;
}

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  template: ArticleTemplate;
  relatedGames: Game[];
  relatedPlatforms: Platform[];
  relatedGenres: Genre[];
  relatedDevelopers: Developer[];
  coverImage: {
    id: number;
    path: string;
  } | null;
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
