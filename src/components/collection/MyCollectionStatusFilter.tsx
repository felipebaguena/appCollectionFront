import React from 'react';
import {
    FilterContainer,
    FilterCard,
    FilterTitle,
    ScrollableList,
    FilterItem
} from './CollectionFilterElements';

export type MyCollectionStatus = 'ALL' | 'OWNED' | 'WISHED';

interface MyCollectionStatusFilterProps {
    value: MyCollectionStatus;
    onChange: (status: MyCollectionStatus) => void;
}

const MyCollectionStatusFilter: React.FC<MyCollectionStatusFilterProps> = ({
    value,
    onChange
}) => {
    const options = [
        { id: 'ALL', label: 'Todos' },
        { id: 'OWNED', label: 'En propiedad' },
        { id: 'WISHED', label: 'En deseados' }
    ] as const;

    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Tipo de colección</FilterTitle>
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

export default MyCollectionStatusFilter; 