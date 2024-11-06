import { useState } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { MyCollectionSortType, CompleteStatus } from "@/types/collection";

interface CollectionFilters {
  search?: string;
  platformIds?: number[];
  genreIds?: number[];
  developerIds?: number[];
  yearRange?: {
    start: number | null;
    end: number | null;
  } | null;
  complete?: CompleteStatus;
  ratingRange?: {
    start: number;
    end: number;
  };
  statusRange?: {
    start: number;
    end: number;
  };
  addedAtRange?: {
    start: string | null;
    end: string | null;
  };
}

interface CollectionParams {
  page: number;
  limit: number;
  sortType: MyCollectionSortType;
}

interface GetCollectionParams {
  collection: CollectionParams;
  filter: CollectionFilters;
}

interface CoverImage {
  id: number;
  path: string;
}

interface Platform {
  id: number;
  name: string;
}

interface GameInCollection {
  id: number;
  title: string;
  coverImage?: CoverImage;
}

interface UserGameInCollection {
  id: number;
  game: GameInCollection;
  platforms: Platform[];
  rating: number;
  status: number;
  complete: boolean;
  notes: string;
  addedAt: string;
}

interface CollectionResponse {
  data: UserGameInCollection[];
  totalItems: number;
  totalPages: number;
}

export const useUserCollection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserCollection = async (
    params: GetCollectionParams
  ): Promise<CollectionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<CollectionResponse>(
        ENDPOINTS.GET_USER_GAMES_COLLECTION,
        params,
        true
      );

      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(
        error instanceof Error
          ? error.message
          : "Error al obtener la colección de juegos"
      );
      throw error;
    }
  };

  return {
    getUserCollection,
    isLoading,
    error,
  };
};
