import React, { useState, useEffect, useCallback } from 'react';
import { useDataTable } from '@/hooks/useDataTable';
import { Column, DataTableParams } from '@/types/dataTable';
import {
    Th,
    StyledTd,
    ActionsTd,
    CellContent,
    CoverThumbnail,
    ButtonDataTable,
    TableTitle,
    TitleContainer,
    RefreshButton,
    ActionsContainer,
    ViewButtonDataTable,
    EditButtonDataTable,
    DeleteButtonDataTable,
    GalleryButtonDataTable,
    CreateButtonDataTable,
    SortIconComponent,
    ThContent,
    DataTableContainer,
    FiltersContainer,
    ResponsiveTable,
    ResponsiveContainer,
    ResponsivePaginationContainer,
    ResponsiveActionsContainer,
    FiltersSection,
    ButtonsSection,
    FilterButton,
    FilterLabel,
    CompactFilterGroup,
    ScheduleButtonDataTable,
    PublishButtonDataTable,
    UnpublishButtonDataTable,
} from './DataTableElements';

// Next imports
import { useRouter } from 'next/navigation';

// Types
import { Game } from '@/types/game';
import { Article } from '@/types/article';
import { BaseFilter, FilterPackage } from '@/types/filters';

// Services
import { getImageUrl } from '@/services/api';

// Hooks
import { useGame } from '@/hooks/useGame';
import { useGames } from '@/hooks/useGames';
import { usePlatforms } from '@/hooks/usePlatforms';
import { usePlatform } from '@/hooks/usePlatform';
import { useGenre } from '@/hooks/useGenre';
import { useDeveloper } from '@/hooks/useDeveloper';
import { useArticle } from '@/hooks/useArticle';

// UI Components
import CoverImageModal from '@/components/ui/CoverImageModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

// Game Components
import ViewGameForm from '@/components/games/ViewGameForm';
import EditGameForm from '@/components/games/EditGameForm';
import GameGalleryModal from '@/components/games/GameGalleryModal';
import CreateGameForm from '@/components/games/CreateGameForm';

// Platform Components
import CreatePlatformForm from '@/components/platforms/CreatePlatformForm';
import EditPlatformForm from '@/components/platforms/EditPlatformForm';

// Genre Components
import EditGenreForm from '@/components/genres/EditGenreForm';
import CreateGenreForm from '@/components/genres/CreateGenreForm';

// Developer Components
import EditDeveloperForm from '@/components/developers/EditDeveloperForm';
import CreateDeveloperForm from '@/components/developers/CreateDeveloperForm';

// Article Components
import CreateArticleForm from '@/components/articles/CreateArticleForm';
import ArticleGalleryModal from '@/components/articles/ArticleGalleryModal';
import CoverArticleModal from '@/components/articles/CoverArticleModal';
import EditArticleForm from '@/components/articles/EditArticleForm';
import ScheduleArticleForm from '../articles/ScheduleArticleForm';
import PublishActionsArticleForm from '../articles/PublishActionsArticleForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const NO_IMAGE_URL = `${API_BASE_URL}/uploads/resources/no-image.jpg`;

interface DataTableProps<T extends { id: number }, F extends BaseFilter> {
    columns: Column<T>[];
    endpoint: string;
    initialParams?: Partial<DataTableParams<T>>;
    title?: string;
    form: 'game' | 'platform' | 'genre' | 'developer' | 'article' | 'otherType';
    filterPackage: FilterPackage<T, F>;
    breakpoint?: number;
}

type FormType = 'game' | 'platform' | 'genre' | 'developer' | 'article' | 'otherType';

type ItemType<F extends FormType> =
    F extends 'game' ? Game :
    F extends 'article' ? Article :
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
    breakpoint = 768,
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
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showPublishActions, setShowPublishActions] = useState(false);

    const deleteItemId = deleteConfirmation.itemToDelete?.id.toString() || '';
    const { deleteGame } = form === 'game' ? useGame(deleteItemId) : { deleteGame: null };
    const { deleteArticle } = form === 'article' ? useArticle(deleteItemId) : { deleteArticle: null };
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
            refreshData({ ...params });
            setShouldRefresh(false);
        }
    }, [shouldRefresh, refreshData, params]);

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
                        if (deleteGame) await deleteGame();
                        break;
                    case 'article':
                        if (deleteArticle) await deleteArticle();
                        break;
                    case 'platform':
                        if (deletePlatform) await deletePlatform();
                        break;
                    case 'genre':
                        if (deleteGenre) await deleteGenre();
                        break;
                    case 'developer':
                        if (deleteDeveloper) await deleteDeveloper();
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

    const router = useRouter();

    const handleCreate = () => {
        if (form === 'article') {
            router.push('/articles');
        } else {
            setShowCreateModal(true);
        }
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

        if (form === 'article') {
            const article = item as unknown as Article;

            buttons.push(
                <ViewButtonDataTable
                    key="view"
                    onClick={() => router.push(`/articles/${item.id}`)}
                    title="Ver artículo"
                />
            );

            if (!article.published) {
                buttons.push(
                    <ScheduleButtonDataTable
                        key="schedule"
                        onClick={() => handleScheduleAction(item)}
                        title="Programar artículo"
                    />,
                    <PublishButtonDataTable
                        key="publish"
                        onClick={() => handlePublishAction(item)}
                        title="Publicar artículo"
                    />
                );
            } else {
                buttons.push(
                    <UnpublishButtonDataTable
                        key="unpublish"
                        onClick={() => handlePublishAction(item)}
                        title="Despublicar artículo"
                    />
                );
            }

            buttons.push(
                <EditButtonDataTable
                    key="edit"
                    onClick={() => handleAction(item, 'edit')}
                    title="Editar"
                />,
                <DeleteButtonDataTable
                    key="delete"
                    onClick={() => setDeleteConfirmation({ isOpen: true, itemToDelete: item })}
                    title="Borrar"
                />,
                <GalleryButtonDataTable
                    key="gallery"
                    onClick={() => handleGalleryAction(item)}
                    title="Galería"
                />
            );
        } else if (form === 'platform' || form === 'genre' || form === 'developer') {
            buttons.push(
                <EditButtonDataTable
                    key="edit"
                    onClick={() => handleAction(item, 'edit')}
                    title="Editar"
                />,
                <DeleteButtonDataTable
                    key="delete"
                    onClick={() => setDeleteConfirmation({ isOpen: true, itemToDelete: item })}
                    title="Borrar"
                />
            );
        } else if (form === 'game' && ViewComponent) {
            buttons.push(
                <ViewButtonDataTable
                    key="view"
                    onClick={() => handleAction(item, 'view')}
                    title="Ver"
                />
            );

            if (EditComponent) {
                buttons.push(
                    <EditButtonDataTable
                        key="edit"
                        onClick={() => handleAction(item, 'edit')}
                        title="Editar"
                    />
                );
            }

            buttons.push(
                <DeleteButtonDataTable
                    key="delete"
                    onClick={() => setDeleteConfirmation({ isOpen: true, itemToDelete: item })}
                    title="Borrar"
                />,
                <GalleryButtonDataTable
                    key="gallery"
                    onClick={() => handleGalleryAction(item)}
                    title="Galería"
                />
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
                        if (form === 'game') {
                            const game = item as unknown as Game;
                            const coverImage = game.images.find(img => img.isCover);
                            const imageSrc = coverImage ? getImageUrl(coverImage.path) : NO_IMAGE_URL;
                            return (
                                <CoverThumbnail
                                    style={{ backgroundImage: `url(${imageSrc})` }}
                                    onClick={() => handleViewCover(game)}
                                />
                            );
                        } else if (form === 'article') {
                            const article = item as unknown as Article;
                            const imageSrc = article.coverImage ? getImageUrl(article.coverImage.path) : NO_IMAGE_URL;
                            return (
                                <CoverThumbnail
                                    style={{ backgroundImage: `url(${imageSrc})` }}
                                    onClick={() => handleViewArticleCover(article)}
                                />
                            );
                        }
                        return null;
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
        case 'article':
            EditComponent = EditArticleForm as React.ComponentType<ComponentProps<'article'>>;
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

    // Añadir esta función que verifica si hay algún filtro activo
    const hasActiveFilters = (currentFilters: F): boolean => {
        return Object.entries(currentFilters).some(([_, value]) => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            if (typeof value === 'string') {
                return value !== '';
            }
            if (value === null) {
                return false;
            }
            if (typeof value === 'object') {
                return Object.values(value).some(v => v !== null && v !== undefined);
            }
            return !!value;
        });
    };

    const handleViewArticleCover = (article: Article) => {
        setSelectedArticle(article);
    };

    const handleScheduleAction = (item: T) => {
        setSelectedItem(item);
        setShowSchedule(true);
    };

    const handlePublishAction = (item: T) => {
        setSelectedItem(item);
        setShowPublishActions(true);
    };

    return (
        <DataTableContainer>
            {title && (
                <TitleContainer>
                    <TableTitle>{title}</TableTitle>
                </TitleContainer>
            )}
            <FiltersContainer>
                <FiltersSection>
                    {filterPackage && Object.keys(filterPackage.filters).map((key) => (
                        filterPackage.renderFilter(
                            key as keyof F,
                            filters[key as keyof F],
                            (key, value) => handleFilterChange(key as keyof F, value)
                        )
                    ))}
                    <CompactFilterGroup>
                        <FilterLabel>&nbsp;</FilterLabel>
                        <FilterButton
                            onClick={() => filterPackage.clearFilters?.(handleFilterChange)}
                            $variant="dark"
                            disabled={!hasActiveFilters(filters)}
                        >
                            Limpiar
                        </FilterButton>
                    </CompactFilterGroup>
                </FiltersSection>
                <ButtonsSection>
                    <CreateButtonDataTable onClick={handleCreate} />
                    <RefreshButton onClick={refreshDataAndResetPage} />
                </ButtonsSection>
            </FiltersContainer>
            <ResponsiveContainer $breakpoint={breakpoint}>
                <ResponsiveTable $breakpoint={breakpoint}>
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
                                        <ActionsTd
                                            key={String(column.key)}
                                            data-label={column.label}
                                        >
                                            <CellContent>
                                                <ResponsiveActionsContainer>
                                                    {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                                                </ResponsiveActionsContainer>
                                            </CellContent>
                                        </ActionsTd>
                                    ) : (
                                        <StyledTd
                                            key={String(column.key)}
                                            data-label={column.label}
                                        >
                                            <CellContent>
                                                {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                                            </CellContent>
                                        </StyledTd>
                                    )
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </ResponsiveTable>
            </ResponsiveContainer>
            <ResponsivePaginationContainer $breakpoint={breakpoint}>
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
            </ResponsivePaginationContainer>

            {/* Modal para la imagen de portada */}
            <CoverImageModal
                isOpen={!!selectedGame}
                onClose={() => setSelectedGame(null)}
                game={selectedGame}
                getImageUrl={getImageUrl}
                onCoverUpdated={handleCoverUpdated}
            />

            {/* Modal para la imagen de portada de artículo */}
            <CoverArticleModal
                isOpen={!!selectedArticle}
                onClose={() => setSelectedArticle(null)}
                article={selectedArticle}
                getImageUrl={getImageUrl}
                onCoverUpdated={handleCoverUpdated}
            />

            {selectedItem && actionType === 'view' && renderComponent(ViewComponent, selectedItem)}
            {selectedItem && actionType === 'edit' && renderComponent(EditComponent, selectedItem)}
            {showGallery && selectedItem && (
                <>
                    {form === 'game' && (
                        <GameGalleryModal
                            isOpen={showGallery}
                            onClose={handleCloseGallery}
                            game={selectedItem as unknown as Game}
                            getImageUrl={getImageUrl}
                        />
                    )}
                    {form === 'article' && (
                        <ArticleGalleryModal
                            isOpen={showGallery}
                            onClose={handleCloseGallery}
                            article={selectedItem as unknown as Article}
                            getImageUrl={getImageUrl}
                        />
                    )}
                </>
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
                    {form === 'article' && (
                        <CreateArticleForm
                            onClose={handleCloseCreateModal}
                            onArticleCreated={handleItemCreated}
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

            {showSchedule && selectedItem && (
                <ScheduleArticleForm
                    item={selectedItem as unknown as Article}
                    onClose={() => {
                        setSelectedItem(null);
                        setShowSchedule(false);
                        refreshDataAndResetPage();
                    }}
                />
            )}

            {showPublishActions && selectedItem && (
                <PublishActionsArticleForm
                    item={selectedItem as unknown as Article}
                    onClose={() => {
                        setSelectedItem(null);
                        setShowPublishActions(false);
                        refreshDataAndResetPage();
                    }}
                />
            )}
        </DataTableContainer>
    );
}

export default DataTable;
