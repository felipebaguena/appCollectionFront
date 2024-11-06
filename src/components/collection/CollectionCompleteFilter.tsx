'use client';

import styled from 'styled-components';
import { FilterContainer, FilterCard, FilterTitle } from './CollectionFilterElements';
import { CompleteStatus } from '@/types/collection';
import CustomSelect from '@/components/ui/CustomSelect';

interface CollectionCompleteFilterProps {
    value: CompleteStatus;
    onChange: (value: CompleteStatus) => void;
}

const SelectContainer = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.2rem;
  width: 100%;
`;

const options = [
    { value: CompleteStatus.ALL, label: 'Todos los juegos' },
    { value: CompleteStatus.COMPLETE, label: 'Juegos completos' },
    { value: CompleteStatus.INCOMPLETE, label: 'Juegos incompletos' }
];

const CollectionCompleteFilter: React.FC<CollectionCompleteFilterProps> = ({
    value,
    onChange
}) => {
    const handleChange = (newValue: string) => {
        onChange(newValue as CompleteStatus);
    };

    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Estado de completitud</FilterTitle>
                <SelectContainer>
                    <CustomSelect
                        options={options}
                        value={value}
                        onChange={handleChange}
                        placeholder="Seleccionar estado..."
                    />
                </SelectContainer>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionCompleteFilter; 