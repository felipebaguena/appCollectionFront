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
      sortType
    });
  }, [selectedPlatforms, selectedGenres, selectedDevelopers, searchTerm, yearRange, sortType]);

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

  const hasActiveFilters = selectedPlatforms.length > 0 ||
    selectedGenres.length > 0 ||
    selectedDevelopers.length > 0 ||
    (yearRange?.start && yearRange?.end) ||
    searchTerm.length > 0;

  const handleClearAllFilters = () => {
    setSelectedPlatforms([]);
    setSelectedGenres([]);
    setSelectedDevelopers([]);
    setYearRange(null);
    setSearchTerm('');
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
        </ChipsContainer>
      </Controls>

      <ContentWrapper>
        <FiltersPanel isOpen={isFiltersPanelOpen}>
          <CloseFiltersButton onClick={() => setIsFiltersPanelOpen(false)}>
            <IoClose size={20} />
          </CloseFiltersButton>
          <CollectionFiltersContainer>
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