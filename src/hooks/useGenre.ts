import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Genre } from "@/types/genre";

export const useGenre = (id: string) => {
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenre = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Genre>(ENDPOINTS.GET_GENRE(id));
      setGenre(data);
      setError(null);
    } catch (error) {
      setError("Error al cargar los detalles del género");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateGenre = async (updatedGenreData: Partial<Genre>) => {
    setLoading(true);
    try {
      const updatedGenre = await api.put<Genre>(
        ENDPOINTS.UPDATE_GENRE(id),
        id,
        updatedGenreData
      );
      setGenre(updatedGenre);
      setError(null);
      return updatedGenre;
    } catch (error) {
      setError("Error al actualizar el género");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGenre = async () => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_GENRE(id), id);
      setGenre(null);
      setError(null);
    } catch (error) {
      setError("Error al eliminar el género");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    genre,
    loading,
    error,
    fetchGenre,
    updateGenre,
    deleteGenre,
  };
};
