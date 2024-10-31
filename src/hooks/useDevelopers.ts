import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Developer } from "@/types/developer";

export const useDevelopers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevelopers = useCallback(async () => {
    try {
      const developersData = await api.get<Developer[]>(
        ENDPOINTS.GET_DEVELOPERS
      );
      setDevelopers(developersData);
    } catch (error) {
      setError("Error al cargar los desarrolladores");
    }
  }, []);

  const searchDevelopers = useCallback(async (search: string) => {
    try {
      const developersData = await api.get<Developer[]>(
        ENDPOINTS.GET_DEVELOPERS_MULTISELECT(search)
      );
      return developersData;
    } catch (error) {
      setError("Error al buscar desarrolladores");
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchDevelopers();
      } catch (error) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDevelopers]);

  const createDeveloper = async (developerData: Omit<Developer, "id">) => {
    try {
      await api.post(ENDPOINTS.CREATE_DEVELOPER, developerData);
      await fetchDevelopers();
    } catch (error) {
      throw new Error("Error al crear el desarrollador");
    }
  };

  return {
    developers,
    loading,
    error,
    createDeveloper,
    fetchDevelopers,
    searchDevelopers,
  };
};
