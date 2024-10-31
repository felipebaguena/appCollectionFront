import React, { useState, useEffect } from 'react';
import { useDevelopers } from '@/hooks/useDevelopers';
import { Developer } from '@/types/developer';
import {
    FilterContainer,
    FilterCard,
    FilterTitle,
    SearchInput,
    ScrollableList,
    FilterItem
} from './CollectionFilterElements';

interface CollectionDeveloperFilterProps {
    onDevelopersChange: (developers: Developer[]) => void;
    selectedDevelopers: Developer[];
}

const CollectionDeveloperFilter: React.FC<CollectionDeveloperFilterProps> = ({
    onDevelopersChange,
    selectedDevelopers
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const { searchDevelopers } = useDevelopers();

    useEffect(() => {
        const loadDevelopers = async () => {
            const results = await searchDevelopers(searchTerm);
            setDevelopers(results);
        };
        loadDevelopers();
    }, [searchTerm, searchDevelopers]);

    const handleDeveloperToggle = (developer: Developer) => {
        const isSelected = selectedDevelopers.some(d => d.id === developer.id);
        let newSelected: Developer[];

        if (isSelected) {
            newSelected = selectedDevelopers.filter(d => d.id !== developer.id);
        } else {
            newSelected = [...selectedDevelopers, developer];
        }

        onDevelopersChange(newSelected);
    };

    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Desarrollador</FilterTitle>
                <SearchInput
                    type="text"
                    placeholder="Buscar desarrollador"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScrollableList>
                    {developers.map(developer => (
                        <FilterItem
                            key={developer.id}
                            isSelected={selectedDevelopers.some(d => d.id === developer.id)}
                            onClick={() => handleDeveloperToggle(developer)}
                        >
                            {developer.name}
                        </FilterItem>
                    ))}
                </ScrollableList>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionDeveloperFilter;