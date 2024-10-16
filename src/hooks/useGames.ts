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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesData, genresData, platformsData, developersData] =
          await Promise.all([
            api.get<Game[]>(ENDPOINTS.GET_GAMES_HOME),
            api.get<Genre[]>(ENDPOINTS.GET_GENRES),
            api.get<Platform[]>(ENDPOINTS.GET_PLATFORMS),
            api.get<Developer[]>(ENDPOINTS.GET_DEVELOPERS),
          ]);

        setGames(gamesData);
        setGenres(genresData);
        setPlatforms(platformsData);
        setDevelopers(developersData);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { games, genres, platforms, developers, loading, error };
};
