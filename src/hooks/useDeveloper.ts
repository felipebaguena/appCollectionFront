import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Developer } from "@/types/developer";

export const useDeveloper = (id: string) => {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeveloper = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Developer>(ENDPOINTS.GET_DEVELOPER(id));
      setDeveloper(data);
      setError(null);
    } catch (error) {
      setError("Error al cargar los detalles del desarrollador");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateDeveloper = async (updatedDeveloperData: Partial<Developer>) => {
    setLoading(true);
    try {
      const updatedDeveloper = await api.put<Developer>(
        ENDPOINTS.UPDATE_DEVELOPER(id),
        id,
        updatedDeveloperData
      );
      setDeveloper(updatedDeveloper);
      setError(null);
      return updatedDeveloper;
    } catch (error) {
      setError("Error al actualizar el desarrollador");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDeveloper = async () => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_DEVELOPER(id), id);
      setDeveloper(null);
      setError(null);
    } catch (error) {
      setError("Error al eliminar el desarrollador");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    developer,
    loading,
    error,
    fetchDeveloper,
    updateDeveloper,
    deleteDeveloper,
  };
};
