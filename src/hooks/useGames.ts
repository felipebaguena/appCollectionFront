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
}

interface Genre {
  id: number;
  name: string;
}

interface Platform {
  id: number;
  name: string;
}

interface Developer {
  id: number;
  name: string;
}

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      const gamesData = await api.get<Game[]>(ENDPOINTS.GET_GAMES_HOME);
      setGames(gamesData);
    } catch (error) {
      setError("Error al cargar los juegos");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const gamesData = await api.get<Game[]>(ENDPOINTS.GET_GAMES_HOME);
        const genresData = await api.get<Genre[]>(ENDPOINTS.GET_GENRES);
        const platformsData = await api.get<Platform[]>(
          ENDPOINTS.GET_PLATFORMS
        );
        const developersData = await api.get<Developer[]>(
          ENDPOINTS.GET_DEVELOPERS
        );

        setGames(gamesData);
        setGenres(genresData.map((g) => ({ ...g, code: g.id.toString() })));
        setPlatforms(
          platformsData.map((p) => ({ ...p, code: p.id.toString() }))
        );
        setDevelopers(
          developersData.map((d) => ({ ...d, code: d.id.toString() }))
        );
      } catch (error) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createGame = async (
    gameData: Omit<Game, "id" | "coverId" | "images">
  ) => {
    try {
      await api.post(ENDPOINTS.CREATE_GAME, gameData);
      await fetchGames();
    } catch (error) {
      throw new Error("Error al crear el juego");
    }
  };

  return {
    games,
    genres,
    platforms,
    developers,
    loading,
    error,
    createGame,
    // ... (otras funciones que puedas tener)
  };
};
