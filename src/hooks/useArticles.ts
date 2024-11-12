"use client";

import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { Article } from "@/types/article";

interface HomeArticlesResponse {
  coverArticle: Article;
  topArticles: Article[];
  homeArticles: Article[];
}

export const useArticles = () => {
  const [homeArticles, setHomeArticles] = useState<HomeArticlesResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<HomeArticlesResponse>(
        ENDPOINTS.GET_ARTICLES_HOME
      );
      setHomeArticles(data);
      setError(null);
      return data;
    } catch (error) {
      setError("Error al cargar los artículos de la página de inicio");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    homeArticles,
    loading,
    error,
    fetchHomeArticles,
  };
};
