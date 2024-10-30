import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface Platform {
  id: number;
  name: string;
  code: string;
}

export const usePlatforms = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlatforms = useCallback(async () => {
    try {
      const platformsData = await api.get<Platform[]>(ENDPOINTS.GET_PLATFORMS);
      setPlatforms(platformsData);
    } catch (error) {
      setError("Error al cargar las plataformas");
    }
  }, []);

  const searchPlatforms = useCallback(async (search: string) => {
    try {
      const platformsData = await api.get<Platform[]>(
        ENDPOINTS.GET_PLATFORMS_MULTISELECT(search)
      );
      return platformsData;
    } catch (error) {
      setError("Error al buscar plataformas");
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchPlatforms();
      } catch (error) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchPlatforms]);

  const createPlatform = async (platformData: Omit<Platform, "id">) => {
    try {
      await api.post(ENDPOINTS.CREATE_PLATFORM, platformData);
      await fetchPlatforms();
    } catch (error) {
      throw new Error("Error al crear la plataforma");
    }
  };

  return {
    platforms,
    loading,
    error,
    createPlatform,
    fetchPlatforms,
    searchPlatforms,
  };
};
