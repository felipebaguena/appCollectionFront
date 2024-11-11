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
  path: string;
}

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  template: ArticleTemplate;
  relatedGames: Game[];
  relatedPlatforms: Platform[];
  relatedGenres: Genre[];
  relatedDevelopers: Developer[];
  coverImage: ArticleImage | null;
  contentImages: ArticleImage[];
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
