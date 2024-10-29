import React from "react";
import { Column } from "@/types/dataTable";
import { Game } from "@/types/game";
import { Platform } from "@/types/platform";
import { Genre } from "@/types/genre";

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
    key: "developers",
    label: "Desarrolladores",
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

export const platformColumns: Column<Platform>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Nombre", sortable: true },
  { key: "code", label: "Código", sortable: true },
];

export const genreColumns: Column<Genre>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Nombre", sortable: true },
  { key: "code", label: "Código", sortable: true },
];
