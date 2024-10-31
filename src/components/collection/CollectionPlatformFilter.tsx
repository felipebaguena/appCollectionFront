import React, { useState, useEffect } from 'react';
import { usePlatforms } from '@/hooks/usePlatforms';
import { Platform } from '@/types/platform';
import {
  FilterContainer,
  FilterCard,
  FilterTitle,
  SearchInput,
  ScrollableList,
  FilterItem
} from './CollectionFilterElements';

interface CollectionPlatformFilterProps {
  onPlatformsChange: (platforms: Platform[]) => void;
  selectedPlatforms: Platform[];
}

const CollectionPlatformFilter: React.FC<CollectionPlatformFilterProps> = ({
  onPlatformsChange,
  selectedPlatforms
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const { searchPlatforms } = usePlatforms();

  useEffect(() => {
    const loadPlatforms = async () => {
      const results = await searchPlatforms(searchTerm);
      setPlatforms(results);
    };
    loadPlatforms();
  }, [searchTerm, searchPlatforms]);

  const handlePlatformToggle = (platform: Platform) => {
    const isSelected = selectedPlatforms.some(p => p.id === platform.id);
    let newSelected: Platform[];

    if (isSelected) {
      newSelected = selectedPlatforms.filter(p => p.id !== platform.id);
    } else {
      newSelected = [...selectedPlatforms, platform];
    }

    onPlatformsChange(newSelected);
  };

  return (
    <FilterContainer>
      <FilterCard>
        <FilterTitle>Plataforma</FilterTitle>
        <SearchInput
          type="text"
          placeholder="Buscar plataforma"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ScrollableList>
          {platforms.map(platform => (
            <FilterItem
              key={platform.id}
              isSelected={selectedPlatforms.some(p => p.id === platform.id)}
              onClick={() => handlePlatformToggle(platform)}
            >
              {platform.name}
            </FilterItem>
          ))}
        </ScrollableList>
      </FilterCard>
    </FilterContainer>
  );
};

export default CollectionPlatformFilter;