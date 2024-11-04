import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface UserGame {
  id: number;
  rating: number | null;
  status: number | null;
  complete: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  gameId: number;
}

interface UpdateUserGameBody {
  rating: number | null;
  status: number | null;
  complete: boolean;
  notes: string | null;
}

export const useUserGame = (gameId: number) => {
  const [userGame, setUserGame] = useState<UserGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGame = useCallback(async () => {
    if (!gameId) return;

    setLoading(true);
    try {
      const data = await api.get<UserGame>(
        ENDPOINTS.GET_USER_GAME_DETAILS(gameId.toString())
      );
      setUserGame(data);
      setError(null);
    } catch (error) {
      setError("Error al cargar los detalles del juego de la colección");
      setUserGame(null);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const updateUserGame = async (updatedData: UpdateUserGameBody) => {
    setLoading(true);
    try {
      const updatedUserGame = await api.put<UserGame>(
        ENDPOINTS.UPDATE_USER_GAME(gameId.toString()),
        gameId.toString(),
        updatedData
      );
      setUserGame(updatedUserGame);
      setError(null);
      return updatedUserGame;
    } catch (error) {
      setError("Error al actualizar el juego de la colección");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUserGame = async () => {
    setLoading(true);
    try {
      await api.delete(
        ENDPOINTS.DELETE_USER_GAME(gameId.toString()),
        gameId.toString()
      );
      setUserGame(null);
      setError(null);
    } catch (error) {
      setError("Error al eliminar el juego de la colección");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearUserGame = () => {
    setUserGame(null);
    setError(null);
  };

  return {
    userGame,
    loading,
    error,
    fetchUserGame,
    updateUserGame,
    deleteUserGame,
    clearUserGame,
  };
};
