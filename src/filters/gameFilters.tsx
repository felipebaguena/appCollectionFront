import React from 'react';
import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Game } from "@/types/game";
import FilterInput from '@/components/ui/FilterInput';

interface GameFilter extends BaseFilter {
  search: string;
}

export const gameFilters: FilterPackage<Game, GameFilter> = {
  filters: {
    search: "",
  },
  applyFilters: (params: DataTableParams<Game, GameFilter>) => {
    const { search } = params.filters;
    return {
      filters: {
        search: search || "",
      },
    };
  },
  renderFilter: (key: keyof GameFilter, value: any, onChange: (key: keyof GameFilter, value: any) => void) => {
    switch (key) {
      case 'search':
        return (
          <FilterInput
            key={key}
            label="Nombre del juego"
            value={value}
            onChange={(newValue) => onChange(key, newValue)}
          />
        );
      default:
        return null;
    }
  }
};