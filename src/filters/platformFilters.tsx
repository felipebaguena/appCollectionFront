import React from 'react';
import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Platform } from "@/types/platform";
import FilterInput from '@/components/ui/FilterInput';

interface PlatformFilter extends BaseFilter {
    search: string;
}

export const platformFilters: FilterPackage<Platform, PlatformFilter> = {
    filters: {
        search: "",
    },
    applyFilters: (params: DataTableParams<Platform, PlatformFilter>) => {
        const { search } = params.filters;
        return {
            filters: {
                search: search || "",
            },
        };
    },
    renderFilter: (key: keyof PlatformFilter, value: any, onChange: (key: keyof PlatformFilter, value: any) => void) => {
        switch (key) {
            case 'search':
                return (
                    <FilterInput
                        key={key}
                        label="Buscar plataforma"
                        value={value}
                        onChange={(newValue) => onChange(key, newValue)}
                    />
                );
            default:
                return null;
        }
    }
};