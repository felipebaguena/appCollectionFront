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

interface AllArticlesResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const useArticles = () => {
  const [homeArticles, setHomeArticles] = useState<HomeArticlesResponse | null>(
    null
  );
  const [allArticles, setAllArticles] = useState<AllArticlesResponse | null>(
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

  const fetchAllArticles = useCallback(
    async (page: number = 1, limit: number = 12) => {
      setLoading(true);
      try {
        const data = await api.get<AllArticlesResponse>(
          ENDPOINTS.GET_ALL_ARTICLES(page, limit)
        );
        setAllArticles(data);
        setError(null);
        return data;
      } catch (error) {
        setError("Error al cargar todos los artículos");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    homeArticles,
    allArticles,
    loading,
    error,
    fetchHomeArticles,
    fetchAllArticles,
  };
};
