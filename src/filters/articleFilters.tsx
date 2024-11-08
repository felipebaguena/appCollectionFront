import React from 'react';
import { BaseFilter, FilterPackage } from "@/types/filters";
import { DataTableParams } from "@/types/dataTable";
import { Article, PublishedStatus } from "@/types/article";
import FilterInput from '@/components/ui/FilterInput';
import MultiSelect from '@/components/ui/Multiselect';
import { useGames } from '@/hooks/useGames';
import { FilterGroup, FilterLabel } from '@/components/management/DataTableElements';
import ArticleDateRangeFilter from '@/components/articles/ArticleDateRangeFilter';
import ArticlePublishedStatusFilter from '@/components/articles/ArticlePublishedStatusFilter';

interface ArticleFilter extends BaseFilter {
    search: string;
    platformIds: number[];
    genreIds: number[];
    developerIds: number[];
    creationDateRange: {
        start: string | null;
        end: string | null;
    } | null;
    publishedDateRange: {
        start: string | null;
        end: string | null;
    } | null;
    publishedStatus: PublishedStatus;
}

export const articleFilters: FilterPackage<Article, ArticleFilter> = {
    filters: {
        search: "",
        platformIds: [],
        genreIds: [],
        developerIds: [],
        creationDateRange: null,
        publishedDateRange: null,
        publishedStatus: PublishedStatus.ALL
    },
    applyFilters: (params: DataTableParams<Article, ArticleFilter>) => {
        const { search, platformIds, genreIds, developerIds, creationDateRange, publishedDateRange, publishedStatus } = params.filters;
        return {
            filters: {
                search: search || "",
                platformIds: platformIds || [],
                genreIds: genreIds || [],
                developerIds: developerIds || [],
                creationDateRange: creationDateRange || null,
                publishedDateRange: publishedDateRange || null,
                publishedStatus: publishedStatus || PublishedStatus.ALL
            },
        };
    },
    clearFilters: (onChange: (key: keyof ArticleFilter, value: any) => void) => {
        onChange('search', '');
        onChange('platformIds', []);
        onChange('genreIds', []);
        onChange('developerIds', []);
        onChange('creationDateRange', null);
        onChange('publishedDateRange', null);
        onChange('publishedStatus', PublishedStatus.ALL);
    },
    renderFilter: (key: keyof ArticleFilter, value: any, onChange: (key: keyof ArticleFilter, value: any) => void) => {
        const { genres, platforms, developers } = useGames();

        const genresOptions = genres.map(g => ({ id: g.id, name: g.name, code: g.id.toString() }));
        const platformsOptions = platforms.map(p => ({ id: p.id, name: p.name, code: p.id.toString() }));
        const developersOptions = developers.map(d => ({ id: d.id, name: d.name, code: d.id.toString() }));

        const getSelectedOptions = (ids: number[], options: { id: number; name: string; code: string }[]) => {
            return options.filter(option => ids.includes(option.id));
        };

        switch (key) {
            case 'search':
                return (
                    <FilterGroup key={key}>
                        <FilterLabel>Título del artículo</FilterLabel>
                        <FilterInput
                            label="Buscar artículo"
                            value={value}
                            onChange={(newValue) => onChange(key, newValue)}
                        />
                    </FilterGroup>
                );
            case 'creationDateRange':
                return (
                    <FilterGroup key={key}>
                        <FilterLabel>Fecha de creación</FilterLabel>
                        <ArticleDateRangeFilter
                            value={value || { start: null, end: null }}
                            onChange={(range) => onChange(key, range)}
                        />
                    </FilterGroup>
                );
            case 'publishedDateRange':
                return (
                    <FilterGroup key={key}>
                        <FilterLabel>Fecha de publicación</FilterLabel>
                        <ArticleDateRangeFilter
                            value={value || { start: null, end: null }}
                            onChange={(range) => onChange(key, range)}
                        />
                    </FilterGroup>
                );
            case 'publishedStatus':
                return (
                    <FilterGroup key={key}>
                        <FilterLabel>Estado de publicación</FilterLabel>
                        <ArticlePublishedStatusFilter
                            value={value}
                            onChange={(status) => onChange(key, status)}
                        />
                    </FilterGroup>
                );
            case 'platformIds':
                return (
                    <FilterGroup key={key}>
                        <FilterLabel>Plataformas relacionadas</FilterLabel>
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
                        <FilterLabel>Géneros relacionados</FilterLabel>
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
                        <FilterLabel>Desarrolladores relacionados</FilterLabel>
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