import { DataTableParams } from "@/types/dataTable";
import React from "react";

export interface BaseFilter {
  search?: string;
}

export interface FilterPackage<T, F extends BaseFilter> {
  filters: F;
  applyFilters: (
    params: DataTableParams<T, F>
  ) => Partial<DataTableParams<T, F>>;
  renderFilter: (
    key: keyof F,
    value: any,
    onChange: (key: keyof F, value: any) => void
  ) => React.ReactNode;
}

export type FilterType = "game" | "platform" | "genre" | "otherType";

export type FilterPackages = {
  [K in FilterType]: FilterPackage<any, any>;
};
