'use client';

import React, { useState } from 'react';
import DataTable from '@/components/management/DataTable';
import { ENDPOINTS } from '@/constants/endpoints';
import { gameColumns } from '@/constants/tableColumns';
import { Game } from '@/types/game';

import { DataTableContainer } from '@/components/management/DataTableElements';
import ImageModal from '@/components/ui/ImageModal';
import { getGameColumns } from '@/components/management/CustomColumns';
import { getImageUrl } from '@/services/api';

export default function ManageGames() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleViewCover = (game: Game) => {
    console.log('Ver portada', game);
    setSelectedGame(game);
  };

  const columns = getGameColumns(gameColumns, handleViewCover);

  const handleEdit = (game: Game) => {
    console.log('Editar', game);
  };

  const handleDelete = (game: Game) => {
    console.log('Eliminar', game);
  };

  const coverImage = selectedGame?.images.find(img => img.id === selectedGame.coverId);

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
      <ImageModal
        isOpen={!!selectedGame}
        onClose={() => setSelectedGame(null)}
        game={selectedGame}
        getImageUrl={getImageUrl}
      />
    </div>
  );
}
