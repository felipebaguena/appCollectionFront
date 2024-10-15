import React, { useState, useEffect } from 'react';
import { useDataTable } from '@/hooks/useDataTable';
import { Column, DataTableParams } from '@/types/dataTable';
import {
    Table,
    Th,
    StyledTd,
    CellContent,
    CoverThumbnail,
    PaginationContainer,
    Button,
    TableContainer,
    TableTitle,
    TitleContainer,
    RefreshButton,
    ModalOverlay,
    ModalContent
} from './DataTableElements';
import { getImageUrl } from '@/services/api';
import { Game } from '@/types/game';
import CoverImageModal from '@/components/ui/CoverImageModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const NO_IMAGE_URL = `${API_BASE_URL}/uploads/resources/no-image.jpg`;

interface DataTableProps<T> {
    columns: Column<T>[];
    endpoint: string;
    initialParams?: Partial<DataTableParams<T>>;
    title?: string;
    viewComponent?: React.ComponentType<{ item: T; onClose: () => void }>;
    editComponent?: React.ComponentType<{ item: T; onClose: () => void }>;
    deleteComponent?: React.ComponentType<{ item: T; onClose: () => void }>;
}

function DataTable<T extends { id: number }>({
    columns,
    endpoint,
    initialParams = {},
    title,
    viewComponent: ViewComponent,
    editComponent: EditComponent,
    deleteComponent: DeleteComponent
}: DataTableProps<T>) {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [actionType, setActionType] = useState<'view' | 'edit' | 'delete' | null>(null);
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

    const handleAction = (item: T, type: 'view' | 'edit' | 'delete') => {
        setSelectedItem(item);
        setActionType(type);
    };

    const handleCloseAction = () => {
        setSelectedItem(null);
        setActionType(null);
        setShouldRefresh(true);
    };

    const columnsWithActions: Column<T>[] = [
        ...columns.map(column => {
            if (column.key === 'coverId') {
                return {
                    ...column,
                    render: (_: unknown, item: T) => {
                        const game = item as unknown as Game;
                        const coverImage = game.images.find(img => img.isCover);
                        const imageSrc = coverImage ? getImageUrl(coverImage.path) : NO_IMAGE_URL;

                        return (
                            <CoverThumbnail
                                style={{ backgroundImage: `url(${imageSrc})` }}
                                onClick={() => handleViewCover(game)}
                            />
                        );
                    },
                };
            }
            return column;
        }),
        {
            key: 'actions' as keyof T,
            label: 'Acciones',
            render: (_, item: T) => (
                <div>
                    {ViewComponent && <button onClick={() => handleAction(item, 'view')}>Ver</button>}
                    {EditComponent && <button onClick={() => handleAction(item, 'edit')}>Editar</button>}
                    {DeleteComponent && <button onClick={() => handleAction(item, 'delete')}>Eliminar</button>}
                </div>
            ),
        },
    ];

    return (
        <div style={{ position: 'relative' }}>
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
                                    <StyledTd key={String(column.key)}>
                                        <CellContent>
                                            {column.render
                                                ? column.render(item[column.key], item)
                                                : String(item[column.key])}
                                        </CellContent>
                                    </StyledTd>
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

            {/* Modal para la imagen de portada */}
            <CoverImageModal
                isOpen={!!selectedGame}
                onClose={() => setSelectedGame(null)}
                game={selectedGame}
                getImageUrl={getImageUrl}
                onCoverUpdated={handleCoverUpdated}
            />

            {selectedItem && (
                <ModalOverlay>
                    <ModalContent>
                        {actionType === 'view' && ViewComponent && (
                            <ViewComponent item={selectedItem} onClose={handleCloseAction} />
                        )}
                        {actionType === 'edit' && EditComponent && (
                            <EditComponent item={selectedItem} onClose={handleCloseAction} />
                        )}
                        {actionType === 'delete' && DeleteComponent && (
                            <DeleteComponent item={selectedItem} onClose={handleCloseAction} />
                        )}
                    </ModalContent>
                </ModalOverlay>
            )}
        </div>
    );
}

export default DataTable;
