import React from 'react';
import { useDataTable } from '@/hooks/useDataTable';
import { Column, DataTableParams } from '@/types/dataTable';
import {
    Table,
    Th,
    Td,
    PaginationContainer,
    Button,
    TableContainer,
    TableTitle
} from './DataTableElements';

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
        params
    } = useDataTable<T>(endpoint, mergedParams);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    const columnsWithActions: Column<T>[] = [
        ...columns,
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
            {title && <TableTitle>{title}</TableTitle>}
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
        </>
    );
}

export default DataTable;
