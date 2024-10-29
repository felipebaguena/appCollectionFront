import React from 'react';
import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Genre } from "@/types/genre";
import FilterInput from '@/components/ui/FilterInput';

interface GenreFilter extends BaseFilter {
    search: string;
}

export const genreFilters: FilterPackage<Genre, GenreFilter> = {
    filters: {
        search: "",
    },
    applyFilters: (params: DataTableParams<Genre, GenreFilter>) => {
        const { search } = params.filters;
        return {
            filters: {
                search: search || "",
            },
        };
    },
    renderFilter: (key: keyof GenreFilter, value: any, onChange: (key: keyof GenreFilter, value: any) => void) => {
        switch (key) {
            case 'search':
                return (
                    <FilterInput
                        key={key}
                        label="Buscar género"
                        value={value}
                        onChange={(newValue) => onChange(key, newValue)}
                    />
                );
            default:
                return null;
        }
    }
};