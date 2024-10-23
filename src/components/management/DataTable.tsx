import React, { useState, useEffect, useCallback } from 'react';
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
    ButtonDataTable,
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
    GalleryButtonDataTable,
    CreateButtonDataTable,
    DataTableButtonsContainer,
    SortIconComponent,
    ThContent
} from './DataTableElements';
import { getImageUrl } from '@/services/api';
import { Game } from '@/types/game';
import CoverImageModal from '@/components/ui/CoverImageModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useGame } from '@/hooks/useGame';

// Importaciones dinámicas para los componentes de juegos
import ViewGameForm from '@/components/games/ViewGameForm';
import EditGameForm from '@/components/games/EditGameForm';
import GameGalleryModal from '@/components/games/GameGalleryModal';
import CreateGameForm from '@/components/games/CreateGameForm';
import { useGames } from '@/hooks/useGames';
import { BaseFilter, FilterPackage } from '@/types/filters';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const NO_IMAGE_URL = `${API_BASE_URL}/uploads/resources/no-image.jpg`;

interface DataTableProps<T extends { id: number }, F extends BaseFilter> {
    columns: Column<T>[];
    endpoint: string;
    initialParams?: Partial<DataTableParams<T>>;
    title?: string;
    form: 'game' | 'platform' | 'otherType';
    filterPackage: FilterPackage<T, F>;
}

type FormType = 'game' | 'platform' | 'otherType';

type ItemType<F extends FormType> =
    F extends 'game' ? Game :
    never;

interface ComponentProps<F extends FormType> {
    item: ItemType<F>;
    onClose: () => void;
}

interface Option {
    id: number;
    name: string;
    code: string;
}

function DataTable<T extends { id: number }, F extends BaseFilter>({
    columns,
    endpoint,
    initialParams = {},
    title,
    form,
    filterPackage,
}: DataTableProps<T, F>) {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [actionType, setActionType] = useState<'view' | 'edit' | 'delete' | null>(null);
    const [showGallery, setShowGallery] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { genres, platforms, developers } = useGames();
    const [filters, setFilters] = useState<F>((filterPackage?.filters || {}) as F);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        itemToDelete: null as T | null,
    });
    const { deleteGame } = useGame(deleteConfirmation.itemToDelete?.id.toString() || '');

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

    const refreshDataAndResetPage = useCallback(() => {
        refreshData({ page: 1 });
    }, [refreshData]);

    useEffect(() => {
        if (shouldRefresh) {
            refreshDataAndResetPage();
            setShouldRefresh(false);
        }
    }, [shouldRefresh, refreshDataAndResetPage]);

    const handleViewCover = (game: Game) => {
        setSelectedGame(game);
    };

    const handleCoverUpdated = () => {
        setShouldRefresh(true);
    };

    const handleAction = (item: T, type: 'view' | 'edit' | 'delete') => {
        if (type === 'delete') {
            setDeleteConfirmation({ isOpen: true, itemToDelete: item });
        } else {
            setSelectedItem(item);
            setActionType(type);
        }
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirmation.itemToDelete) {
            try {
                await deleteGame();
                refreshDataAndResetPage();
            } catch (error) {
                console.error('Error al eliminar el elemento:', error);
            } finally {
                setDeleteConfirmation({ isOpen: false, itemToDelete: null });
            }
        }
    };

    const handleCloseAction = useCallback(() => {
        setSelectedItem(null);
        setActionType(null);
        refreshDataAndResetPage();
    }, [refreshDataAndResetPage]);

    const handleGalleryAction = (item: T) => {
        setSelectedItem(item);
        setShowGallery(true);
        setActionType(null);
    };

    const handleCloseGallery = () => {
        setSelectedItem(null);
        setShowGallery(false);
    };

    const handleCreate = () => {
        switch (form) {
            case 'game':
                setShowCreateModal(true);
                break;
            case 'otherType':
                break;
            default:
                console.error('Tipo de formulario no reconocido');
        }
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleItemCreated = useCallback(() => {
        refreshDataAndResetPage();
        setShowCreateModal(false);
    }, [refreshDataAndResetPage]);

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
                    <DeleteButtonDataTable
                        onClick={() => setDeleteConfirmation({ isOpen: true, itemToDelete: item })}
                        title="Borrar"
                    />
                    <GalleryButtonDataTable onClick={() => handleGalleryAction(item)} title="Galería" />
                </ActionsContainer>
            ),
        },
    ];

    // Determinar los componentes a utilizar basados en el prop 'form'
    let ViewComponent: React.ComponentType<ComponentProps<typeof form>> | null = null;
    let EditComponent: React.ComponentType<ComponentProps<typeof form>> | null = null;

    switch (form) {
        case 'game':
            ViewComponent = ViewGameForm as React.ComponentType<ComponentProps<'game'>>;
            EditComponent = EditGameForm as React.ComponentType<ComponentProps<'game'>>;
            break;
        default:
            break;
    }

    const renderComponent = (Component: React.ComponentType<ComponentProps<typeof form>> | null, item: T) => {
        if (Component) {
            return <Component item={item as unknown as ItemType<typeof form>} onClose={handleCloseAction} />;
        }
        return null;
    };

    const genresOptions: Option[] = genres.map(g => ({ id: g.id, name: g.name, code: g.id.toString() }));
    const platformsOptions: Option[] = platforms.map(p => ({ id: p.id, name: p.name, code: p.id.toString() }));
    const developersOptions: Option[] = developers.map(d => ({ id: d.id, name: d.name, code: d.id.toString() }));

    const handleFilterChange = useCallback((key: keyof F, value: any) => {
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters, [key]: value };
            refreshData({
                page: 1,
                filters: updatedFilters
            });
            return updatedFilters;
        });
    }, [refreshData]);

    const getItemIdentifier = (item: T | null): string => {
        if (!item) return '';
        // Intenta usar 'title' si existe, de lo contrario usa 'id'
        return (item as any).title || `ID: ${item.id}`;
    };

    return (
        <div style={{ position: 'relative' }}>
            {title && (
                <TitleContainer>
                    <TableTitle>{title}</TableTitle>
                    <DataTableButtonsContainer>
                        {filterPackage && Object.keys(filterPackage.filters).map((key) => (
                            filterPackage.renderFilter(
                                key as keyof F,
                                filters[key as keyof F],
                                (key, value) => handleFilterChange(key as keyof F, value)
                            )
                        ))}
                        <CreateButtonDataTable onClick={handleCreate} />
                        <RefreshButton onClick={refreshDataAndResetPage} />
                    </DataTableButtonsContainer>
                </TitleContainer>
            )}
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            {columnsWithActions.map((column) => (
                                <Th
                                    key={String(column.key)}
                                    onClick={() => column.sortable && handleSortChange(column.key, params.sortField === column.key ? (params.sortOrder === 'asc' ? 'desc' : 'asc') : 'asc')}
                                    sortable={column.sortable}
                                >
                                    <ThContent>
                                        {column.label}
                                    </ThContent>
                                    {column.sortable && (
                                        <SortIconComponent
                                            active={params.sortField === column.key}
                                            direction={params.sortField === column.key ? params.sortOrder : null}
                                        />
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
                <ButtonDataTable onClick={() => handlePageChange(params.page - 1)} disabled={params.page === 1}>
                    Anterior
                </ButtonDataTable>
                <span>
                    Página {params.page} de {totalPages} |
                    Mostrando {Math.min(params.limit, data.length)} de {totalItems} registros
                </span>
                <ButtonDataTable onClick={() => handlePageChange(params.page + 1)} disabled={params.page === totalPages}>
                    Siguiente
                </ButtonDataTable>
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

            {/* Modal para la creación de un nuevo juego */}
            {showCreateModal && form === 'game' && (
                <ModalOverlay>
                    <CreateGameForm
                        onClose={handleCloseCreateModal}
                        onGameCreated={handleItemCreated}
                        genres={genresOptions}
                        platforms={platformsOptions}
                        developers={developersOptions}
                    />
                </ModalOverlay>
            )}

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, itemToDelete: null })}
                onConfirm={handleDeleteConfirm}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar el elemento "${getItemIdentifier(deleteConfirmation.itemToDelete)}"?`}
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
            />
        </div>
    );
}

export default DataTable;
