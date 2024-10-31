'use client';

import CollectionPlatformFilter from "@/components/collection/CollectionPlatformFilter";
import styled from 'styled-components';
import { useState } from 'react';
import { Platform } from '@/types/platform';
import { NAVBAR_HEIGHT } from '@/components/layout/NavbarElements';
import { IoClose, IoFilter, IoCloseCircleOutline } from 'react-icons/io5';
import { SortType } from '@/hooks/useCollectionGames';
import CustomSelect from '@/components/ui/CustomSelect';
import CollectionGenreFilter from "@/components/collection/CollectionGenreFilter";
import { Developer, Genre } from "@/types/game";
import CollectionGrid from "@/components/collection/CollectionGrid";
import CollectionDeveloperFilter from "@/components/collection/CollectionDeveloperFilter";
import FilterInput from '@/components/ui/FilterInput';
import CollectionYearFilter from "@/components/collection/CollectionYearFilter";
import FilterChip from '@/components/collection/FilterChip';

const TitleBar = styled.div`
  background-color: var(--app-yellow);
  padding: 0.8rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: var(--dark-grey);
  text-align: center;
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 20px 20px 5px 20px;

  @media (max-width: 568px) {
    gap: 0.8rem;
  }
`;

const ControlsTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 568px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }
`;

const FiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--dark-grey);
  font-weight: bold;
  font-size: 1rem;
  margin-right: auto;
`;

const FiltersPanel = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? 'auto' : '0'};
  min-width: ${props => props.isOpen ? 'auto' : '0'};
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  padding: ${props => props.isOpen ? '20px' : '0'};
  margin-top: 20px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};

  @media (max-width: 568px) {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: ${NAVBAR_HEIGHT};
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - ${NAVBAR_HEIGHT});
    background: white;
    z-index: 1000;
    margin: 0;
    overflow-y: auto;
  }
`;

const CollectionFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 568px) {
    width: 100%;
    max-width: 15rem;
    margin: 0 auto;
    padding-bottom: 2rem;
  }
`;

const CloseFiltersButton = styled.button`
  display: none;

  @media (max-width: 568px) {
    display: block;
    position: sticky;
    top: 0;
    right: 0;
    padding: 8px 16px;
    background-color: var(--app-yellow);
    border: none;
    cursor: pointer;
    color: var(--dark-grey);
    font-weight: bold;
    margin-left: auto;
    z-index: 1001;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const ControlsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 568px) {
    flex-direction: row;
    gap: 0.8rem;
    width: 100%;
    
    > * {
      flex: 1;
      min-width: 0;
    }
  }
`;

const FiltersSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 568px) {
    justify-content: space-between;
    margin-bottom: 0.5rem;
    width: 100%;
  }
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  min-height: 34px;

  @media (max-width: 768px) {
    gap: 4px;
    font-size: 0.875rem;
  }
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--grey);
  font-size: 0.875rem;

  &:hover {
    color: var(--dark-grey);
  }

  @media (max-width: 568px) {
    font-size: 0.8rem;
    margin-left: 0;
  }
`;

export default function CollectionPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>("YEAR_DESC");
  const [yearRange, setYearRange] = useState<{ start: number | null; end: number | null } | null>(null);

  const sortOptions = [
    { value: 'TITLE_ASC', label: 'Título (A-Z)' },
    { value: 'TITLE_DESC', label: 'Título (Z-A)' },
    { value: 'YEAR_ASC', label: 'Año (Ascendente)' },
    { value: 'YEAR_DESC', label: 'Año (Descendente)' }
  ];

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
        <Title>Nuestra colección de Juegos</Title>
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

        <CollectionGrid
          selectedPlatformIds={selectedPlatforms.map(p => p.id)}
          selectedGenreIds={selectedGenres.map(g => g.id)}
          selectedDeveloperIds={selectedDevelopers.map(d => d.id)}
          searchTerm={searchTerm}
          yearRange={yearRange}
          sortType={sortType}
        />
      </ContentWrapper>
    </PageContainer>
  );
}