import React from "react";
import { Column } from "@/types/dataTable";
import { Developer, Game } from "@/types/game";
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

export const developerColumns: Column<Developer>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Nombre", sortable: true },
  { key: "code", label: "Código", sortable: true },
];

export const articleColumns = [
  {
    key: "title",
    label: "Título",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Fecha de creación",
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "publishedAt",
    label: "Fecha de publicación",
    sortable: true,
    render: (value: string | null) =>
      value ? new Date(value).toLocaleDateString() : "No publicado",
  },
  {
    key: "published",
    label: "Estado",
    sortable: true,
    render: (value: boolean) => {
      return value ? "Publicado" : "Sin publicar";
    },
  },
  {
    key: "template",
    label: "Plantilla",
    sortable: false,
    render: (value: { name: string }) => value?.name || "Sin plantilla",
  },
  {
    key: "relatedGames",
    label: "Juegos relacionado",
    sortable: false,
    render: (value: Array<{ title: string }>) =>
      value?.map((game) => game.title).join(", ") || "Sin juegos relacionados",
  },
  {
    key: "coverId",
    label: "Portada",
    sortable: false,
  },
];
