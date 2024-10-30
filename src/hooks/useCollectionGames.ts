import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

export type SortType = "TITLE_ASC" | "TITLE_DESC" | "YEAR_ASC" | "YEAR_DESC";

interface CollectionParams {
  page: number;
  limit: number;
  sortType: SortType;
}

export interface CollectionGame {
  id: number;
  title: string;
  coverImage: {
    id: number;
    path: string;
  } | null;
}

interface CollectionResponse {
  data: CollectionGame[];
  totalItems: number;
  totalPages: number;
}

export const useCollectionGames = () => {
  const [games, setGames] = useState<CollectionGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCollectionGames = useCallback(async (params: CollectionParams) => {
    setLoading(true);
    try {
      const response = await api.post<CollectionResponse>(
        ENDPOINTS.GET_GAMES_COLLECTION,
        {
          collection: params,
        },
        true
      );

      setGames(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError("Error al cargar la colección de juegos");
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    games,
    loading,
    error,
    totalPages,
    fetchCollectionGames,
  };
};
