import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { ArticleTemplate } from "@/types/articleTemplate";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<ArticleTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<ArticleTemplate[]>(
        ENDPOINTS.GET_ACTIVE_TEMPLATES
      );
      setTemplates(data);
      setError(null);
    } catch (error) {
      setError("Error al cargar las plantillas");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
  };
};
