import React from 'react';
import {
    FilterContainer,
    FilterCard,
    FilterTitle,
    ScrollableList,
    FilterItem
} from './CollectionFilterElements';

type CollectionStatus =
    | 'ALL'
    | 'IN_COLLECTION_ALL'
    | 'IN_COLLECTION_OWNED'
    | 'IN_COLLECTION_WISHED'
    | 'NOT_IN_COLLECTION';

interface CollectionStatusFilterProps {
    value: CollectionStatus;
    onChange: (status: CollectionStatus) => void;
}

const CollectionStatusFilter: React.FC<CollectionStatusFilterProps> = ({
    value,
    onChange
}) => {
    const options = [
        { id: 'ALL', label: 'Todos' },
        { id: 'IN_COLLECTION_ALL', label: 'En colección (Todos)' },
        { id: 'IN_COLLECTION_OWNED', label: 'En propiedad' },
        { id: 'IN_COLLECTION_WISHED', label: 'En deseados' },
        { id: 'NOT_IN_COLLECTION', label: 'Fuera de colección' }
    ] as const;

    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Estado en colección</FilterTitle>
                <ScrollableList>
                    {options.map(option => (
                        <FilterItem
                            key={option.id}
                            isSelected={value === option.id}
                            onClick={() => onChange(option.id)}
                        >
                            {option.label}
                        </FilterItem>
                    ))}
                </ScrollableList>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionStatusFilter; 