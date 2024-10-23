import { DataTableParams } from "@/types/dataTable";

export interface BaseFilter {
  search?: string;
}

export interface FilterPackage<T, F extends BaseFilter> {
  filters: F;
  applyFilters: (
    params: DataTableParams<T, F>
  ) => Partial<DataTableParams<T, F>>;
}
