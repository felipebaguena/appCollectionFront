import React from 'react';
import YearRangeSelector from '@/components/ui/YearRangeSelector';
import { FilterCard, FilterContainer, FilterTitle } from './CollectionFilterElements';


interface YearRange {
    start: number | null;
    end: number | null;
}

interface CollectionYearFilterProps {
    value: YearRange | null;
    onChange: (range: YearRange | null) => void;
}

const CollectionYearFilter: React.FC<CollectionYearFilterProps> = ({
    value,
    onChange
}) => {
    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Año de lanzamiento</FilterTitle>
                <YearRangeSelector
                    value={value}
                    onChange={onChange}
                    startYear={1970}
                    endYear={new Date().getFullYear()}
                />
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionYearFilter;
