'use client';

import CollectionPlatformFilter from "@/components/collection/CollectionPlatformFilter";
import styled from 'styled-components';
import { useState } from 'react';
import { Platform } from '@/types/platform';
import { NAVBAR_HEIGHT } from '@/components/layout/NavbarElements';
import { IoClose, IoFilter } from 'react-icons/io5';
import { SortType } from '@/hooks/useCollectionGames';
import CustomSelect from '@/components/ui/CustomSelect';
import CollectionGenreFilter from "@/components/collection/CollectionGenreFilter";
import { Developer, Genre } from "@/types/game";
import CollectionGrid from "@/components/collection/CollectionGrid";
import CollectionDeveloperFilter from "@/components/collection/CollectionDeveloperFilter";
import FilterInput from '@/components/ui/FilterInput';
import CollectionYearFilter from "@/components/collection/CollectionYearFilter";

const Title = styled.h1`
  color: var(--dark-grey);
  text-align: center;
  margin: 1rem 0 1rem 0;
`;

const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
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

  return (
    <PageContainer>
      <Title>Colección de Juegos</Title>

      <Controls>
        <FiltersButton onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}>
          Filtros <IoFilter size={18} />
        </FiltersButton>
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