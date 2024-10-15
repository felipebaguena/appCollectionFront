import React from 'react';
import { useDataTable } from '@/hooks/useDataTable';
import { Column, DataTableParams, DataTableResponse } from '@/types/dataTable';
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
}

function DataTable<T extends Record<string, any>>({
    columns,
    endpoint,
    initialParams = {},
    title
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

    return (
        <>
            {title && <TableTitle>{title}</TableTitle>}
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            {columns.map((column) => (
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
                                {columns.map((column) => (
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
