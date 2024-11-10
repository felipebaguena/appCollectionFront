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

export const useArticleImages = (articleId: number, gameId: number) => {
  const [articleImages, setArticleImages] = useState<ArticleImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        ENDPOINTS.DELETE_IMAGE(imageId.toString()),
        imageId.toString()
      );
      setArticleImages((prevImages) =>
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
      await api.request(ENDPOINTS.DELETE_MULTIPLE_IMAGES, {
        method: "DELETE",
        body: { ids: imageIds },
      });
      setArticleImages((prevImages) =>
        prevImages.filter((img) => !imageIds.includes(img.id))
      );
    } catch (error) {
      setError("Error al borrar las imágenes seleccionadas");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    articleImages,
    loading,
    error,
    fetchArticleImages,
    uploadImage,
    deleteImage,
    deleteMultipleImages,
  };
};
