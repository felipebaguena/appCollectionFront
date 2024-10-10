import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/services/api';

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
        const response = await fetch(`${API_BASE_URL}/games/home`);
        if (!response.ok) {
          throw new Error('Error al cargar los juegos');
        }
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los juegos');
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return { games, loading, error };
};