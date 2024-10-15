import React from "react";
import { Column } from "@/types/dataTable";
import { Game } from "@/types/game";

export const gameColumns: Column<Game>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "title",
    label: "Título",
    sortable: true,
  },
  {
    key: "releaseYear",
    label: "Año de lanzamiento",
    sortable: true,
  },
  {
    key: "genres",
    label: "Género",
    sortable: false,
  },
  {
    key: "platforms",
    label: "Plataformas",
    sortable: false,
  },
  {
    key: "description",
    label: "Descripción",
    sortable: false,
  },
  {
    key: "coverId",
    label: "Portada",
    sortable: false,
  },
];
