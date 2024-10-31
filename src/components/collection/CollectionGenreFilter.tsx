import React, { useState, useEffect } from 'react';
import { useGenres } from '@/hooks/useGenres';
import { Genre } from '@/types/genre';
import {
    FilterContainer,
    FilterCard,
    FilterTitle,
    SearchInput,
    ScrollableList,
    FilterItem
} from './CollectionFilterElements';

interface CollectionGenreFilterProps {
    onGenresChange: (genres: Genre[]) => void;
    selectedGenres: Genre[];
}

const CollectionGenreFilter: React.FC<CollectionGenreFilterProps> = ({
    onGenresChange,
    selectedGenres
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genres, setGenres] = useState<Genre[]>([]);
    const { searchGenres } = useGenres();

    useEffect(() => {
        const loadGenres = async () => {
            const results = await searchGenres(searchTerm);
            setGenres(results);
        };
        loadGenres();
    }, [searchTerm, searchGenres]);

    const handleGenreToggle = (genre: Genre) => {
        const isSelected = selectedGenres.some(g => g.id === genre.id);
        let newSelected: Genre[];

        if (isSelected) {
            newSelected = selectedGenres.filter(g => g.id !== genre.id);
        } else {
            newSelected = [...selectedGenres, genre];
        }

        onGenresChange(newSelected);
    };

    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Género</FilterTitle>
                <SearchInput
                    type="text"
                    placeholder="Buscar género"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScrollableList>
                    {genres.map(genre => (
                        <FilterItem
                            key={genre.id}
                            isSelected={selectedGenres.some(g => g.id === genre.id)}
                            onClick={() => handleGenreToggle(genre)}
                        >
                            {genre.name}
                        </FilterItem>
                    ))}
                </ScrollableList>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionGenreFilter;