import { DataTableParams } from "@/types/dataTable";
import React from "react";

export interface BaseFilter {
  search?: string;
}

export interface FilterPackage<T, F extends BaseFilter> {
  filters: F;
  applyFilters: (params: DataTableParams<T, F>) => { filters: F };
  renderFilter: (
    key: keyof F,
    value: any,
    onChange: (key: keyof F, value: any) => void
  ) => React.ReactNode;
  clearFilters?: (onChange: (key: keyof F, value: any) => void) => void;
}

export type FilterType =
  | "game"
  | "platform"
  | "genre"
  | "developer"
  | "article"
  | "otherType";

export type FilterPackages = {
  [K in FilterType]: FilterPackage<any, any>;
};
