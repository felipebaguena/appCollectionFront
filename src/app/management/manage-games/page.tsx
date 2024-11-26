'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { gameColumns } from '@/constants/tableColumns';
import { Game } from '@/types/game';
import { DataTableContainer } from '@/components/management/DataTableElements';
import { getGameColumns } from '@/components/management/CustomColumns';
import { filterPackages } from '@/filters';
import { FilterPackage } from '@/types/filters';

export default function ManageGames() {
  const columns = getGameColumns(gameColumns);

  const initialParams = {
    page: 1,
    limit: 20,
    sortField: 'id' as keyof Game,
    sortOrder: 'desc' as const,
    filters: {}
  };

  return (
    <div>
      <DataTableContainer>
        <DataTable<Game, typeof filterPackages.game.filters>
          title="Listado de juegos"
          columns={columns}
          endpoint={ENDPOINTS.GET_GAMES_DATATABLE}
          form="game"
          initialParams={initialParams}
          filterPackage={filterPackages.game as FilterPackage<Game, typeof filterPackages.game.filters>}
          breakpoint={968}
        />
      </DataTableContainer>
    </div>
  );
}
