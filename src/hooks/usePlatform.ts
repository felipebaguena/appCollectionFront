import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

// Definir la interfaz Platform
interface Platform {
  id: number;
  name: string;
  code: string;
}

export const usePlatform = (id: string) => {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatform = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Platform>(ENDPOINTS.GET_PLATFORM(id));
      setPlatform(data);
      setError(null);
    } catch (error) {
      setError("Error al cargar los detalles de la plataforma");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updatePlatform = async (updatedPlatformData: Partial<Platform>) => {
    setLoading(true);
    try {
      const updatedPlatform = await api.put<Platform>(
        ENDPOINTS.SET_PLATFORM(id),
        id,
        updatedPlatformData
      );
      setPlatform(updatedPlatform);
      setError(null);
      return updatedPlatform;
    } catch (error) {
      setError("Error al actualizar la plataforma");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePlatform = async () => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_PLATFORM(id), id);
      setPlatform(null);
      setError(null);
    } catch (error) {
      setError("Error al eliminar la plataforma");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    platform,
    loading,
    error,
    fetchPlatform,
    updatePlatform,
    deletePlatform,
  };
};
