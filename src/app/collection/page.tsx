'use client';

import CollectionGrid from "@/components/games/CollectionGrid";
import CollectionPlatformFilter from "@/components/collection/CollectionPlatformFilter";
import styled from 'styled-components';
import { useState } from 'react';
import { Platform } from '@/types/platform';
import { NAVBAR_HEIGHT } from '@/components/layout/NavbarElements';
import { IoClose, IoFilter } from 'react-icons/io5';
import { SortType } from '@/hooks/useCollectionGames';
import CustomSelect from '@/components/ui/CustomSelect';

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
    justify-content: center;
    top: ${NAVBAR_HEIGHT};
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background: white;
    z-index: 1000;
    margin: 0;
    padding: ${props => props.isOpen ? '2rem' : '0'};
  }
`;

const CloseFiltersButton = styled.button`
  display: none;

  @media (max-width: 568px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px 16px;
    background-color: var(--app-yellow);
    border: none;
    cursor: pointer;
    color: var(--dark-grey);
    font-weight: bold;
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
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>("YEAR_DESC");

  const sortOptions = [
    { value: 'TITLE_ASC', label: 'Título (A-Z)' },
    { value: 'TITLE_DESC', label: 'Título (Z-A)' },
    { value: 'YEAR_ASC', label: 'Año (Ascendente)' },
    { value: 'YEAR_DESC', label: 'Año (Descendente)' }
  ];

  const handlePlatformsChange = (platforms: Platform[]) => {
    setSelectedPlatforms(platforms);
  };

  const handleSortChange = (value: string) => {
    setSortType(value as SortType);
  };

  return (
    <PageContainer>
      <Title>Colección de Juegos</Title>

      <Controls>
        <FiltersButton onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}>
          Filtros <IoFilter size={18} />
        </FiltersButton>
        <ControlsRight>
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
          <CollectionPlatformFilter
            onPlatformsChange={handlePlatformsChange}
            selectedPlatforms={selectedPlatforms}
          />
        </FiltersPanel>

        <CollectionGrid
          selectedPlatformIds={selectedPlatforms.map(p => p.id)}
          sortType={sortType}
        />
      </ContentWrapper>
    </PageContainer>
  );
}