import { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatform = useCallback(async () => {
    try {
      const data = await api.get<Platform>(ENDPOINTS.GET_PLATFORM(id));
      setPlatform(data);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los detalles de la plataforma");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlatform();
  }, [fetchPlatform]);

  const updatePlatform = async (updatedPlatformData: Partial<Platform>) => {
    setLoading(true);
    try {
      const updatedPlatform = await api.put<Platform>(
        ENDPOINTS.SET_PLATFORM(id),
        id,
        updatedPlatformData
      );
      setPlatform(updatedPlatform);
      setLoading(false);
      return updatedPlatform;
    } catch (error) {
      setError("Error al actualizar la plataforma");
      setLoading(false);
      throw error;
    }
  };

  const deletePlatform = async () => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_PLATFORM(id), id);
      setPlatform(null);
      setLoading(false);
    } catch (error) {
      setError("Error al eliminar la plataforma");
      setLoading(false);
      throw error;
    }
  };

  return {
    platform,
    loading,
    error,
    updatePlatform,
    deletePlatform,
    refetchPlatform: fetchPlatform,
  };
};
