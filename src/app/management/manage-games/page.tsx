'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { gameColumns } from '@/constants/tableColumns';
import { Game } from '@/types/game';
import { DataTableContainer } from '@/components/management/DataTableElements';
import { getGameColumns } from '@/components/management/CustomColumns';

export default function ManageGames() {
  const columns = getGameColumns(gameColumns);

  const handleEdit = (game: Game) => {
    console.log('Editar', game);
  };

  const handleDelete = (game: Game) => {
    console.log('Eliminar', game);
  };

  return (
    <div>
      <DataTableContainer>
        <DataTable<Game>
          title="Listado de juegos"
          columns={columns}
          endpoint={ENDPOINTS.GET_GAMES_DATATABLE}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </DataTableContainer>
    </div>
  );
}
