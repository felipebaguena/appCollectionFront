'use client';

import { useState, useEffect } from 'react';
import { IoFilter, IoClose, IoCloseCircleOutline } from 'react-icons/io5';
import { Platform } from '@/types/platform';
import { Developer, Genre } from "@/types/game";
import { SortType } from '@/hooks/useCollectionGames';
import { useAuth } from '@/contexts/AuthContext';

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

export default function MyCollectionPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>("YEAR_DESC");
  const [yearRange, setYearRange] = useState<{ start: number | null; end: number | null } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [ratingRange, setRatingRange] = useState<{ start: number; end: number }>({ start: 0, end: 5 });
  const [statusRange, setStatusRange] = useState<{ start: number; end: number }>({ start: 0, end: 10 });
  const { isAuthenticated } = useAuth();

  const sortOptions = [
    { value: 'TITLE_ASC', label: 'Título (A-Z)' },
    { value: 'TITLE_DESC', label: 'Título (Z-A)' },
    { value: 'YEAR_ASC', label: 'Año (Ascendente)' },
    { value: 'YEAR_DESC', label: 'Año (Descendente)' }
  ];

  useEffect(() => {
    console.log('Filtros actuales:', {
      platforms: selectedPlatforms,
      genres: selectedGenres,
      developers: selectedDevelopers,
      search: searchTerm,
      yearRange,
      sortType,
      isComplete,
      ratingRange,
      statusRange
    });
  }, [selectedPlatforms, selectedGenres, selectedDevelopers, searchTerm, yearRange, sortType, isComplete, ratingRange, statusRange]);

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
    setSortType(value as SortType);
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

  const handleCompleteChange = (complete: boolean) => {
    setIsComplete(complete);
  };

  const handleRatingRangeChange = (range: { start: number; end: number }) => {
    setRatingRange(range);
  };

  const handleStatusRangeChange = (range: { start: number; end: number }) => {
    setStatusRange(range);
  };

  const handleRemoveComplete = () => {
    setIsComplete(false);
  };

  const handleRemoveRatingRange = () => {
    setRatingRange({ start: 0, end: 5 });
  };

  const handleRemoveStatusRange = () => {
    setStatusRange({ start: 0, end: 10 });
  };

  const hasActiveFilters = selectedPlatforms.length > 0 ||
    selectedGenres.length > 0 ||
    selectedDevelopers.length > 0 ||
    (yearRange?.start && yearRange?.end) ||
    searchTerm.length > 0 ||
    isComplete ||
    (ratingRange.start > 0 || ratingRange.end < 5) ||
    (statusRange.start > 0 || statusRange.end < 10);

  const handleClearAllFilters = () => {
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setSelectedDevelopers([]);
    setYearRange(null);
    setSearchTerm('');
    setIsComplete(false);
    setRatingRange({ start: 0, end: 5 });
    setStatusRange({ start: 0, end: 10 });
  };

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
          {isComplete && (
            <FilterChip
              label="Juegos completos"
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
        </ChipsContainer>
      </Controls>

      <ContentWrapper>
        <FiltersPanel isOpen={isFiltersPanelOpen}>
          <CloseFiltersButton onClick={() => setIsFiltersPanelOpen(false)}>
            <IoClose size={20} />
          </CloseFiltersButton>
          <CollectionFiltersContainer>
            <CollectionCompleteFilter
              value={isComplete}
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