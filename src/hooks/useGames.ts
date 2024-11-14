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

interface TopRatedGame {
  id: number;
  title: string;
  averageRating: number;
  totalRatings: number;
  coverImage: {
    id: number;
    path: string;
  };
}

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [topRatedGames, setTopRatedGames] = useState<TopRatedGame[]>([]);
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

  const fetchTopRatedGames = useCallback(async () => {
    try {
      const topRatedData = await api.get<TopRatedGame[]>(
        ENDPOINTS.GET_TOP_RATED_GAMES
      );
      setTopRatedGames(topRatedData);
    } catch (error) {
      setError("Error al cargar los juegos mejor valorados");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          gamesData,
          genresData,
          platformsData,
          developersData,
          topRatedData,
        ] = await Promise.all([
          api.get<Game[]>(ENDPOINTS.GET_GAMES_HOME),
          api.get<Genre[]>(ENDPOINTS.GET_GENRES),
          api.get<Platform[]>(ENDPOINTS.GET_PLATFORMS),
          api.get<Developer[]>(ENDPOINTS.GET_DEVELOPERS),
          api.get<TopRatedGame[]>(ENDPOINTS.GET_TOP_RATED_GAMES),
        ]);

        setGames(gamesData);
        setGenres(genresData.map((g) => ({ ...g, code: g.id.toString() })));
        setPlatforms(
          platformsData.map((p) => ({ ...p, code: p.id.toString() }))
        );
        setDevelopers(
          developersData.map((d) => ({ ...d, code: d.id.toString() }))
        );
        setTopRatedGames(topRatedData);
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

  const searchGames = useCallback(async (title: string) => {
    try {
      const gamesData = await api.get<Game[]>(
        ENDPOINTS.GET_GAMES_SEARCH(title)
      );
      return gamesData;
    } catch (error) {
      setError("Error al buscar juegos");
      return [];
    }
  }, []);

  return {
    games,
    genres,
    platforms,
    developers,
    topRatedGames,
    loading,
    error,
    createGame,
    searchGames,
    fetchTopRatedGames,
  };
};
