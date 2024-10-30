import React from 'react';
import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Game } from "@/types/game";
import FilterInput from '@/components/ui/FilterInput';
import MultiSelect from '@/components/ui/Multiselect';
import { useGames } from '@/hooks/useGames';
import { FilterGroup, FilterLabel } from '@/components/management/DataTableElements';
import YearRangeSelector from '@/components/ui/YearRangeSelector';
import Button from '@/components/ui/Button';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

interface GameFilter extends BaseFilter {
    search: string;
    platformIds: number[];
    genreIds: number[];
    developerIds: number[];
    yearRange: {
        start: number;
        end: number;
    } | null;
}

const ClearButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  height: fit-content;

  svg {
    font-size: 0.9rem;
  }
`;

const FilterGroupWithClear = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const gameFilters: FilterPackage<Game, GameFilter> = {
    filters: {
        search: "",
        platformIds: [],
        genreIds: [],
        developerIds: [],
        yearRange: null
    },
    applyFilters: (params: DataTableParams<Game, GameFilter>) => {
        const { search, platformIds, genreIds, developerIds, yearRange } = params.filters;
        return {
            filters: {
                search: search || "",
                platformIds: platformIds || [],
                genreIds: genreIds || [],
                developerIds: developerIds || [],
                yearRange: yearRange || null
            },
        };
    },
    renderFilter: (key: keyof GameFilter, value: any, onChange: (key: keyof GameFilter, value: any) => void) => {
        const { genres, platforms, developers } = useGames();

        const genresOptions = genres.map(g => ({ id: g.id, name: g.name, code: g.id.toString() }));
        const platformsOptions = platforms.map(p => ({ id: p.id, name: p.name, code: p.id.toString() }));
        const developersOptions = developers.map(d => ({ id: d.id, name: d.name, code: d.id.toString() }));

        const getSelectedOptions = (ids: number[], options: Option[]) => {
            return options.filter(option => ids.includes(option.id));
        };

        const handleClearFilters = () => {
            onChange('search', '');
            onChange('platformIds', []);
            onChange('genreIds', []);
            onChange('developerIds', []);
            onChange('yearRange', null);
        };

        const hasActiveFilters =
            value?.search ||
            (value?.platformIds && value.platformIds.length > 0) ||
            (value?.genreIds && value.genreIds.length > 0) ||
            (value?.developerIds && value.developerIds.length > 0) ||
            value?.yearRange;

        const renderFilterContent = () => {
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
                case 'yearRange':
                    return (
                        <FilterGroup key={key}>
                            <FilterLabel>Año de lanzamiento</FilterLabel>
                            <YearRangeSelector
                                value={value}
                                onChange={(range) => onChange(key, range)}
                                startYear={1970}
                                endYear={new Date().getFullYear()}
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
        };

        return (
            <FilterGroupWithClear>
                <FiltersWrapper>
                    {renderFilterContent()}
                    {hasActiveFilters && (
                        <ClearButton
                            $variant="primary"
                            onClick={handleClearFilters}
                        >
                            <FaTimes />
                            Limpiar filtros
                        </ClearButton>
                    )}
                </FiltersWrapper>
            </FilterGroupWithClear>
        );
    }
};

interface Option {
    id: number;
    name: string;
    code: string;
} 