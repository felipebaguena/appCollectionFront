"use client";

import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Article } from "@/types/article";

interface UpdateArticleRequest {
  title: string;
  subtitle: string;
  content: string;
  relatedGameIds: number[];
  relatedPlatformIds: number[];
  relatedGenreIds: number[];
  relatedDeveloperIds: number[];
}

export const useArticle = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Article>(ENDPOINTS.GET_ARTICLE(id));
      setArticle(data);
      setError(null);
    } catch (error) {
      setError("Error al cargar los detalles del artículo");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateArticle = async (updatedArticleData: UpdateArticleRequest) => {
    setLoading(true);
    try {
      const updatedArticle = await api.put<Article>(
        ENDPOINTS.SET_ARTICLE(id),
        id,
        updatedArticleData
      );
      setArticle(updatedArticle);
      setError(null);
      return updatedArticle;
    } catch (error) {
      setError("Error al actualizar el artículo");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async () => {
    setLoading(true);
    try {
      await api.delete(ENDPOINTS.DELETE_ARTICLE(id), id);
      setArticle(null);
      setError(null);
    } catch (error) {
      setError("Error al eliminar el artículo");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    article,
    loading,
    error,
    fetchArticle,
    updateArticle,
    deleteArticle,
  };
};
