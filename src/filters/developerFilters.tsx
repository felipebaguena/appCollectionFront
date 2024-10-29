import React from "react";
import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Developer } from "@/types/developer";
import FilterInput from "@/components/ui/FilterInput";

interface DeveloperFilter extends BaseFilter {
  search: string;
}

export const developerFilters: FilterPackage<Developer, DeveloperFilter> = {
  filters: {
    search: "",
  },
  applyFilters: (params: DataTableParams<Developer, DeveloperFilter>) => {
    const { search } = params.filters;
    return {
      filters: {
        search: search || "",
      },
    };
  },
  renderFilter: (
    key: keyof DeveloperFilter,
    value: any,
    onChange: (key: keyof DeveloperFilter, value: any) => void
  ) => {
    switch (key) {
      case "search":
        return (
          <FilterInput
            key={key}
            label="Buscar desarrollador"
            value={value}
            onChange={(newValue) => onChange(key, newValue)}
          />
        );
      default:
        return null;
    }
  },
};
