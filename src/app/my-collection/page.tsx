'use client';

import { useState, useEffect } from 'react';
import { IoFilter, IoClose, IoCloseCircleOutline } from 'react-icons/io5';
import { Platform } from '@/types/platform';
import { Developer, Genre } from "@/types/game";
import { MyCollectionSortType } from '@/types/collection';
import { useAuth } from '@/contexts/AuthContext';
import { DateFormat } from '@/types/date';
import { CompleteStatus } from '@/types/collection';

import CollectionPlatformFilter from "@/components/collection/CollectionPlatformFilter";
import CollectionGenreFilter from "@/components/collection/CollectionGenreFilter";
import CollectionDeveloperFilter from "@/components/collection/CollectionDeveloperFilter";
import CollectionYearFilter from "@/components/collection/CollectionYearFilter";
import FilterChip from '@/components/collection/FilterChip';
import CustomSelect from '@/components/ui/CustomSelect';
import FilterInput from '@/components/ui/FilterInput';
import CollectionCompleteFilter from "@/components/collection/CollectionCompleteFilter";
import CollectionRatingFilter from "@/components/collection/CollectionRatingFilter";
import CollectionStatusGameFilter from "@/components/collection/CollectionStatusGameFilter";
import CollectionAddedAtRangeFilter from "@/components/collection/CollectionAddedAtRangeFilter";

import {
  TitleBar,
  Title,
  PageContainer,
  Controls,
  ControlsTop,
  FiltersButton,
  FiltersPanel,
  CollectionFiltersContainer,
  CloseFiltersButton,
  ContentWrapper,
  ControlsRight,
  FiltersSection,
  ChipsContainer,
  ClearFiltersButton,
  CentralContent
} from '@/components/collection/CollectionElements';

import { formatDate } from '@/helpers/dateFormatter';

export default function MyCollectionPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [sortType, setSortType] = useState<MyCollectionSortType>(MyCollectionSortType.YEAR_DESC);
  const [yearRange, setYearRange] = useState<{ start: number | null; end: number | null } | null>(null);
  const [completeStatus, setCompleteStatus] = useState<CompleteStatus>(CompleteStatus.ALL);
  const [ratingRange, setRatingRange] = useState<{ start: number; end: number }>({ start: 0, end: 5 });
  const [statusRange, setStatusRange] = useState<{ start: number; end: number }>({ start: 0, end: 10 });
  const [addedAtRange, setAddedAtRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null
  });
  const [dateFormat, setDateFormat] = useState<DateFormat>(DateFormat.SHORT);
  const { isAuthenticated } = useAuth();

  const sortOptions = [
    { value: MyCollectionSortType.TITLE_ASC, label: 'Título (A-Z)' },
    { value: MyCollectionSortType.TITLE_DESC, label: 'Título (Z-A)' },
    { value: MyCollectionSortType.YEAR_ASC, label: 'Año (Ascendente)' },
    { value: MyCollectionSortType.YEAR_DESC, label: 'Año (Descendente)' },
    { value: MyCollectionSortType.RATING_ASC, label: 'Valoración (Menor a Mayor)' },
    { value: MyCollectionSortType.RATING_DESC, label: 'Valoración (Mayor a Menor)' },
    { value: MyCollectionSortType.STATUS_ASC, label: 'Estado (Menor a Mayor)' },
    { value: MyCollectionSortType.STATUS_DESC, label: 'Estado (Mayor a Menor)' },
    { value: MyCollectionSortType.ADDED_ASC, label: 'Fecha añadido (Más antiguo)' },
    { value: MyCollectionSortType.ADDED_DESC, label: 'Fecha añadido (Más reciente)' }
  ];

  const hasValidDateRange = (range: { start: string | null; end: string | null }) => {
    return range.start !== null && range.end !== null;
  };

  useEffect(() => {
    const filters = {
      platforms: selectedPlatforms,
      genres: selectedGenres,
      developers: selectedDevelopers,
      search: searchTerm,
      yearRange,
      sortType,
      complete: completeStatus,
      ratingRange,
      statusRange,
      ...(hasValidDateRange(addedAtRange) && { addedAtRange })
    };

    console.log('Filtros actuales:', filters);
  }, [selectedPlatforms, selectedGenres, selectedDevelopers, searchTerm, yearRange,
    sortType, completeStatus, ratingRange, statusRange, addedAtRange]);

  const handlePlatformsChange = (platforms: Platform[]) => {
    setSelectedPlatforms(platforms);
  };

  const handleGenresChange = (genres: Genre[]) => {
    setSelectedGenres(genres);
  };

  const handleDevelopersChange = (developers: Developer[]) => {
    setSelectedDevelopers(developers);
  };

  const handleSortChange = (value: string) => {
    setSortType(value as MyCollectionSortType);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleYearRangeChange = (range: { start: number | null; end: number | null } | null) => {
    setYearRange(range);
  };

  const handleRemovePlatform = (platformId: number) => {
    setSelectedPlatforms(prev => prev.filter(p => p.id !== platformId));
  };

  const handleRemoveGenre = (genreId: number) => {
    setSelectedGenres(prev => prev.filter(g => g.id !== genreId));
  };

  const handleRemoveDeveloper = (developerId: number) => {
    setSelectedDevelopers(prev => prev.filter(d => d.id !== developerId));
  };

  const handleRemoveYearRange = () => {
    setYearRange(null);
  };

  const handleCompleteChange = (value: CompleteStatus) => {
    setCompleteStatus(value);
  };

  const handleRatingRangeChange = (range: { start: number; end: number }) => {
    setRatingRange(range);
  };

  const handleStatusRangeChange = (range: { start: number; end: number }) => {
    setStatusRange(range);
  };

  const handleRemoveComplete = () => {
    setCompleteStatus(CompleteStatus.ALL);
  };

  const handleRemoveRatingRange = () => {
    setRatingRange({ start: 0, end: 5 });
  };

  const handleRemoveStatusRange = () => {
    setStatusRange({ start: 0, end: 10 });
  };

  const handleAddedAtRangeChange = (range: { start: string | null; end: string | null }) => {
    setAddedAtRange(range);
  };

  const handleRemoveAddedAtRange = () => {
    setAddedAtRange({
      start: null,
      end: null
    });
  };

  const handleClearAllFilters = () => {
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setSelectedDevelopers([]);
    setYearRange(null);
    setSearchTerm('');
    setCompleteStatus(CompleteStatus.ALL);
    setRatingRange({ start: 0, end: 5 });
    setStatusRange({ start: 0, end: 10 });
    setAddedAtRange({
      start: null,
      end: null
    });
  };

  const hasActiveFilters = selectedPlatforms.length > 0 ||
    selectedGenres.length > 0 ||
    selectedDevelopers.length > 0 ||
    (yearRange?.start && yearRange?.end) ||
    searchTerm.length > 0 ||
    completeStatus !== CompleteStatus.ALL ||
    (ratingRange.start > 0 || ratingRange.end < 5) ||
    (statusRange.start > 0 || statusRange.end < 10) ||
    hasValidDateRange(addedAtRange);

  return (
    <PageContainer>
      <TitleBar>
        <Title>Mi colección de Juegos</Title>
      </TitleBar>

      <Controls>
        <ControlsTop>
          <FiltersSection>
            <FiltersButton onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}>
              Filtros <IoFilter size={18} />
            </FiltersButton>
            {hasActiveFilters && (
              <ClearFiltersButton onClick={handleClearAllFilters}>
                Limpiar todo <IoCloseCircleOutline size={16} />
              </ClearFiltersButton>
            )}
          </FiltersSection>
          <ControlsRight>
            <FilterInput
              label="Buscar juego"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <CustomSelect
              options={sortOptions}
              value={sortType}
              onChange={handleSortChange}
              placeholder="Ordenar por..."
            />
          </ControlsRight>
        </ControlsTop>

        <ChipsContainer>
          {selectedPlatforms.map(platform => (
            <FilterChip
              key={`platform-${platform.id}`}
              label={platform.name}
              onRemove={() => handleRemovePlatform(platform.id)}
            />
          ))}
          {selectedGenres.map(genre => (
            <FilterChip
              key={`genre-${genre.id}`}
              label={genre.name}
              onRemove={() => handleRemoveGenre(genre.id)}
            />
          ))}
          {selectedDevelopers.map(developer => (
            <FilterChip
              key={`developer-${developer.id}`}
              label={developer.name}
              onRemove={() => handleRemoveDeveloper(developer.id)}
            />
          ))}
          {yearRange?.start && yearRange?.end && (
            <FilterChip
              label={`${yearRange.start} - ${yearRange.end}`}
              onRemove={handleRemoveYearRange}
            />
          )}
          {completeStatus !== CompleteStatus.ALL && (
            <FilterChip
              label={completeStatus === CompleteStatus.COMPLETE ?
                "Juegos completos" :
                "Juegos incompletos"
              }
              onRemove={handleRemoveComplete}
            />
          )}
          {(ratingRange.start > 0 || ratingRange.end < 5) && (
            <FilterChip
              label={`${ratingRange.start} - ${ratingRange.end} estrellas`}
              onRemove={handleRemoveRatingRange}
            />
          )}
          {(statusRange.start > 0 || statusRange.end < 10) && (
            <FilterChip
              label={`Estado: ${statusRange.start} - ${statusRange.end}`}
              onRemove={handleRemoveStatusRange}
            />
          )}
          {hasValidDateRange(addedAtRange) && (
            <FilterChip
              label={`Añadido: ${formatDate(addedAtRange.start, { format: dateFormat })} - ${formatDate(addedAtRange.end, { format: dateFormat })}`}
              onRemove={() => setAddedAtRange({ start: null, end: null })}
            />
          )}
        </ChipsContainer>
      </Controls>

      <ContentWrapper>
        <FiltersPanel isOpen={isFiltersPanelOpen}>
          <CloseFiltersButton onClick={() => setIsFiltersPanelOpen(false)}>
            <IoClose size={20} />
          </CloseFiltersButton>
          <CollectionFiltersContainer>
            <CollectionCompleteFilter
              value={completeStatus}
              onChange={handleCompleteChange}
            />
            <CollectionRatingFilter
              value={ratingRange}
              onChange={handleRatingRangeChange}
            />
            <CollectionStatusGameFilter
              value={statusRange}
              onChange={handleStatusRangeChange}
            />
            <CollectionAddedAtRangeFilter
              value={addedAtRange}
              onChange={handleAddedAtRangeChange}
              dateFormat={dateFormat}
            />
            <CollectionYearFilter
              value={yearRange}
              onChange={handleYearRangeChange}
            />
            <CollectionPlatformFilter
              onPlatformsChange={handlePlatformsChange}
              selectedPlatforms={selectedPlatforms}
            />
            <CollectionGenreFilter
              onGenresChange={handleGenresChange}
              selectedGenres={selectedGenres}
            />
            <CollectionDeveloperFilter
              onDevelopersChange={handleDevelopersChange}
              selectedDevelopers={selectedDevelopers}
            />
          </CollectionFiltersContainer>
        </FiltersPanel>

        <CentralContent>
          Colección
        </CentralContent>
      </ContentWrapper>
    </PageContainer>
  );
}