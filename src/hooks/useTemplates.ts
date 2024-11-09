import { useState, useCallback } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface Template {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Template[]>(ENDPOINTS.GET_ACTIVE_TEMPLATES);
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
