import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface DataTableParams<T> {
  page: number;
  limit: number;
  sortField: keyof T | "";
  sortOrder: "asc" | "desc";
}

interface DataTableResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export function useDataTable<T>(
  endpoint: string,
  initialParams: DataTableParams<T>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<DataTableParams<T>>(initialParams);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.post<DataTableResponse<T>>(endpoint, {
          dataTable: {
            page: params.page,
            limit: params.limit,
            sortField: params.sortField || undefined,
            sortOrder: params.sortOrder.toUpperCase(),
          },
        });
        setData(response.data);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, params]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (field: keyof T, order: "asc" | "desc") => {
    setParams((prev) => {
      const newParams = { ...prev, sortField: field, sortOrder: order };
      return newParams;
    });
  };

  const refreshData = () => {
    setParams((prev) => ({ ...prev }));
  };

  return {
    data,
    loading,
    error,
    totalItems,
    totalPages,
    handlePageChange,
    handleSortChange,
    params,
    refreshData,
  };
}
