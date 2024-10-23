'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { platformColumns } from '@/constants/tableColumns';
import { Platform } from '@/types/platform';
import { DataTableContainer } from '@/components/management/DataTableElements';
import { getPlatformColumns } from '@/components/management/CustomColumns';
import { filterPackages } from '@/filters';
import { FilterPackage } from '@/types/filters';

export default function ManagePlatforms() {
    const columns = getPlatformColumns(platformColumns);

    return (
        <div>
            <DataTableContainer>
                <DataTable<Platform, typeof filterPackages.platform.filters>
                    title="Listado de plataformas"
                    columns={columns}
                    endpoint={ENDPOINTS.GET_PLATFORMS_DATATABLE}
                    form="platform"
                    filterPackage={filterPackages.platform as FilterPackage<Platform, typeof filterPackages.platform.filters>}
                />
            </DataTableContainer>
        </div>
    );
}