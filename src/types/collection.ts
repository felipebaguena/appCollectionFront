import { SortType } from "@/hooks/useCollectionGames";

export enum MyCollectionSortType {
  TITLE_ASC = "TITLE_ASC",
  TITLE_DESC = "TITLE_DESC",
  YEAR_ASC = "YEAR_ASC",
  YEAR_DESC = "YEAR_DESC",
  RATING_ASC = "RATING_ASC",
  RATING_DESC = "RATING_DESC",
  STATUS_ASC = "STATUS_ASC",
  STATUS_DESC = "STATUS_DESC",
  ADDED_ASC = "ADDED_ASC",
  ADDED_DESC = "ADDED_DESC",
}

export enum CompleteStatus {
  COMPLETE = "COMPLETE",
  INCOMPLETE = "INCOMPLETE",
  ALL = "ALL",
}

export interface CoverImage {
  id: number;
  path: string;
}

export interface Platform {
  id: number;
  name: string;
}

export interface GameInCollection {
  id: number;
  title: string;
  coverImage?: CoverImage;
}

export interface UserGameInCollection {
  id: number;
  game: GameInCollection;
  platforms: Platform[];
  rating: number;
  status: number;
  complete: boolean;
  notes: string;
  addedAt: string;
}

export interface CollectionResponse {
  data: UserGameInCollection[];
  totalItems: number;
  totalPages: number;
}

export interface CollectionGridProps {
  selectedPlatformIds: number[];
  selectedGenreIds: number[];
  selectedDeveloperIds: number[];
  searchTerm: string;
  yearRange: { start: number | null; end: number | null } | null;
  sortType: SortType;
  collectionStatus: "ALL" | "IN_COLLECTION" | "NOT_IN_COLLECTION";
  isCompactView?: boolean;
}
