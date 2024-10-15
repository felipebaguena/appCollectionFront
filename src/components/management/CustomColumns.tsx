import React from "react";
import { Column } from "@/types/dataTable";
import { Game, Platform, Genre } from "@/types/game";

// Función auxiliar para renderizar arrays
const renderArray = (value: any[] | null | undefined): string => {
    if (Array.isArray(value)) {
        return value.map((item) => item.name).join(", ");
    }
    return "";
};

// Columnas personalizadas para Game
const gameColumns: Partial<Record<keyof Game, Partial<Column<Game>>>> = {
    platforms: {
        key: "platforms",
        label: "Plataformas",
        render: (value: Game[keyof Game]): string => {
            return Array.isArray(value)
                ? (value as Platform[]).map((p) => p.name).join(", ")
                : String(value);
        },
    },
    genres: {
        key: "genres",
        label: "Géneros",
        render: (value: Game[keyof Game]): string => {
            return Array.isArray(value)
                ? (value as Genre[]).map((g) => g.name).join(", ")
                : String(value);
        },
    },
};

export const customColumns = {
    Game: gameColumns,
} as const;

export type CustomColumnTypes = keyof typeof customColumns;

export function getCustomColumns<T extends CustomColumnTypes>(
    type: T
): (typeof customColumns)[T] {
    return customColumns[type];
}

export function getGameColumns(baseColumns: Column<Game>[]): Column<Game>[] {
    return baseColumns.map((column) => {
        const customColumn = gameColumns[column.key as keyof Game];
        return customColumn ? { ...column, ...customColumn } : column;
    });
}
