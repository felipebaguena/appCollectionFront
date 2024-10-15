// src/hooks/useGameImages.ts

import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface GameImage {
  id: number;
  filename: string;
  path: string;
  isCover: boolean;
  gameId: number;
}

export const useGameImages = (gameId: number) => {
  const [gameImages, setGameImages] = useState<GameImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const images = await api.get<GameImage[]>(
        `${ENDPOINTS.GET_GAME_IMAGES}/${gameId}`
      );
      setGameImages(images);
    } catch (error) {
      setError("Error al cargar las imágenes del juego");
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const setCover = useCallback(
    async (imageId: number) => {
      setLoading(true);
      setError(null);
      try {
        console.log(
          "Llamando a la API para establecer la portada:",
          imageId,
          "para el juego:",
          gameId
        );
        const response = await api.post(ENDPOINTS.SET_COVER(imageId), {
          gameId: gameId,
        });
        console.log("Respuesta de la API:", response);

        setGameImages((prevImages) =>
          prevImages.map((img) => ({
            ...img,
            isCover: img.id === imageId,
          }))
        );
      } catch (error) {
        console.error("Error en la llamada a la API:", error);
        setError("Error al establecer la portada del juego");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [gameId]
  );

  return { gameImages, loading, error, fetchGameImages, setCover };
};
