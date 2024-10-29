"use client";

import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface Platform {
  id: number;
  name: string;
  code: string;
}

interface Genre {
  id: number;
  name: string;
  code: string;
}

interface Developer {
  id: number;
  name: string;
  code: string;
}

interface Game {
  id: number;
  title: string;
  releaseYear: number;
  description: string;
  coverId: number | null;
  images: {
    id: number;
    filename: string;
    path: string;
    isCover: boolean;
    gameId: number;
  }[];
  platforms: Platform[];
  genres: Genre[];
  developers: Developer[];
}

export const useGame = (id: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Game>(ENDPOINTS.GET_GAME(id));
      setGame(data);
      setError(null);
    } catch (error) {
      setError("Error al cargar los detalles del juego");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateGame = async (updatedGameData: Partial<Game>) => {
    setLoading(true);
    try {
      const updatedGame = await api.put<Game>(
        ENDPOINTS.SET_GAME(id),
        id,
        updatedGameData
      );
      setGame(updatedGame);
      setError(null);
      return updatedGame;
    } catch (error) {
      setError("Error al actualizar el juego");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async () => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_GAME(id), id);
      setGame(null);
      setError(null);
    } catch (error) {
      setError("Error al eliminar el juego");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    game,
    loading,
    error,
    fetchGame,
    updateGame,
    deleteGame,
  };
};
