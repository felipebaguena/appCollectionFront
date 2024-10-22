import React, { useState, useEffect } from 'react';
import { useDataTable } from '@/hooks/useDataTable';
import { Column, DataTableParams } from '@/types/dataTable';
import {
    Table,
    Th,
    StyledTd,
    ActionsTd,
    CellContent,
    CoverThumbnail,
    PaginationContainer,
    Button,
    TableContainer,
    TableTitle,
    TitleContainer,
    RefreshButton,
    ModalOverlay,
    ModalContent,
    ActionsContainer,
    ViewButtonDataTable,
    EditButtonDataTable,
    DeleteButtonDataTable,
    GalleryButtonDataTable
} from './DataTableElements';
import { getImageUrl } from '@/services/api';
import { Game } from '@/types/game';
import CoverImageModal from '@/components/ui/CoverImageModal';

// Importaciones dinámicas para los componentes de juegos
import ViewGameForm from '@/components/games/ViewGameForm';
import EditGameForm from '@/components/games/EditGameForm';
import DeleteGameConfirmation from '@/components/games/DeleteGameConfirmation';
import GameGalleryModal from '@/components/games/GameGalleryModal';

// ... (otras importaciones que puedas necesitar para otros tipos de formularios)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const NO_IMAGE_URL = `${API_BASE_URL}/uploads/resources/no-image.jpg`;

interface DataTableProps<T> {
    columns: Column<T>[];
    endpoint: string;
    initialParams?: Partial<DataTableParams<T>>;
    title?: string;
    form: 'game' | 'otherType';
}

type FormType = 'game' | 'otherType';

type ItemType<F extends FormType> =
    F extends 'game' ? Game :
    never;

interface ComponentProps<F extends FormType> {
    item: ItemType<F>;
    onClose: () => void;
}

function DataTable<T extends { id: number }>({
    columns,
    endpoint,
    initialParams = {},
    title,
    form
}: DataTableProps<T>) {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [actionType, setActionType] = useState<'view' | 'edit' | 'delete' | null>(null);
    const [showGallery, setShowGallery] = useState(false);
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

    const handleGalleryAction = (item: T) => {
        setSelectedItem(item);
        setShowGallery(true);
        setActionType(null);
    };

    const handleCloseGallery = () => {
        setSelectedItem(null);
        setShowGallery(false);
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
                <ActionsContainer>
                    {ViewComponent && (
                        <ViewButtonDataTable onClick={() => handleAction(item, 'view')} title="Ver" />
                    )}
                    {EditComponent && (
                        <EditButtonDataTable onClick={() => handleAction(item, 'edit')} title="Editar" />
                    )}
                    {DeleteComponent && (
                        <DeleteButtonDataTable onClick={() => handleAction(item, 'delete')} title="Borrar" />
                    )}
                    <GalleryButtonDataTable onClick={() => handleGalleryAction(item)} title="Galería" />
                </ActionsContainer>
            ),
        },
    ];

    // Determinar los componentes a utilizar basados en el prop 'form'
    let ViewComponent: React.ComponentType<ComponentProps<typeof form>> | null = null;
    let EditComponent: React.ComponentType<ComponentProps<typeof form>> | null = null;
    let DeleteComponent: React.ComponentType<ComponentProps<typeof form>> | null = null;

    switch (form) {
        case 'game':
            ViewComponent = ViewGameForm as React.ComponentType<ComponentProps<'game'>>;
            EditComponent = EditGameForm as React.ComponentType<ComponentProps<'game'>>;
            DeleteComponent = DeleteGameConfirmation as React.ComponentType<ComponentProps<'game'>>;
            break;
        // Añade más casos aquí para otros tipos de formularios
        default:
            // Componentes por defecto o manejo de error
            break;
    }

    const renderComponent = (Component: React.ComponentType<ComponentProps<typeof form>> | null, item: T) => {
        if (Component) {
            return <Component item={item as unknown as ItemType<typeof form>} onClose={handleCloseAction} />;
        }
        return null;
    };

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
                                    column.key === 'actions' ? (
                                        <ActionsTd key={String(column.key)}>
                                            <CellContent>
                                                {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                                            </CellContent>
                                        </ActionsTd>
                                    ) : (
                                        <StyledTd key={String(column.key)}>
                                            <CellContent>
                                                {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                                            </CellContent>
                                        </StyledTd>
                                    )
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

            {(selectedItem || showGallery) && (
                <ModalOverlay>
                    {selectedItem && actionType && (
                        <ModalContent>
                            {actionType === 'view' && renderComponent(ViewComponent, selectedItem)}
                            {actionType === 'edit' && renderComponent(EditComponent, selectedItem)}
                            {actionType === 'delete' && renderComponent(DeleteComponent, selectedItem)}
                        </ModalContent>
                    )}
                    {showGallery && selectedItem && (
                        <GameGalleryModal
                            isOpen={showGallery}
                            onClose={handleCloseGallery}
                            game={selectedItem as unknown as Game}
                            getImageUrl={getImageUrl}
                        />
                    )}
                </ModalOverlay>
            )}
        </div>
    );
}

export default DataTable;
