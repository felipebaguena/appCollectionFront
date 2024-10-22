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

  const uploadImage = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("image", file, file.name);
        formData.append("gameId", gameId.toString());

        console.log("Enviando formData:", {
          image: file.name,
          gameId: gameId.toString(),
        });

        const response = await api.postFormData<GameImage>(
          ENDPOINTS.UPLOAD_GAME_IMAGE,
          formData
        );

        console.log("Respuesta del servidor:", response);

        setGameImages((prevImages) => [...prevImages, response]);
        return response;
      } catch (error) {
        console.error("Error completo:", error);
        setError("Error al subir la imagen");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [gameId]
  );

  return { gameImages, loading, error, fetchGameImages, setCover, uploadImage };
};
