"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface Game {
  id: number;
  title: string;
  releaseYear: number;
  description: string;
  coverId: number | null;
  images: { id: number; path: string; isCover: boolean }[];
}

export const useGame = (id: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await api.get<Game>(ENDPOINTS.GET_GAME(id));
        setGame(data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los detalles del juego");
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  return { game, loading, error };
};
