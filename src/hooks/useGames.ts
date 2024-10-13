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

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await api.get<Game[]>(ENDPOINTS.GET_GAMES_HOME);
        setGames(data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los juegos");
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return { games, loading, error };
};
