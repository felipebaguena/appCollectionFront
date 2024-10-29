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
import CreatePlatformForm from '@/components/platforms/CreatePlatformForm';
import { useGames } from '@/hooks/useGames';
import { usePlatforms } from '@/hooks/usePlatforms';
import { BaseFilter, FilterPackage } from '@/types/filters';
import { usePlatform } from '@/hooks/usePlatform';
import EditPlatformForm from '@/components/platforms/EditPlatformForm';
import EditGenreForm from '@/components/genres/EditGenreForm';
import CreateGenreForm from '@/components/genres/CreateGenreForm';
import { useGenre } from '@/hooks/useGenre';
import EditDeveloperForm from '@/components/developers/EditDeveloperForm';
import CreateDeveloperForm from '@/components/developers/CreateDeveloperForm';
import { useDeveloper } from '@/hooks/useDeveloper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const NO_IMAGE_URL = `${API_BASE_URL}/uploads/resources/no-image.jpg`;

interface DataTableProps<T extends { id: number }, F extends BaseFilter> {
    columns: Column<T>[];
    endpoint: string;
    initialParams?: Partial<DataTableParams<T>>;
    title?: string;
    form: 'game' | 'platform' | 'genre' | 'developer' | 'otherType';
    filterPackage: FilterPackage<T, F>;
}

type FormType = 'game' | 'platform' | 'genre' | 'developer' | 'otherType';

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
    const { fetchPlatforms } = usePlatforms();
    const [filters, setFilters] = useState<F>((filterPackage?.filters || {}) as F);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        itemToDelete: null as T | null,
    });

    const deleteItemId = deleteConfirmation.itemToDelete?.id.toString() || '';
    const { deleteGame } = form === 'game' ? useGame(deleteItemId) : { deleteGame: null };
    const { deletePlatform } = form === 'platform' ? usePlatform(deleteItemId) : { deletePlatform: null };
    const { deleteGenre } = form === 'genre' ? useGenre(deleteItemId) : { deleteGenre: null };
    const { deleteDeveloper } = form === 'developer' ? useDeveloper(deleteItemId) : { deleteDeveloper: null };

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
                switch (form) {
                    case 'game':
                        if (deleteGame) {
                            await deleteGame();
                        }
                        break;
                    case 'platform':
                        if (deletePlatform) {
                            await deletePlatform();
                        }
                        break;
                    case 'genre':
                        if (deleteGenre) {
                            await deleteGenre();
                        }
                        break;
                    case 'developer':
                        if (deleteDeveloper) {
                            await deleteDeveloper();
                        }
                        break;
                    default:
                        console.error('Tipo de formulario no reconocido:', form);
                        return;
                }
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
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleItemCreated = useCallback(() => {
        refreshDataAndResetPage();
        setShowCreateModal(false);
        if (form === 'platform') {
            fetchPlatforms();
        }
    }, [refreshDataAndResetPage, form, fetchPlatforms]);

    const getActionButtons = (form: FormType, item: T) => {
        const buttons = [];

        if (ViewComponent) {
            buttons.push(
                <ViewButtonDataTable key="view" onClick={() => handleAction(item, 'view')} title="Ver" />
            );
        }

        if (EditComponent) {
            buttons.push(
                <EditButtonDataTable key="edit" onClick={() => handleAction(item, 'edit')} title="Editar" />
            );
        }

        buttons.push(
            <DeleteButtonDataTable
                key="delete"
                onClick={() => setDeleteConfirmation({ isOpen: true, itemToDelete: item })}
                title="Borrar"
            />
        );

        if (form === 'game') {
            buttons.push(
                <GalleryButtonDataTable key="gallery" onClick={() => handleGalleryAction(item)} title="Galería" />
            );
        }

        return buttons;
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
                    {getActionButtons(form, item)}
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
        case 'platform':
            EditComponent = EditPlatformForm as React.ComponentType<ComponentProps<'platform'>>;
            break;
        case 'genre':
            EditComponent = EditGenreForm as React.ComponentType<ComponentProps<'genre'>>;
            break;
        case 'developer':
            EditComponent = EditDeveloperForm as React.ComponentType<ComponentProps<'developer'>>;
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
        // Intenta usar 'title' si existe, luego 'name', y finalmente 'id'
        return (item as any).title || (item as any).name || `ID: ${item.id}`;
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

            {selectedItem && actionType === 'view' && renderComponent(ViewComponent, selectedItem)}
            {selectedItem && actionType === 'edit' && renderComponent(EditComponent, selectedItem)}
            {showGallery && selectedItem && (
                <GameGalleryModal
                    isOpen={showGallery}
                    onClose={handleCloseGallery}
                    game={selectedItem as unknown as Game}
                    getImageUrl={getImageUrl}
                />
            )}

            {/* Modal para la creación */}
            {showCreateModal && (
                <>
                    {form === 'game' && (
                        <CreateGameForm
                            onClose={handleCloseCreateModal}
                            onGameCreated={handleItemCreated}
                            genres={genresOptions}
                            platforms={platformsOptions}
                            developers={developersOptions}
                        />
                    )}
                    {form === 'platform' && (
                        <CreatePlatformForm
                            onClose={handleCloseCreateModal}
                            onPlatformCreated={handleItemCreated}
                        />
                    )}
                    {form === 'genre' && (
                        <CreateGenreForm
                            onClose={handleCloseCreateModal}
                            onGenreCreated={handleItemCreated}
                        />
                    )}
                    {form === 'developer' && (
                        <CreateDeveloperForm
                            onClose={handleCloseCreateModal}
                            onDeveloperCreated={handleItemCreated}
                        />
                    )}
                </>
            )}

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, itemToDelete: null })}
                onConfirm={handleDeleteConfirm}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar "${getItemIdentifier(deleteConfirmation.itemToDelete)}"?`}
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
            />
        </div>
    );
}

export default DataTable;
