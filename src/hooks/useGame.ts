"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface Game {
  id: number;
  title: string;
  releaseYear: number;
  description: string;
  coverId: number | null;
  images: { id: number; path: string; isCover: boolean }[];
  platforms?: number[];
  genres?: number[];
  developers?: number[];
}

export const useGame = (id: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    try {
      const data = await api.get<Game>(ENDPOINTS.GET_GAME(id));
      setGame(data);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los detalles del juego");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  const updateGame = async (updatedGameData: Partial<Game>) => {
    setLoading(true);
    try {
      const updatedGame = await api.put<Game>(
        ENDPOINTS.SET_GAME(id),
        id,
        updatedGameData
      );
      setGame(updatedGame);
      setLoading(false);
      return updatedGame;
    } catch (error) {
      setError("Error al actualizar el juego");
      setLoading(false);
      throw error;
    }
  };

  const deleteGame = async () => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_GAME(id), id);
      setGame(null);
      setLoading(false);
    } catch (error) {
      setError("Error al eliminar el juego");
      setLoading(false);
      throw error;
    }
  };

  return {
    game,
    loading,
    error,
    updateGame,
    deleteGame,
    refetchGame: fetchGame,
  };
};
