import React, { useState, useEffect } from 'react';
import { useDataTable } from '@/hooks/useDataTable';
import { Column, DataTableParams } from '@/types/dataTable';
import {
    Table,
    Th,
    Td,
    PaginationContainer,
    Button,
    TableContainer,
    TableTitle,
    TitleContainer,
    RefreshButton
} from './DataTableElements';
import { getImageUrl } from '@/services/api';
import { Game } from '@/types/game';
import CoverImageModal from '@/components/ui/CoverImageModal';

interface DataTableProps<T> {
    columns: Column<T>[];
    endpoint: string;
    initialParams?: Partial<DataTableParams<T>>;
    title?: string;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

function DataTable<T extends { id: number }>({
    columns,
    endpoint,
    initialParams = {},
    title,
    onEdit,
    onDelete
}: DataTableProps<T>) {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const defaultParams: DataTableParams<T> = {
        page: 1,
        limit: 10,
        sortField: '' as keyof T | '',
        sortOrder: 'asc',
        filters: {},
        search: ''
    };

    const mergedParams = { ...defaultParams, ...initialParams };

    const {
        data,
        loading,
        error,
        totalItems,
        totalPages,
        handlePageChange,
        handleSortChange,
        params,
        refreshData
    } = useDataTable<T>(endpoint, mergedParams);

    useEffect(() => {
        if (shouldRefresh) {
            refreshData();
            setShouldRefresh(false);
        }
    }, [shouldRefresh, refreshData]);

    const handleViewCover = (game: Game) => {
        setSelectedGame(game);
    };

    const handleCoverUpdated = () => {
        setShouldRefresh(true);
    };

    const columnsWithActions: Column<T>[] = [
        ...columns.map(column => {
            if (column.key === 'coverId') {
                return {
                    ...column,
                    render: (_: unknown, item: T) => (
                        <button onClick={() => {
                            if ('title' in item && 'releaseYear' in item) {
                                handleViewCover(item as unknown as Game);
                            }
                        }}>Ver portada</button>
                    ),
                };
            }
            return column;
        }),
        {
            key: 'actions' as keyof T,
            label: 'Acciones',
            render: (_, item: T) => (
                <div>
                    {onEdit && <button onClick={() => onEdit(item)}>Editar</button>}
                    {onDelete && <button onClick={() => onDelete(item)}>Eliminar</button>}
                </div>
            ),
        },
    ];

    return (
        <>
            {title && (
                <TitleContainer>
                    <TableTitle>{title}</TableTitle>
                    <RefreshButton onClick={refreshData}>Actualizar</RefreshButton>
                </TitleContainer>
            )}
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            {columnsWithActions.map((column) => (
                                <Th
                                    key={String(column.key)}
                                    onClick={() => column.sortable && handleSortChange(column.key, params.sortOrder === 'asc' ? 'desc' : 'asc')}
                                    sortable={column.sortable}
                                >
                                    {column.label}
                                    {column.sortable && params.sortField === column.key && (
                                        params.sortOrder === 'asc' ? ' ▲' : ' ▼'
                                    )}
                                </Th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                {columnsWithActions.map((column) => (
                                    <Td key={String(column.key)}>
                                        {column.render
                                            ? column.render(item[column.key], item)
                                            : String(item[column.key])}
                                    </Td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
            <PaginationContainer>
                <Button onClick={() => handlePageChange(params.page - 1)} disabled={params.page === 1}>
                    Anterior
                </Button>
                <span>
                    Página {params.page} de {totalPages} |
                    Mostrando {Math.min(params.limit, data.length)} de {totalItems} registros
                </span>
                <Button onClick={() => handlePageChange(params.page + 1)} disabled={params.page === totalPages}>
                    Siguiente
                </Button>
            </PaginationContainer>
            <CoverImageModal
                isOpen={!!selectedGame}
                onClose={() => setSelectedGame(null)}
                game={selectedGame}
                getImageUrl={getImageUrl}
                onCoverUpdated={handleCoverUpdated}
            />
        </>
    );
}

export default DataTable;
