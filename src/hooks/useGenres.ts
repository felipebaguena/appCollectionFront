import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Genre } from "@/types/genre";

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = useCallback(async () => {
    try {
      const genresData = await api.get<Genre[]>(ENDPOINTS.GET_GENRES);
      setGenres(genresData);
    } catch (error) {
      setError("Error al cargar los géneros");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchGenres();
      } catch (error) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchGenres]);

  const createGenre = async (genreData: Omit<Genre, "id">) => {
    try {
      await api.post(ENDPOINTS.CREATE_GENRE, genreData);
      await fetchGenres();
    } catch (error) {
      throw new Error("Error al crear el género");
    }
  };

  return {
    genres,
    loading,
    error,
    createGenre,
    fetchGenres,
  };
};
