'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { developerColumns } from '@/constants/tableColumns';
import { Developer } from '@/types/developer';
import { DataTableContainer } from '@/components/management/DataTableElements';
import { filterPackages } from '@/filters';
import { FilterPackage } from '@/types/filters';

export default function ManageDevelopers() {
    return (
        <div>
            <DataTableContainer>
                <DataTable<Developer, typeof filterPackages.developer.filters>
                    title="Listado de desarrolladores"
                    columns={developerColumns}
                    endpoint={ENDPOINTS.GET_DEVELOPERS_DATATABLE}
                    form="developer"
                    filterPackage={filterPackages.developer as FilterPackage<Developer, typeof filterPackages.developer.filters>}
                />
            </DataTableContainer>
        </div>
    );
}