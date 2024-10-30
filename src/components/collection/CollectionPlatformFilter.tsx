import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePlatforms } from '@/hooks/usePlatforms';

const FilterContainer = styled.div`
  width: 300px;
  margin-right: 1rem;
`;

const FilterTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--dark-grey);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
    box-shadow: 0 0 0 2px var(--app-yellow-focus);
  }
`;

const PlatformList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
`;

const PlatformItem = styled.div<{ isSelected: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? 'var(--app-yellow)' : 'white'};
  color: var(--dark-grey);
  font-size: 0.875rem;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#e6c200' : '#f5f5f5'};
  }
`;

interface Platform {
    id: number;
    name: string;
    code: string;
}

interface CollectionPlatformFilterProps {
    onPlatformsChange: (platforms: Platform[]) => void;
}

const CollectionPlatformFilter: React.FC<CollectionPlatformFilterProps> = ({ onPlatformsChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
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

        setSelectedPlatforms(newSelected);
        onPlatformsChange(newSelected);
    };

    return (
        <FilterContainer>
            <FilterTitle>Plataforma</FilterTitle>
            <SearchInput
                type="text"
                placeholder="Buscar plataforma"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <PlatformList>
                {platforms.map(platform => (
                    <PlatformItem
                        key={platform.id}
                        isSelected={selectedPlatforms.some(p => p.id === platform.id)}
                        onClick={() => handlePlatformToggle(platform)}
                    >
                        {platform.name}
                    </PlatformItem>
                ))}
            </PlatformList>
        </FilterContainer>
    );
};

export default CollectionPlatformFilter;