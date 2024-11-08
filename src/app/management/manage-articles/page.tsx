'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { articleColumns } from '@/constants/tableColumns';
import { Article } from '@/types/article';
import { DataTableContainer } from '@/components/management/DataTableElements';
import { getArticleColumns } from '@/components/management/CustomColumns';
import { filterPackages } from '@/filters';
import { FilterPackage } from '@/types/filters';

export default function ManageArticles() {
    const columns = getArticleColumns(articleColumns);

    return (
        <div>
            <DataTableContainer>
                <DataTable<Article, typeof filterPackages.article.filters>
                    title="Listado de artículos"
                    columns={columns}
                    endpoint={ENDPOINTS.GET_ARTICLES_DATATABLE}
                    form="article"
                    filterPackage={filterPackages.article as FilterPackage<Article, typeof filterPackages.article.filters>}
                    breakpoint={968}
                />
            </DataTableContainer>
        </div>
    );
}