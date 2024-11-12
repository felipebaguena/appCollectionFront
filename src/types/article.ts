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
  createdAt: string;
  publishedAt: string | null;
  updatedAt: string | null;
  published: boolean;
  scheduledPublishAt: string | null;
  coverImageId?: number;
  templateId: number;
  coverImage?: ArticleImage;
  contentImages: ArticleImage[];
  template: ArticleTemplate;
  relatedGames?: Game[];
  relatedPlatforms?: Platform[];
  relatedDevelopers?: Developer[];
  relatedGenres?: Genre[];
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
