'use client';

import React from 'react';
import DataTable from '@/components/management/DataTable';
import Title from '@/components/ui/Title';
import { useDataTable } from '@/hooks/useDataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { gameColumns } from '@/constants/tableColumns';
import { Game, Platform, Genre } from '@/types/game';
import { Column } from '@/types/dataTable';

export default function ManageGames() {
  const {
    data: games,
    loading,
    error,
    totalItems,
    totalPages,
    handlePageChange,
    handleSortChange,
    params
  } = useDataTable<Game>(ENDPOINTS.GET_GAMES_DATATABLE, {
    page: 1,
    limit: 10,
    sortField: '',
    sortOrder: 'asc'
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const columnsWithCustomRendering: Column<Game>[] = gameColumns.map(column => {
    if (column.key === 'platforms') {
      return {
        ...column,
        render: (value: Game[keyof Game]) =>
          Array.isArray(value)
            ? (value as Platform[]).map(p => p.name).join(', ')
            : String(value)
      };
    }
    if (column.key === 'genres') {
      return {
        ...column,
        render: (value: Game[keyof Game]) =>
          Array.isArray(value)
            ? (value as Genre[]).map(g => g.name).join(', ')
            : String(value)
      };
    }
    return column;
  });

  const columnsWithActions: Column<Game>[] = [
    ...columnsWithCustomRendering,
    {
      key: 'id',
      label: 'Acciones',
      render: (_value: Game[keyof Game], item: Game) => (
        <div>
          <button onClick={() => handleEdit(item.id)}>Editar</button>
          <button onClick={() => handleDelete(item.id)}>Eliminar</button>
        </div>
      ),
    },
  ];

  const handleEdit = (id: number) => {
    console.log('Editar', id);
    // Implementa la lógica de edición aquí
  };

  const handleDelete = (id: number) => {
    console.log('Eliminar', id);
    // Implementa la lógica de eliminación aquí
  };

  return (
    <div>
      <Title>Gestionar juegos</Title>
      <DataTable
        columns={columnsWithActions}
        data={games}
        itemsPerPage={params.limit}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={params.page}
      />
    </div>
  );
}
