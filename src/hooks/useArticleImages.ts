import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface ArticleImage {
  id: number;
  filename: string;
  path: string;
  articleId: number;
  gameId: number;
}

interface GameArticleImage extends ArticleImage {
  isSelected?: boolean;
}

export const useArticleImages = (articleId: number, gameId: number) => {
  const [articleImages, setArticleImages] = useState<ArticleImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameArticleImages, setGameArticleImages] = useState<
    GameArticleImage[]
  >([]);
  const [isSelectingMode, setIsSelectingMode] = useState(false);

  const fetchArticleImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const images = await api.get<ArticleImage[]>(
        ENDPOINTS.GET_ARTICLE_IMAGES(articleId.toString())
      );
      setArticleImages(images);
    } catch (error) {
      setError("Error al cargar las imágenes del artículo");
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  const uploadImage = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("image", file, file.name);
        formData.append("articleId", articleId.toString());
        formData.append("gameId", gameId.toString());

        console.log("Enviando formData:", {
          image: file.name,
          articleId: articleId.toString(),
          gameId: gameId.toString(),
        });

        const response = await api.postFormData<ArticleImage>(
          ENDPOINTS.UPLOAD_ARTICLE_IMAGE,
          formData
        );

        console.log("Respuesta del servidor:", response);

        setArticleImages((prevImages) => [...prevImages, response]);
        return response;
      } catch (error) {
        console.error("Error completo:", error);
        setError("Error al subir la imagen");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [articleId, gameId]
  );

  const deleteImage = useCallback(async (imageId: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(
        ENDPOINTS.DELETE_ARTICLE_IMAGE(imageId.toString()),
        imageId.toString()
      );
      setArticleImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );
      setGameArticleImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );
    } catch (error) {
      setError("Error al borrar la imagen");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMultipleImages = useCallback(async (imageIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      // Borrar las imágenes una por una
      await Promise.all(
        imageIds.map((id) =>
          api.delete(
            ENDPOINTS.DELETE_ARTICLE_IMAGE(id.toString()),
            id.toString()
          )
        )
      );

      // Actualizar los estados
      setArticleImages((prevImages) =>
        prevImages.filter((img) => !imageIds.includes(img.id))
      );
      setGameArticleImages((prevImages) =>
        prevImages.filter((img) => !imageIds.includes(img.id))
      );
    } catch (error) {
      setError("Error al borrar las imágenes seleccionadas");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGameArticleImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const images = await api.get<ArticleImage[]>(
        ENDPOINTS.GET_GAME_ARTICLE_IMAGES(gameId.toString())
      );

      // Marcar las imágenes que ya están seleccionadas para este artículo
      const imagesWithSelection = images.map((img) => ({
        ...img,
        isSelected: articleImages.some((artImg) => artImg.id === img.id),
      }));

      setGameArticleImages(imagesWithSelection);
    } catch (error) {
      setError("Error al cargar las imágenes del juego");
    } finally {
      setLoading(false);
    }
  }, [gameId, articleImages]);

  const updateArticleImages = useCallback(
    async (selectedImageIds: number[]) => {
      setLoading(true);
      setError(null);
      try {
        await api.request(
          ENDPOINTS.UPDATE_ARTICLE_IMAGES(articleId.toString()),
          {
            method: "PUT",
            body: { imageIds: selectedImageIds },
          }
        );
        await fetchArticleImages();
        setIsSelectingMode(false);
      } catch (error) {
        setError("Error al actualizar las imágenes del artículo");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [articleId, fetchArticleImages]
  );

  const uploadToGameGallery = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await api.postFormData<ArticleImage>(
          ENDPOINTS.UPLOAD_GAME_ARTICLE_IMAGE(gameId.toString()),
          formData
        );

        // Actualizar la lista de imágenes de la galería
        setGameArticleImages((prev) => [...prev, response]);
        return response;
      } catch (error) {
        setError("Error al subir la imagen a la galería");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [gameId]
  );

  return {
    articleImages,
    loading,
    error,
    fetchArticleImages,
    uploadImage,
    deleteImage,
    deleteMultipleImages,
    gameArticleImages,
    isSelectingMode,
    setIsSelectingMode,
    fetchGameArticleImages,
    updateArticleImages,
    uploadToGameGallery,
  };
};
