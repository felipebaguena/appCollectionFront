'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onSortChange: (field: keyof T, order: 'asc' | 'desc') => void;
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
`;

const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid #007bff;
  background-color: #f8f9fa;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  color: #333;

  &:hover {
    background-color: #e9ecef;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  color: #333;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  color: #333;
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const TableTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

function DataTable<T extends Record<string, any>>({
    columns,
    data,
    itemsPerPage,
    onPageChange,
    onSortChange,
    totalItems,
    totalPages,
    currentPage
}: DataTableProps<T>) {
    const [sortField, setSortField] = useState<keyof T | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


    const handleSort = (field: keyof T) => {
        const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
        onSortChange(field, newOrder);
    };

    return (
        <>
            <TableTitle>Listado de datos</TableTitle>
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <Th key={String(column.key)} onClick={() => handleSort(column.key)}>
                                    {column.label}
                                    {sortField === column.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
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
                <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                </Button>
            </PaginationContainer>
        </>
    );
}

export default DataTable;
