'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { gameColumns } from '@/constants/tableColumns';
import { Game } from '@/types/game';
import { DataTableContainer } from '@/components/management/DataTableElements';
import { getGameColumns } from '@/components/management/CustomColumns';
import ViewGameForm from '@/components/games/ViewGameForm';
import EditGameForm from '@/components/games/EditGameForm';
import DeleteGameConfirmation from '@/components/games/DeleteGameConfirmation';

export default function ManageGames() {
  const columns = getGameColumns(gameColumns);

  return (
    <div>
      <DataTableContainer>
        <DataTable<Game>
          title="Listado de juegos"
          columns={columns}
          endpoint={ENDPOINTS.GET_GAMES_DATATABLE}
          viewComponent={ViewGameForm}
          editComponent={EditGameForm}
          deleteComponent={DeleteGameConfirmation}
        />
      </DataTableContainer>
    </div>
  );
}
