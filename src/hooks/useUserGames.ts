import { useState } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface AddGameToCollectionParams {
  gameId: number;
  rating?: number;
  status?: number;
  complete?: boolean;
  notes?: string;
}

export const useUserGames = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addGameToCollection = async (params: AddGameToCollectionParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No se encontró el token de acceso");
      }

      await api.post(ENDPOINTS.ADD_GAME_TO_COLLECTION, params, false, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al añadir el juego a la colección";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return {
    addGameToCollection,
    isLoading,
    error,
  };
};
