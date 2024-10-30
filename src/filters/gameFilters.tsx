import React from 'react';
import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Game } from "@/types/game";
import FilterInput from '@/components/ui/FilterInput';
import MultiSelect from '@/components/ui/Multiselect';
import { useGames } from '@/hooks/useGames';
import { FilterGroup, FilterLabel } from '@/components/management/DataTableElements';

interface GameFilter extends BaseFilter {
  search: string;
  platformIds: number[];
  genreIds: number[];
  developerIds: number[];
}

export const gameFilters: FilterPackage<Game, GameFilter> = {
  filters: {
    search: "",
    platformIds: [],
    genreIds: [],
    developerIds: []
  },
  applyFilters: (params: DataTableParams<Game, GameFilter>) => {
    const { search, platformIds, genreIds, developerIds } = params.filters;
    return {
      filters: {
        search: search || "",
        platformIds: platformIds || [],
        genreIds: genreIds || [],
        developerIds: developerIds || []
      },
    };
  },
  renderFilter: (key: keyof GameFilter, value: any, onChange: (key: keyof GameFilter, value: any) => void) => {
    // Obtener las opciones desde el hook useGames
    const { genres, platforms, developers } = useGames();

    const genresOptions = genres.map(g => ({ id: g.id, name: g.name, code: g.id.toString() }));
    const platformsOptions = platforms.map(p => ({ id: p.id, name: p.name, code: p.id.toString() }));
    const developersOptions = developers.map(d => ({ id: d.id, name: d.name, code: d.id.toString() }));

    const getSelectedOptions = (ids: number[], options: Option[]) => {
      return options.filter(option => ids.includes(option.id));
    };

    switch (key) {
      case 'search':
        return (
          <FilterGroup key={key}>
            <FilterLabel>Nombre del juego</FilterLabel>
            <FilterInput
              label="Buscar juego"
              value={value}
              onChange={(newValue) => onChange(key, newValue)}
            />
          </FilterGroup>
        );
      case 'platformIds':
        return (
          <FilterGroup key={key}>
            <FilterLabel>Plataformas</FilterLabel>
            <MultiSelect
              options={platformsOptions}
              selectedOptions={getSelectedOptions(value || [], platformsOptions)}
              onChange={(selected) => onChange(key, selected.map(s => s.id))}
              placeholder="Seleccionar plataformas"
            />
          </FilterGroup>
        );
      case 'genreIds':
        return (
          <FilterGroup key={key}>
            <FilterLabel>Géneros</FilterLabel>
            <MultiSelect
              options={genresOptions}
              selectedOptions={getSelectedOptions(value || [], genresOptions)}
              onChange={(selected) => onChange(key, selected.map(s => s.id))}
              placeholder="Seleccionar géneros"
            />
          </FilterGroup>
        );
      case 'developerIds':
        return (
          <FilterGroup key={key}>
            <FilterLabel>Desarrolladores</FilterLabel>
            <MultiSelect
              options={developersOptions}
              selectedOptions={getSelectedOptions(value || [], developersOptions)}
              onChange={(selected) => onChange(key, selected.map(s => s.id))}
              placeholder="Seleccionar desarrolladores"
            />
          </FilterGroup>
        );
      default:
        return null;
    }
  }
};

interface Option {
  id: number;
  name: string;
  code: string;
}