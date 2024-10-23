import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

interface DataTableParams<T> {
  page: number;
  limit: number;
  sortField: keyof T | "";
  sortOrder: "asc" | "desc";
  filters?: any;
}

interface DataTableResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export const useDataTable = <T>(
  endpoint: string,
  initialParams: DataTableParams<T>
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<DataTableParams<T>>(initialParams);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(
    async (currentParams: DataTableParams<T>) => {
      setLoading(true);
      try {
        const response = await api.post<DataTableResponse<T>>(
          endpoint,
          {
            dataTable: {
              page: currentParams.page,
              limit: currentParams.limit,
              sortField: currentParams.sortField || undefined,
              sortOrder: currentParams.sortOrder.toUpperCase(),
            },
            filter: currentParams.filters,
          },
          true
        );
        setData(response.data);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (field: keyof T, order: "asc" | "desc") => {
    setParams((prev) => ({ ...prev, sortField: field, sortOrder: order }));
  };

  const refreshData = useCallback(
    (newParams?: Partial<DataTableParams<T>>) => {
      const updatedParams = newParams ? { ...params, ...newParams } : params;
      setParams(updatedParams);
    },
    [params]
  );

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
};
