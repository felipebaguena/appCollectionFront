'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { genreColumns } from '@/constants/tableColumns';
import { Genre } from '@/types/genre';
import { DataTableContainer } from '@/components/management/DataTableElements';
import { filterPackages } from '@/filters';
import { FilterPackage } from '@/types/filters';

export default function ManageGenres() {
    const columns = genreColumns;

    return (
        <div>
            <DataTableContainer>
                <DataTable<Genre, typeof filterPackages.genre.filters>
                    title="Listado de géneros"
                    columns={columns}
                    endpoint={ENDPOINTS.GET_GENRES_DATATABLE}
                    form="genre"
                    filterPackage={filterPackages.genre as FilterPackage<Genre, typeof filterPackages.genre.filters>}
                />
            </DataTableContainer>
        </div>
    );
}
