export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface DataTableParams<T, F = Record<string, any>> {
  page: number;
  limit: number;
  sortField: keyof T | "";
  sortOrder: "asc" | "desc";
  filters: F;
  search?: string;
}

export interface DataTableResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export type SortDirection = "asc" | "desc";

export interface SortInfo<T> {
  field: keyof T | "";
  direction: SortDirection;
}
